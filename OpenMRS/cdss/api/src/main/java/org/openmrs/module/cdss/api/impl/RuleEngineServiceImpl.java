package org.openmrs.module.cdss.api.impl;

import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.api.APIException;
import org.openmrs.api.UserService;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.Item;
import org.openmrs.module.cdss.EngineResult;
import org.openmrs.module.cdss.api.RuleEngineService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.Rule;
import org.openmrs.module.cdss.api.util.BaseTimeUnit;
import org.openmrs.module.cdss.api.util.TimeUtil;
import org.openmrs.api.ConditionService;
import org.openmrs.Condition;

import java.util.*;

public class RuleEngineServiceImpl extends BaseOpenmrsService implements RuleEngineService {
	
	CDSSDao dao;
	
	UserService userService;
	
	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setDao(CDSSDao dao) {
		this.dao = dao;
	}
	
	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	@Override
	public Item getItemByUuid(String uuid) throws APIException {
		return dao.getItemByUuid(uuid);
	}
	
	public Item saveItem(Item item) throws APIException {
		if (item.getOwner() == null) {
			item.setOwner(userService.getUser(1));
		}
		
		return dao.saveItem(item);
	}
	
	private final Logger log = Logger.getLogger(getClass());
	
	/**
	 * Get results for a given patient and all vaccines that are avialable. It calls
	 * getLoadedVaccineRulesets() to get the vaccines
	 * 
	 * @param patient Patient to get results for.
	 * @return A list of results. Each entry corresponds to a vaccine.
	 */
	public List<EngineResult> getAllResults(Patient patient) {
		RuleManagerService service = Context.getService(RuleManagerService.class);
		
		if (patient == null) {
			log.error("CDSS Runner ERROR: Running getAllResults() on null patient! \n Returning null.");
			return null;
		}
		List<String> rulesets = getLoadedVaccineRulesets();
		ArrayList<EngineResult> results = new ArrayList<EngineResult>(rulesets.size());
		for (String vaccine : rulesets) {
			results.add(getResult(patient, vaccine));
		}
		return results;
	}
	
	/**
	 * Get vaccine results for a given patient and a specific vaccine.
	 * 
	 * @param patient Patient to get results for.
	 * @param vaccine A string that is a valid vaccine code.
	 * @return A single result given patient and a specific vaccine.
	 */
	public EngineResult getResult(Patient patient, String vaccine) {
		RuleManagerService service = Context.getService(RuleManagerService.class);
		
		if (patient == null || vaccine == null) {
			
			log.error("CDSS Runner ERROR: Running getResult() on null patient or null vaccine! \n Returning null.");
			return null;
		}
		
		//		List<Rule> rules = service.getRulesByVaccine(vaccine);
		
		List<Rule> applicableRules = new ArrayList<Rule>();
		
		// Check Medical Indications
		//		applicableRules = checkMedicalIndications(patient, rules);
		
		// Check Special Condition
		
		// Check Prexisting Record
		
		// Check Age
		applicableRules = checkAge(patient, applicableRules);
		
		if (applicableRules.size() > 0) {
			List<Action> actions = applicableRules.get(0).getActions();
			EngineResult result = new EngineResult();
			result.setPatient(patient);
			result.setVaccine(vaccine);
			result.setStatus(1);
			result.setActions(actions);
			result.setRule(applicableRules.get(0));
			
			return result;
		}
		EngineResult test = new EngineResult();
		Action action = new Action();
		action.setDisplayString("ERROR: No rule found!");
		action.setPriority(2);
		test.setPatient(patient);
		test.setVaccine(vaccine);
		test.setActions(action);
		test.setStatus(0);
		test.setRule(null);
		
		return test;
	}
	
	/**
	 * Get a list of vaccine codes that are implemented.
	 * 
	 * @return List of vaccine codes that are implemented. At the moment it only returns ["MMR",
	 *         "HPV"].
	 */
	public List<String> getLoadedVaccineRulesets() {
		return CDSSConfig.VACCINE_CODES;
	}
	
	/**
	 * Logic that is run when this service is started. At the moment, this method is not used.
	 */
	@Override
	public void onStartup() {
		log.info("CDSS Vaccine Runner service started...");
	}
	
	/**
	 * Logic that is run when this service is stopped. At the moment, this method is not used.
	 */
	@Override
	public void onShutdown() {
		log.info("CDSS Vaccine Runner service stopped...");
		
	}
	
	private List<Rule> checkMedicalIndications(Patient patient, List<Rule> rules) {
		ConditionService conditionService = Context.getService(ConditionService.class);
		HashSet<Condition> patientConditions = new HashSet<Condition>(conditionService.getActiveConditions(patient));
		List<Rule> applicableRules = new ArrayList<Rule>();
		
		if (patientConditions.size() == 0) {
			for (Rule rule : rules) {
				if (rule.getMedicalConditions() == null || rule.getMedicalConditions().size() == 0) {
					applicableRules.add(rule);
				}
			}
		} else {
			
			for (Rule rule : rules) {
				for (Condition condition : patientConditions) {
					if (rule.getMedicalConditions().contains(condition.getCondition().getCoded())) {
						applicableRules.add(rule);
					}
				}
				
			}
		}
		return applicableRules;
	}
	
	private List<Rule> checkAge(Patient patient, List<Rule> rules) {
		Date birthdate = patient.getBirthdate();
		Integer numMonths = TimeUtil.getNumberOfMonths(TimeUtil.getCurrentTime(), birthdate);
		Integer numDays = TimeUtil.getNumberOfDays(TimeUtil.getCurrentTime(), birthdate);
		List<Rule> applicableRules = new ArrayList<Rule>();
		
		for (Rule rule : rules) {
			applicableRules.add(rule);
			
			Integer ruleMinAge = rule.getMinimumAge();
			BaseTimeUnit ruleMinAgeUnit = rule.getMinimumAgeUnit();
			Integer ruleMaxAge = rule.getMaximumAge();
			BaseTimeUnit ruleMaxAgeUnit = rule.getMaximumAgeUnit();
			
			if (ruleMinAgeUnit == BaseTimeUnit.DAY && ruleMaxAgeUnit == BaseTimeUnit.DAY) {
				if (numDays > ruleMinAge && numDays < ruleMaxAge) {
					applicableRules.add(rule);
				}
			} else if (ruleMinAgeUnit == BaseTimeUnit.MONTH && ruleMaxAgeUnit == BaseTimeUnit.MONTH) {
				if (numMonths > ruleMinAge && numMonths < ruleMaxAge) {
					applicableRules.add(rule);
				}
			} else if (ruleMinAgeUnit == BaseTimeUnit.DAY && ruleMaxAgeUnit == BaseTimeUnit.MONTH) {
				if (numDays > ruleMinAge && numMonths < ruleMaxAge) {
					applicableRules.add(rule);
				}
			}
		}
		return applicableRules;
	}
}
