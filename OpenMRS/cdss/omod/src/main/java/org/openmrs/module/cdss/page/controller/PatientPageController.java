package org.openmrs.module.cdss.page.controller;

import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.CDSSWebConfig;
import org.openmrs.module.cdss.RunnerResult;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.RuleRunnerService;
import org.openmrs.ui.framework.annotation.SpringBean;
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
@Controller()
// Url for the patient results page. It is defined in CdssConfig and by default it is module/cdss/results.form
@RequestMapping(value = CDSSWebConfig.RESULTS_URL)
public class PatientPageController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	/**
	 * Patient results view name
	 */
	private static final String VIEW = "/module/cdss/pages/patientPage";
	
	/**
	 * This method executes on an HTTP Get request. It needs patientId to know which patient
	 * 
	 * @param patientUuid The id of the patient. Must be a Uuid.
	 * @param ruleset The vaccine that the request is for. If not provided, all vaccine results will
	 *            be displayed.
	 * @return ModelAndView for a patient results page
	 */
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView onGet(@RequestParam(value = "patientUuid", required = true) String patientUuid,
	        @RequestParam(value = "ruleset", required = false) String ruleset,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
		RuleRunnerService vc = Context.getService(RuleRunnerService.class);
		PatientService patientService = Context.getPatientService();
		Patient patient = patientService.getPatientByUuid(patientUuid);
		
		ModelAndView mv = new ModelAndView(VIEW);
		mv.addObject("givenName", patient.getGivenName());
		mv.addObject("familyName", patient.getFamilyName());
		mv.addObject("patientId", patientUuid);
		
		List<String> loadedRulesets = vc.getLoadedVaccineRulesets();
		HashMap<String, RunnerResult> results = new HashMap<String, RunnerResult>();
		
		if (ruleset == null) {
			for (RunnerResult res : vc.getAllResults(patient, service)) {
				results.put(res.getVaccine(), res);
			}
			mv.addObject("results", results);
		} else {
			if (loadedRulesets.contains(ruleset)) {
				
				RunnerResult result = vc.getResult(patient, ruleset, service);
				results.put(result.getVaccine(), result);
				mv.addObject("results", results);
				
			} else {
				mv.addObject("results", results);
			}
		}
		return mv;
	}
	
}
