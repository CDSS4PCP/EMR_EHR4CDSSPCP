package org.openmrs.module.cdss.fragment.controller;

import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;

public class RuleWidgetFragmentController {
	
	public String controller(PageModel model, @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
		return null;
	}
	
}
