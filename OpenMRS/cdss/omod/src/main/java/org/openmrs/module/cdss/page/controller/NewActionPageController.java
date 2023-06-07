package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

public class NewActionPageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		String message = (String) request.getAttribute("text");
		Integer priority = Integer.parseInt((String) request.getAttribute("priority"));
		
		Action newAction = new Action();
		newAction.setDisplayString(message);
		newAction.setPriority(priority);
		
		service.addAction(newAction);
		
		return "redirect:" + CDSSWebConfig.ACTION_MANAGER_URL;
	}
}
