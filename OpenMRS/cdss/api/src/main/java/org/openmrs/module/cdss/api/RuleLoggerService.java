package org.openmrs.module.cdss.api;

import org.openmrs.module.cdss.api.data.CdssUsage;

import java.util.List;

public interface RuleLoggerService extends CDSSService {
	
	void recordRuleUsage(CdssUsage usage);
	
	List<CdssUsage> getRuleUsages();
	
}
