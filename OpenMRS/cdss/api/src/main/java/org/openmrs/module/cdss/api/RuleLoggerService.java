package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.data.CdssUsage;

import java.util.List;

public interface RuleLoggerService extends CdssVaccineService {
	
	@Authorized({ CDSSConfig.MODULE_PRIVILEGE })
	CdssUsage recordRuleUsage(CdssUsage usage);
	
	@Authorized({ CDSSConfig.MODULE_PRIVILEGE })
	List<CdssUsage> getRuleUsages();
	
}
