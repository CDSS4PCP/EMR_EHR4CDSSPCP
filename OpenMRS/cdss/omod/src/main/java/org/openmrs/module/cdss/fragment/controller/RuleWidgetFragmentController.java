package org.openmrs.module.cdss.fragment.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Patient;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.RunnerResult;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.RuleRunnerService;
import org.openmrs.module.cdss.api.data.Rule;
import org.openmrs.ui.framework.annotation.FragmentParam;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.fragment.FragmentModel;

import java.util.List;

public class RuleWidgetFragmentController {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	public void controller(FragmentModel model, @SpringBean("ruleManagerService") RuleManagerService ruleManagerService) {
		
		List<Rule> rules = ruleManagerService.getRulesByVaccine("MMR");
		
		//        model.addAttribute("results", res);
		//        model.addAttribute("patientUuid", p.getUuid());
	}
}
