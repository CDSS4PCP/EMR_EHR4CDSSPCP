package org.openmrs.module.cdss.page.controller;

import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

public class ErrorPageController {
	
	public String post(PageModel model, PageRequest request) {
		String nonExistentRuleId = (String) request.getAttribute("nonExistentRuleId");
		if (nonExistentRuleId != null) {
			model.addAttribute("nonExistentRuleId", nonExistentRuleId);
		} else {
			model.addAttribute("nonExistentRuleId", null);
			
		}
		return null;
	}
	
	public String get(PageModel model, PageRequest request) {
		String nonExistentRuleId = (String) request.getAttribute("nonExistentRuleId");
		if (nonExistentRuleId != null) {
			model.addAttribute("nonExistentRuleId", nonExistentRuleId);
		} else {
			model.addAttribute("nonExistentRuleId", null);
			
		}
		return null;
		
	}
	
}
