package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Rule;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * This is a web controller for the rule manager form
 */
@Controller()
// Url for the rule editor page. It is defined in CdssConfig and by default it is module/cdss/rules.form
@RequestMapping(value = CDSSWebConfig.RULE_MANAGER_URL)
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
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView onGet(WebRequest request) {
		RuleManagerService vc = Context.getService(RuleManagerService.class);
		
		ModelAndView model = new ModelAndView(VIEW);
		String vaccine = "MMR";
		List<Rule> rules = vc.getRulesByVaccine(vaccine);
		rules.sort(new Rule.RuleVaccineComparator());
		
		model.addObject("rulesets", rules);
		model.addObject("vaccines", vc.getLoadedVaccineRulesets());
		
		model.addObject("clarifyVaccineNeeded", true);
		
		return model;
		
	}
	
	/**
	 * This method executes when the form is requested with an HTTP Post request. It displays the
	 * VIEW with a list of vaccine codes. In the future, this can be used to update the rules and
	 * the update variables can be passed with the @RequestParam annotation.
	 * 
	 * @return Returns same as onGet.
	 */
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
	
}
