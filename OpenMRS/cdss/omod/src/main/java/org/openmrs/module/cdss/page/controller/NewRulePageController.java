package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.util.List;

public class NewRulePageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		List<String> vaccines = service.getLoadedVaccineRulesets();
		
		model.addAttribute("vaccines", vaccines);
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		List<String> vaccines = service.getLoadedVaccineRulesets();
		
		model.addAttribute("vaccines", vaccines);
		
		return null;
	}
}
