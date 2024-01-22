package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.EngineResult;
import org.openmrs.module.cdss.api.RuleEngineService;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * This is a web controller for the patient results page.
 */
//@Controller()
// Url for the patient results page. It is defined in CdssConfig and by default it is module/cdss/results.form
//@RequestMapping(value = CDSSWebConfig.RESULTS_URL)
public class PatientPageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	public String get(PageModel model, PageRequest request, @SpringBean("patientService") PatientService patientService) {
		
		model.addAttribute("error", null);
		model.addAttribute("disabledResults", new ArrayList<String>());
		
		String patientUuid = (String) request.getAttribute("patientUuid");
		
		if (patientUuid == null) {
			return "redirect:" + CDSSWebConfig.ERROR_URL;
		}
		
		Patient patient = patientService.getPatientByUuid(patientUuid);
		
		model.addAttribute("givenName", patient.getGivenName());
		model.addAttribute("familyName", patient.getFamilyName());
		model.addAttribute("patientId", patientUuid);
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request, @SpringBean("patientService") PatientService patientService) {
		
		return get(model, request, patientService);
	}
	
}
