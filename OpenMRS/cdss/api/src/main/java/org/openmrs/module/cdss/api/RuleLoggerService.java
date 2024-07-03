package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.module.cdss.api.data.CdssUsage;

import java.util.List;

public interface RuleLoggerService extends CdssVaccineService {
	
	@Authorized
	CdssUsage recordRuleUsage(CdssUsage usage);
	
	@Authorized
	List<CdssUsage> getRuleUsages();
	
}
