package org.openmrs.module.cdss.api;

import org.openmrs.Patient;
import org.openmrs.User;
import org.openmrs.module.cdss.api.data.Action;

import java.time.ZonedDateTime;

public interface RuleLoggerService extends CDSSService {
	
	void recordRuleHit(ZonedDateTime time, Patient patient, int ruleId, String vaccine, Action action, Boolean actionTaken,
	        User userInitiated, User userActionAdministered);
}
