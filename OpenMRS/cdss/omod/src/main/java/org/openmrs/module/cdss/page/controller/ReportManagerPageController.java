package org.openmrs.module.cdss.page.controller;

import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

public class ReportManagerPageController {
	
	public String get(PageModel model, @SpringBean("cdss.RuleLoggerServiceImpl") RuleLoggerService service) {
		//https://wiki.openmrs.org/display/docs/Flexible%20Method%20Signatures%20for%20UI%20Framework%20Controller%20and%20Action%20Methods
		
		model.addAttribute("numActionsTaken", service.getNumberOfActionsTaken());
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleLoggerServiceImpl") RuleLoggerService service) {
		
		return get(model, service);
		
	}
}
