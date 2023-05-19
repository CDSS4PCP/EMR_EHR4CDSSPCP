package org.openmrs.module.cdss.api;

import org.openmrs.Patient;
import org.openmrs.module.cdss.api.data.Action;

import java.util.Date;

public interface RuleLoggerService extends CDSSService {
	
	void recordRuleHit(Date date, Patient patient, int ruleId, String vaccine, Action action, Boolean actionTaken);
}
