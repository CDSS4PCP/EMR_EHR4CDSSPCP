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
	
	public String get(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleEngineServiceImpl") RuleEngineService engineService,
	        @SpringBean("cdss.RuleLoggerServiceImpl") RuleLoggerService loggerService,
	        @SpringBean("patientService") PatientService patientService) {
		
		model.addAttribute("error", null);
		model.addAttribute("disabledResults", new ArrayList<String>());
		
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
		HashMap<String, EngineResult> results = new HashMap<String, EngineResult>();
		if (ruleset == null) {
			for (EngineResult res : engineService.getAllResults(patient)) {
				results.put(res.getVaccine(), res);
			}
			model.addAttribute("results", results);
		} else {
			if (loadedRulesets.contains(ruleset)) {
				EngineResult result = engineService.getResult(patient, ruleset);
				results.put(result.getVaccine(), result);
				model.addAttribute("results", results);
			} else {
				model.addAttribute("results", results);
			}
		}
		
		List<String> disabledResults = new ArrayList<String>();
		for (EngineResult result : results.values()) {
			if (loggerService.isActionTaken(result.getId())) {
				disabledResults.add(result.getId());
			}
		}
		
		model.addAttribute("disabledResults", disabledResults);
		
		if (request.getAttribute("takeAction") != null) {
			String resultUuid = (String) request.getAttribute("takeAction");
			
			EngineResult result = null;
			
			for (EngineResult res : results.values()) {
				if (res.getId().equals(resultUuid)) {
					result = res;
				}
			}
			
			if (result == null) {
				log.debug("ERROR: No result found for uuid: " + resultUuid);
				log.debug("Results: " + results);
			} else {
				
				loggerService.recordRuleHit(ZonedDateTime.now(), result, true, Context.getAuthenticatedUser(),
				    Context.getAuthenticatedUser());
				return "redirect:" + "/coreapps/clinicianfacing/patient.page?patientId=" + patientUuid;
			}
			
		}
		
		return null;
	}
	
	public String post(PageModel model, PageRequest request,
	        @SpringBean("cdss.RuleEngineServiceImpl") RuleEngineService engineService,
	        @SpringBean("cdss.RuleLoggerServiceImpl") RuleLoggerService loggerService,
	        @SpringBean("patientService") PatientService patientService) {
		
		return get(model, request, engineService, loggerService, patientService);
	}
	
}
