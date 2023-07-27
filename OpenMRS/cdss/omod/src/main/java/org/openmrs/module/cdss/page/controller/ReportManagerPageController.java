package org.openmrs.module.cdss.page.controller;

import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.time.ZonedDateTime;
import java.util.Hashtable;
import java.util.List;

public class ReportManagerPageController {
	
	public String get(PageModel model, @SpringBean("cdss.RuleLoggerServiceImpl") RuleLoggerService service) {
		//https://wiki.openmrs.org/display/docs/Flexible%20Method%20Signatures%20for%20UI%20Framework%20Controller%20and%20Action%20Methods
		
		List<String> vaccines = service.getLoadedVaccineRulesets();
		model.addAttribute("numActionsTaken", service.getNumberOfActionsTaken());
		model.addAttribute("numActionsTakenPastWeek",
		    service.getNumberOfActionsTakenWithinTimeRange(ZonedDateTime.now(), ZonedDateTime.now().minusWeeks(1)));
		model.addAttribute("vaccines", vaccines);
		
		Hashtable<String, Integer> actionsTakenByVaccine = new Hashtable<String, Integer>();
		
		for (String vaccine : vaccines) {
			actionsTakenByVaccine.put(vaccine, service.getNumberOfActionsTakenByVaccine(vaccine));
			
		}
		model.addAttribute("actionsTakenByVaccine", actionsTakenByVaccine);
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleLoggerServiceImpl") RuleLoggerService service) {
		
		return get(model, service);
		
	}
}
