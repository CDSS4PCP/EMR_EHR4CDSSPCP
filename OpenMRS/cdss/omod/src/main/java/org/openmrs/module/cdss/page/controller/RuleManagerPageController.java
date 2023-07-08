package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Rule;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;
import org.springframework.stereotype.Controller;

import java.util.List;

/**
 * This is a web controller for the rule manager form
 */
@Controller
// Url for the rule editor page. It is defined in CdssConfig and by default it is module/cdss/rules.form
//@RequestMapping(value = CDSSWebConfig.RULE_MANAGER_URL)
public class RuleManagerPageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	/**
	 * Rule manager view name
	 */
	private static final String VIEW = "/module/cdss/pages/ruleManager";
	
	public String get(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		//https://wiki.openmrs.org/display/docs/Flexible%20Method%20Signatures%20for%20UI%20Framework%20Controller%20and%20Action%20Methods
		String filterVaccine = (String) request.getAttribute("filterVaccine");
		Integer deleteRuleId = request.getAttribute("deleteRuleId") == null ? null : Integer.parseInt((String) request
		        .getAttribute("deleteRuleId"));
		Integer confirmDeleteRuleId = request.getAttribute("confirmDeleteRuleId") == null ? null : Integer
		        .parseInt((String) request.getAttribute("confirmDeleteRuleId"));
		
		List<String> vaccines = service.getLoadedVaccineRulesets();
		List<Rule> rulesets;
		if (filterVaccine == null) {
			
			model.addAttribute("vaccines", vaccines);
			rulesets = service.getAllRules();
			model.addAttribute("rulesets", rulesets);
			model.addAttribute("filterVaccine", null);
			
		} else {
			
			model.addAttribute("vaccines", vaccines);
			rulesets = service.getRulesByVaccine(filterVaccine);
			model.addAttribute("rulesets", rulesets);
			model.addAttribute("filterVaccine", filterVaccine);
		}
		
		if (confirmDeleteRuleId != null) {
			
			Rule rule = service.getRuleById(confirmDeleteRuleId);
			
			String vaccine = rule.getVaccine();
			
			Boolean success = service.deleteRule(confirmDeleteRuleId);
			log.debug("Attempting deleting rule " + confirmDeleteRuleId + "    successfully? " + success);
			
			List<Rule> rules = service.getRulesByVaccine(vaccine);
			model.addAttribute("rulesets", rules);
			model.addAttribute("filterVaccine", filterVaccine);
			model.addAttribute("deleteRuleId", null);
			
			return "redirect:" + CDSSWebConfig.RULE_MANAGER_URL + "?filterVaccine=" + filterVaccine;
			
		} else if (deleteRuleId != null) {
			Rule rule = service.getRuleById(deleteRuleId);
			
			String vaccine = rule.getVaccine();
			
			//            service.deleteRule(deleteRuleId);
			
			List<Rule> rules = service.getRulesByVaccine(vaccine);
			model.addAttribute("rulesets", rules);
			
			model.addAttribute("deleteRuleId", deleteRuleId);
			
			//				            return "redirect:" + CDSSWebConfig.RULE_MANAGER_URL;
		}
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
		String filterVaccine = (String) request.getAttribute("filterVaccine");
		
		if (filterVaccine == null) {
			return get(model, request, service);
		} else {
			return "redirect:" + CDSSWebConfig.RULE_MANAGER_URL + "?filterVaccine=" + filterVaccine;
		}
	}
	
}
