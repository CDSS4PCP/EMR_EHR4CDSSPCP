package org.openmrs.module.cdss.api;

import org.openmrs.module.cdss.api.data.CdssUsage;

import java.util.List;

public interface RuleLoggerService extends CdssVaccineService {
	
	void recordRuleUsage(CdssUsage usage);
	
	List<CdssUsage> getRuleUsages();
	
}
