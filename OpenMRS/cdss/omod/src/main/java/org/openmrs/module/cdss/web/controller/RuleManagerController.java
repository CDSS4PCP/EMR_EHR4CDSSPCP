package org.openmrs.module.cdss.web.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * This is a web controller for the rule manager form
 */
@Controller()
// Url for the rule editor page. It is defined in CdssConfig and by default it is module/cdss/rules.form
@RequestMapping(value = CDSSWebConfig.RULE_MANAGER_URL)
public class RuleManagerController {
	
	protected final Log log = LogFactory.getLog(getClass());
	
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
	public ModelAndView onGet() {
		
		RuleManagerService vc = Context.getService(RuleManagerService.class);
		ModelAndView mv = new ModelAndView(VIEW);
		mv.addObject("rulesets", vc.getRulesByVaccine("MMR"));
		return mv;
		
	}
	
	/**
	 * This method executes when the form is requested with an HTTP Post request. It displays the
	 * VIEW with a list of vaccine codes. In the future, this can be used to update the rules and
	 * the update variables can be passed with the @RequestParam annotation.
	 * 
	 * @return Returns same as onGet.
	 */
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView onPost() {
		
		return onGet();
	}
	
}
