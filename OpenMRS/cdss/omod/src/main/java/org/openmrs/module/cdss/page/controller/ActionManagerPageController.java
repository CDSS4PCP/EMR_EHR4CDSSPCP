package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.util.List;

public class ActionManagerPageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		//https://wiki.openmrs.org/display/docs/Flexible%20Method%20Signatures%20for%20UI%20Framework%20Controller%20and%20Action%20Methods
		
		List<Action> actions = service.getAllActions();
		
		model.addAttribute("actions", actions);
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
		List<Action> actions = service.getAllActions();
		
		model.addAttribute("actions", actions);
		return null;
	}
}
