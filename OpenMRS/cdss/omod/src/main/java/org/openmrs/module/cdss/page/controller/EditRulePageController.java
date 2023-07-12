package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.ImmunizationRecordCondition;
import org.openmrs.module.cdss.api.data.Rule;
import org.openmrs.module.cdss.api.data.SpecialCondition;
import org.openmrs.module.cdss.api.util.BaseTimeUnit;
import org.openmrs.module.cdss.api.util.TimeUnit;
import org.openmrs.module.cdss.api.util.TimeUtil;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.util.List;

public class EditRulePageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		Integer editRuleId = request.getAttribute("editRuleId") != null ? Integer.parseInt((String) request
		        .getAttribute("editRuleId")) : null;
		
		if (editRuleId == null) {
			return "redirect:" + CDSSWebConfig.RULE_MANAGER_URL;
		}
		
		List<String> vaccines = service.getLoadedVaccineRulesets();
		List<Action> actions = service.getAllActions();
		
		Rule rule = service.getRuleById(editRuleId);
		
		model.addAttribute("rule", rule);
		model.addAttribute("vaccines", vaccines);
		model.addAttribute("actions", actions);
		
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
		String minAgeUnitString = (String) request.getAttribute("min-age-unit");
		Integer maxAge = maxAgeString.length() == 0 ? CDSSConfig.RULE_MAXIMUM_AGE : Integer.parseInt(maxAgeString);
		String maxAgeUnitString = (String) request.getAttribute("max-age-unit");
		
		TimeUnit minAgeUnit = TimeUnit.valueOf(minAgeUnitString.toUpperCase());
		TimeUnit maxAgeUnit = TimeUnit.valueOf(maxAgeUnitString.toUpperCase());
		
		BaseTimeUnit minAgeBaseUnit = TimeUtil.getBaseTimeUnit(minAgeUnit);
		BaseTimeUnit maxAgeBaseUnit = TimeUtil.getBaseTimeUnit(maxAgeUnit);
		Integer minAgeValue = TimeUtil.convertToBaseUnit(minAge, minAgeUnit);
		Integer maxAgeValue = TimeUtil.convertToBaseUnit(maxAge, maxAgeUnit);
		
		Boolean specialConditionExists = parseCheckboxValue((String) request.getAttribute("special-condition-exists"));
		
		String specialConditionLabel = (String) request.getAttribute("special-condition");
		String outbreakCondition = (String) request.getAttribute("outbreak-condition");
		Boolean collegeStudent = parseCheckboxValue((String) request.getAttribute("college-student"));
		Boolean militaryWorker = parseCheckboxValue((String) request.getAttribute("military-worker"));
		Boolean travelCondition = parseCheckboxValue((String) request.getAttribute("travel-condition"));
		
		SpecialCondition specialCondition = new SpecialCondition(specialConditionLabel, collegeStudent, militaryWorker,
		        travelCondition);
		
		Boolean immunizationRecordExists = parseCheckboxValue((String) request.getAttribute("immunization-record-exists"));
		
		String numPrevDosesString = (String) request.getAttribute("num-prev-doses");
		Integer numPrevDoses = numPrevDosesString.length() == 0 ? 0 : Integer.parseInt(numPrevDosesString);
		
		ImmunizationRecordCondition immunizationRecordCondition = new ImmunizationRecordCondition(vaccine, numPrevDoses);
		
		for (int doseIndex = 1; doseIndex <= numPrevDoses; doseIndex++) {
			String doseTimeInterval = (String) request.getAttribute("time-interval-" + doseIndex);
			String doseMinAge = (String) request.getAttribute("time-interval-" + doseIndex + "-min-age");
			String doseMaxAge = (String) request.getAttribute("time-interval-" + doseIndex + "-max-age");
			
			Boolean doseTimeIntervalEmpty = doseTimeInterval == null || doseTimeInterval.trim().equals("");
			Boolean doseMinAgeEmpty = doseMinAge == null || doseMinAge.trim().equals("");
			Boolean doseMaxAgeEmpty = doseMaxAge == null || doseMaxAge.trim().equals("");
			
			if (doseTimeIntervalEmpty && doseMinAgeEmpty && doseMaxAgeEmpty) {
				throw new RuntimeException("Dose " + doseIndex
				        + " does not have any constraints, namely time interval, min age, max age");
			}
			
			if (!doseTimeIntervalEmpty) {
				Integer time = Integer.parseInt(doseTimeInterval);
				immunizationRecordCondition.setDoseTimePeriod(doseIndex - 1, time);
			}
			if (!doseMinAgeEmpty) {
				Integer time = Integer.parseInt(doseMinAge);
				immunizationRecordCondition.setDoseMinAge(doseIndex - 1, time);
			}
			if (!doseMaxAgeEmpty) {
				Integer time = Integer.parseInt(doseMaxAge);
				immunizationRecordCondition.setDoseMaxAge(doseIndex - 1, time);
			}
		}
		
		String[] selectedIndicationStrings = request.getRequest().getParameterValues("indications");
		
		String[] selectedActionStrings = request.getRequest().getParameterValues("actions");
		
		if (selectedActionStrings != null) {
			Action[] selectedActions = new Action[selectedActionStrings.length];
			
			for (int i = 0; i < selectedActionStrings.length; i++) {
				selectedActions[i] = service.getActionById(Integer.parseInt(selectedActionStrings[i]));
			}
			
			Rule newRule = new Rule(vaccine, minAgeValue, maxAgeValue, selectedActions);
			newRule.setMinimumAgeUnit(minAgeBaseUnit);
			newRule.setMaximumAgeUnit(maxAgeBaseUnit);
			
			if (specialConditionExists)
				newRule.setSpecialCondition(specialCondition);
			
			if (immunizationRecordExists) {
				log.debug(immunizationRecordCondition);
				newRule.setPreviousRecord(immunizationRecordCondition);
			}
			
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
