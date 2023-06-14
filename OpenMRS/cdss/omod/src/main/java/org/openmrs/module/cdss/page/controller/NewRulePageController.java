package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.Rule;
import org.openmrs.module.cdss.api.data.SpecialCondition;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.util.List;

public class NewRulePageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		Integer editRuleId = request.getAttribute("editRuleId") != null ? Integer.parseInt((String) request
		        .getAttribute("editRuleId")) : null;
		
		List<String> vaccines = service.getLoadedVaccineRulesets();
		List<Action> actions = service.getAllActions();
		
		model.addAttribute("vaccines", vaccines);
		model.addAttribute("actions", actions);
		model.addAttribute("selectedActions", "");
		model.addAttribute("ruleAddedError", false);
		
		if (editRuleId != null) {
			Rule rule = service.getRuleById(editRuleId);
			String vaccine = rule.getVaccine();
			Integer minAge = rule.getMinimumAge();
			Integer maxAge = rule.getMaximumAge();
			SpecialCondition specialCondition = rule.getSpecialCondition();
			String immunizationCondition = rule.getPreviousRecord();
			
			String[] conditions = rule.getMedicalConditions();
			Action[] presetActions = rule.getActions();
			
			model.addAttribute("presetVaccine", vaccine);
			model.addAttribute("presetMinAge", minAge);
			model.addAttribute("presetMaxAge", maxAge);
			model.addAttribute("presetSpecialCondition", specialCondition.getLabel());
			model.addAttribute("presetSpecialConditionCollegeStudent", specialCondition.getCollegeStudent());
			model.addAttribute("presetSpecialConditionMilitaryWorker", specialCondition.getMilitaryWorker());
			model.addAttribute("presetSpecialConditionTravel", specialCondition.getTravel());
			model.addAttribute("presetImmunizationCondition",
			    immunizationCondition == null ? null : Integer.parseInt(immunizationCondition));
			model.addAttribute("presetActions", presetActions);
			model.addAttribute("presetIndications", conditions);
			
		} else {
			setNoEditModAttributes(model);
		}
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
		Integer editRuleId = request.getAttribute("editRuleId") != null ? Integer.parseInt((String) request
		        .getAttribute("editRuleId")) : null;
		
		List<String> vaccines = service.getLoadedVaccineRulesets();
		List<Action> actions = service.getAllActions();
		
		model.addAttribute("vaccines", vaccines);
		model.addAttribute("actions", actions);
		
		String vaccine = (String) request.getAttribute("vaccine");
		
		String minAgeString = (String) request.getAttribute("min-age");
		String maxAgeString = (String) request.getAttribute("max-age");
		
		Integer minAge = minAgeString.length() == 0 ? CDSSConfig.RULE_MINIMUM_AGE : Integer.parseInt(minAgeString);
		String minAgeUnit = (String) request.getAttribute("min-age-unit");
		Integer maxAge = maxAgeString.length() == 0 ? CDSSConfig.RULE_MAXIMUM_AGE : Integer.parseInt(maxAgeString);
		String maxAgeUnit = (String) request.getAttribute("max-age-unit");
		
		Boolean specialConditionExists = parseCheckboxValue((String) request.getAttribute("special-condition-exists"));
		
		String specialConditionLabel = (String) request.getAttribute("special-condition");
		String outbreakCondition = (String) request.getAttribute("outbreak-condition");
		Boolean collegeStudent = parseCheckboxValue((String) request.getAttribute("college-student"));
		Boolean militaryWorker = parseCheckboxValue((String) request.getAttribute("military-worker"));
		Boolean travelCondition = parseCheckboxValue((String) request.getAttribute("travel-condition"));
		
		SpecialCondition specialCondition = new SpecialCondition(specialConditionLabel, collegeStudent, militaryWorker,
		        travelCondition);
		
		log.debug("SpecialCondition: " + specialCondition);
		Boolean immunizationRecordExists = parseCheckboxValue((String) request.getAttribute("immunization-record-exists"));
		
		String numPrevDosesString = (String) request.getAttribute("num-prev-doses");
		Integer numPrevDoses = numPrevDosesString.length() == 0 ? 0 : Integer.parseInt(numPrevDosesString);
		
		String[] selectedIndicationStrings = request.getRequest().getParameterValues("indications");
		
		String[] selectedActionStrings = request.getRequest().getParameterValues("actions");
		
		if (selectedActionStrings != null) {
			Action[] selectedActions = new Action[selectedActionStrings.length];
			
			for (int i = 0; i < selectedActionStrings.length; i++) {
				selectedActions[i] = service.getActionById(Integer.parseInt(selectedActionStrings[i]));
			}
			
			Rule newRule = new Rule(vaccine, minAge, maxAge, selectedActions);
			
			if (specialConditionExists)
				newRule.setSpecialCondition(specialCondition);
			
			if (immunizationRecordExists)
				newRule.setPreviousRecord(numPrevDoses + "");
			
			if (selectedIndicationStrings != null && selectedIndicationStrings.length > 0)
				newRule.setMedicalConditions(selectedIndicationStrings);
			
			Boolean success;
			if (editRuleId == null)
				success = !service.addRule(newRule);
			else
				success = !service.modifyRule(editRuleId, newRule);
			model.addAttribute("ruleAddedError", success);
			
			if (success) {
				return null;
			}
		} else {
			model.addAttribute("ruleAddedError", true);
			return null;
			
		}
		
		return "redirect:" + CDSSWebConfig.RULE_MANAGER_URL;
	}
	
	private Boolean parseCheckboxValue(String value) {
		
		if (value == null) {
			return false;
		}
		if (value.toLowerCase().trim().equals("on") || value.toLowerCase().trim().equals("true")) {
			return true;
		} else {
			return false;
		}
	}
	
	private PageModel setNoEditModAttributes(PageModel model) {
		
		model.addAttribute("presetVaccine", null);
		model.addAttribute("presetMinAge", null);
		model.addAttribute("presetMaxAge", null);
		model.addAttribute("presetSpecialCondition", null);
		model.addAttribute("presetSpecialConditionCollegeStudent", null);
		model.addAttribute("presetSpecialConditionMilitaryWorker", null);
		model.addAttribute("presetSpecialConditionTravel", null);
		model.addAttribute("presetImmunizationCondition", null);
		model.addAttribute("presetActions", null);
		model.addAttribute("presetIndications", null);
		
		return model;
	}
}
