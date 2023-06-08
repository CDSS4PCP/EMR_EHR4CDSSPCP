package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.Rule;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.util.List;

public class NewRulePageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		List<String> vaccines = service.getLoadedVaccineRulesets();
		List<Action> actions = service.getAllActions();
		
		model.addAttribute("vaccines", vaccines);
		model.addAttribute("actions", actions);
		model.addAttribute("selectedActions", "");
		model.addAttribute("ruleAddedError", false);
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
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
		
		String specialCondition = (String) request.getAttribute("special-condition");
		String outbreakCondition = (String) request.getAttribute("outbreak-condition");
		Boolean collegeStudent = Boolean.parseBoolean((String) request.getAttribute("college-student"));
		Boolean militaryWorker = Boolean.parseBoolean((String) request.getAttribute("military-worker"));
		Boolean travelCondition = Boolean.parseBoolean((String) request.getAttribute("travel-condition"));
		
		String[] selectedActionStrings = request.getRequest().getParameterValues("actions");
		
		if (selectedActionStrings != null) {
			Action[] selectedActions = new Action[selectedActionStrings.length];
			
			for (int i = 0; i < selectedActionStrings.length; i++) {
				selectedActions[i] = service.getActionById(Integer.parseInt(selectedActionStrings[i]));
			}
			
			Rule newRule = new Rule(vaccine, minAge, maxAge, selectedActions);
			Boolean success = !service.addRule(newRule);
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
}
