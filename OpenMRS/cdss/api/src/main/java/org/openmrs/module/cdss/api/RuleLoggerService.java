package org.openmrs.module.cdss.api;

import org.openmrs.Patient;
import org.openmrs.User;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.cdss.EngineResult;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.EngineUsage;

import java.time.ZonedDateTime;
import java.util.List;

public interface RuleLoggerService extends CDSSService {
	
	void recordRuleUsage(EngineUsage usage);
	
	List<EngineUsage> getRuleUsages();
	
}
