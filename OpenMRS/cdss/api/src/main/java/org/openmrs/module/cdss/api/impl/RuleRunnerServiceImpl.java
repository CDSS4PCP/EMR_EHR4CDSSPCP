package org.openmrs.module.cdss.api.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.api.APIException;
import org.openmrs.api.UserService;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.Item;
import org.openmrs.module.cdss.RunnerResult;
import org.openmrs.module.cdss.api.RuleRunnerService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.Action;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class RuleRunnerServiceImpl extends BaseOpenmrsService implements RuleRunnerService {
	
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
	
	// Random is used to generate random vaccine results for simply displaying VaccineRunnerService's functionality.
	// In the future, this will replace by database queries for a more deterministic and accurate outcome.
	final Random random = new Random();
	
	/**
	 * Get results for a given patient and all vaccines that are avialable. It calls
	 * getLoadedVaccineRulesets() to get the vaccines
	 * 
	 * @param patient Patient to get results for.
	 * @return A list of results. Each entry corresponds to a vaccine.
	 */
	public List<RunnerResult> getAllResults(Patient patient) {
		if (patient == null) {
			log.error("CDSS Runner ERROR: Running getAllResults() on null patient! \n Returning null.");
			return null;
		}
		List<String> rulesets = getLoadedVaccineRulesets();
		ArrayList<RunnerResult> results = new ArrayList<RunnerResult>(rulesets.size());
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
	public RunnerResult getResult(Patient patient, String vaccine) {
		if (patient == null || vaccine == null) {
			
			log.error("CDSS Runner ERROR: Running getResult() on null patient or null vaccine! \n Returning null.");
			return null;
		}
		RunnerResult result = new RunnerResult();
		result.setPatient(patient);
		result.setVaccine(vaccine);
		int status = random.nextInt(2);
		
		Action action = new Action();
		
		if (status == 0) {
			//			result.setAction("No further action needed");
			action.setDisplayString("No further action needed");
			result.setAction(action);
		} else {
			//			result.setAction("New dose needs to be administered");
			action.setDisplayString("New dose needs to be administered");
			result.setAction(action);
		}
		result.setStatus(status);
		return result;
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
}
