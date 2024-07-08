package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.module.cdss.CDSSConfig;

public interface RuleManagerService extends CdssVaccineService {
	
	@Authorized({ CDSSConfig.MODULE_PRIVILEGE })
	String[] getRules() throws APIAuthenticationException;
	
	@Authorized({ CDSSConfig.MODULE_PRIVILEGE })
	String getRule(String ruleId) throws APIAuthenticationException;
	
}
