package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIAuthenticationException;

public interface RuleManagerService extends CdssVaccineService {
	
	@Authorized
	String[] getRules() throws APIAuthenticationException;
	
	@Authorized
	String getRule(String ruleId) throws APIAuthenticationException;
	
}
