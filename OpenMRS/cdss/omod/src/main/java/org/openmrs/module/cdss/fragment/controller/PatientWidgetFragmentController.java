package org.openmrs.module.cdss.fragment.controller;

import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.RunnerResult;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.RuleEngineService;
import org.openmrs.ui.framework.annotation.FragmentParam;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.fragment.FragmentModel;

import java.util.List;

/**
 * Controller for the patient cdss widget. This widget will be displayed on the patient dashboard.
 */
public class PatientWidgetFragmentController {
	
	private final Logger log = Logger.getLogger(getClass());
	
	/**
	 * The controller method for the widget. The corresponding view file is
	 * "src/main/webapp/fragments/patientWidget.gsp".
	 * 
	 * @param patientId Required param to identify the patient. NOTE: This the patient's id, not
	 *            uuid !!!
	 * @param model The model that will contain our data to be rendered.
	 * @param patientService OpenMRS's patient service to be able to get patient data based on id.
	 */
	public void controller(@FragmentParam(value = "patientId", required = true) Integer patientId, FragmentModel model,
	        @SpringBean("patientService") PatientService patientService,
	        @SpringBean("cdss.RuleManagerServiceImpl") RuleManagerService service) {
		
		Patient p = patientService.getPatient(patientId);
		RuleEngineService vc = Context.getService(RuleEngineService.class);
		
		List<RunnerResult> res = vc.getAllResults(p);
		
		model.addAttribute("results", res);
		model.addAttribute("patientUuid", p.getUuid());
	}
}
