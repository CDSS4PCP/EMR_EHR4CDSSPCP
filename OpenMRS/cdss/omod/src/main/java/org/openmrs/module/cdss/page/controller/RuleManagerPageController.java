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
	
	/**
	 * This method executes when the form is requested with an HTTP Get request. It displays the
	 * VIEW with a list of vaccine codes.
	 * 
	 * @return Returns a ModelAndView with a list of vaccines keyed by "rulesets"
	 */
	//    @RequestMapping(method = RequestMethod.GET)
	//    public ModelAndView onGet(FragmentConfiguration config, FragmentModel model) {
	//        RuleManagerService vc = Context.getService(RuleManagerService.class);
	//
	//        ModelAndView model = new ModelAndView(VIEW);
	//        String vaccine = "MMR";
	//        List<Rule> rules = vc.getRulesByVaccine(vaccine);
	//        rules.sort(new Rule.RuleVaccineComparator());
	//
	//        model.addObject("rulesets", rules);
	//        model.addObject("vaccines", vc.getLoadedVaccineRulesets());
	//
	//        model.addObject("clarifyVaccineNeeded", true);
	//
	//        return model;
	//
	//    }
	
	/**
	 * This method executes when the form is requested with an HTTP Post request. It displays the
	 * VIEW with a list of vaccine codes. In the future, this can be used to update the rules and
	 * the update variables can be passed with the @RequestParam annotation.
	 * 
	 * @return Returns same as onGet.
	 */
	/*
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView onPost(WebRequest request) {

		RuleManagerService vc = Context.getService(RuleManagerService.class);
		ModelAndView model = new ModelAndView(VIEW);

		String vaccine = request.getParameter("vaccine");
		List<Rule> rules = vc.getRulesByVaccine(vaccine);
		rules.sort(new Rule.RuleVaccineComparator());

		model.addObject("rulesets", rules);
		model.addObject("clarifyVaccineNeeded", false);
		model.addObject("vaccines", vc.getLoadedVaccineRulesets());
		return model;
	}
	*/
	//	@RequestMapping(method = RequestMethod.GET)
	public String get(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		//https://wiki.openmrs.org/display/docs/Flexible%20Method%20Signatures%20for%20UI%20Framework%20Controller%20and%20Action%20Methods
		List<String> vaccines = service.getLoadedVaccineRulesets();
		
		model.addAttribute("vaccines", vaccines);
		
		Integer deleteRuleId = request.getAttribute("deleteRuleId") == null ? null : Integer.parseInt((String) request
		        .getAttribute("deleteRuleId"));
		if (deleteRuleId == null) {
			
			model.addAttribute("clarifyVaccineNeeded", true);
			model.addAttribute("deleteRuleId", null);
			return null;
		} else {
			
			if (request.getAttribute("confirmDeleteRuleId") != null) {
				Integer confirmDeleteRuleId = request.getAttribute("confirmDeleteRuleId") == null ? null : Integer
				        .parseInt((String) request.getAttribute("confirmDeleteRuleId"));
				Rule rule = service.getRuleById(confirmDeleteRuleId);
				
				String vaccine = rule.getVaccine();
				
				log.debug("Attempting deleting rule " + confirmDeleteRuleId);
				Boolean success = service.deleteRule(confirmDeleteRuleId);
				
				List<Rule> rules = service.getRulesByVaccine(vaccine);
				model.addAttribute("rulesets", rules);
				
				model.addAttribute("clarifyVaccineNeeded", false);
				model.addAttribute("deleteRuleId", null);
				
				return null;
				
			} else {
				Rule rule = service.getRuleById(deleteRuleId);
				if (rule == null) {
					return "redirect:" + CDSSWebConfig.ERROR_URL + "?nonExistentRuleId=" + deleteRuleId;
					
				}
				
				String vaccine = rule.getVaccine();
				
				//            service.deleteRule(deleteRuleId);
				
				List<Rule> rules = service.getRulesByVaccine(vaccine);
				model.addAttribute("rulesets", rules);
				
				model.addAttribute("clarifyVaccineNeeded", false);
				model.addAttribute("deleteRuleId", deleteRuleId);
				
				//            return "redirect:" + CDSSWebConfig.RULE_MANAGER_URL;
				return null;
			}
		}
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		String vaccine = (String) request.getAttribute("vaccine");
		
		if (request.getAttribute("confirmDeleteRuleId") != null) {
			Integer confirmDeleteRuleId = request.getAttribute("confirmDeleteRuleId") == null ? null : Integer
			        .parseInt((String) request.getAttribute("confirmDeleteRuleId"));
			
			Rule rule = service.getRuleById(confirmDeleteRuleId);
			if (rule == null) {
				return "redirect:" + CDSSWebConfig.ERROR_URL + "?nonExistentRuleId=" + confirmDeleteRuleId;
				
			}
			vaccine = rule.getVaccine();
			
			Boolean success = service.deleteRule(confirmDeleteRuleId);
			log.debug("Attempting deleting rule " + confirmDeleteRuleId + " success: " + success);
			
		}
		List<Rule> rules = service.getRulesByVaccine(vaccine);
		model.addAttribute("clarifyVaccineNeeded", false);
		model.addAttribute("deleteRuleId", null);
		
		model.addAttribute("rulesets", rules);
		return null;
		
	}
}
