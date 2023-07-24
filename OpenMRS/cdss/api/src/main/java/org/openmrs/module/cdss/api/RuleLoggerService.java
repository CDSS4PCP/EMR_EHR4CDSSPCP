package org.openmrs.module.cdss.api;

import org.openmrs.Patient;
import org.openmrs.User;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.cdss.EngineResult;
import org.openmrs.module.cdss.api.data.Action;

import java.time.ZonedDateTime;

public interface RuleLoggerService extends CDSSService {
	
	void recordRuleHit(ZonedDateTime time, EngineResult result, Boolean actionTaken, User userInitiated,
	        User userActionAdministered);
	
	boolean isActionTaken(String resultId);
	
	int getNumberOfActionsTaken();
}
