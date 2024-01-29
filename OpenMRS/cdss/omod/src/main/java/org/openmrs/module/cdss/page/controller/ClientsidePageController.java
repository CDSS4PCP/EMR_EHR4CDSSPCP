package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.api.PatientService;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.util.List;

public class ClientsidePageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, PageRequest request, @SpringBean("patientService") PatientService patientService) {
		//https://wiki.openmrs.org/display/docs/Flexible%20Method%20Signatures%20for%20UI%20Framework%20Controller%20and%20Action%20Methods
		
		// can be accessed by http://localhost:8080/openmrs/cdss/clientside.page?patientUuid=fbcbf727-5cd9-472f-9079-abe9b891d49a
		String patientUuid = (String) request.getAttribute("patientId");
		if (patientUuid == null) {
			return "redirect:" + CDSSWebConfig.ERROR_URL;
		}
		model.addAttribute("patientId", patientUuid);
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request, @SpringBean("patientService") PatientService patientService) {
		
		return get(model, request, patientService);
	}
}
