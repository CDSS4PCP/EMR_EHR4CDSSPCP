package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.RunnerResult;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.RuleEngineService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

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
	
	public String get(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleEngineServiceImpl") RuleEngineService engineService,
	        @SpringBean("patientService") PatientService patientService) {
		model.addAttribute("error", null);
		
		String patientUuid = (String) request.getAttribute("patientUuid");
		
		if (patientUuid == null) {
			return "redirect:" + CDSSWebConfig.ERROR_URL;
		}
		String ruleset = (String) request.getAttribute("ruleset");
		
		Patient patient = patientService.getPatientByUuid(patientUuid);
		
		model.addAttribute("givenName", patient.getGivenName());
		model.addAttribute("familyName", patient.getFamilyName());
		model.addAttribute("patientId", patientUuid);
		
		List<String> loadedRulesets = engineService.getLoadedVaccineRulesets();
		HashMap<String, RunnerResult> results = new HashMap<String, RunnerResult>();
		if (ruleset == null) {
			for (RunnerResult res : engineService.getAllResults(patient)) {
				results.put(res.getVaccine(), res);
			}
			model.addAttribute("results", results);
		} else {
			if (loadedRulesets.contains(ruleset)) {
				RunnerResult result = engineService.getResult(patient, ruleset);
				results.put(result.getVaccine(), result);
				model.addAttribute("results", results);
			} else {
				model.addAttribute("results", results);
			}
		}
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleEngineServiceImpl") RuleEngineService engineService,
	        @SpringBean("patientService") PatientService patientService) {
		
		return get(model, request, engineService, patientService);
	}
	
}
