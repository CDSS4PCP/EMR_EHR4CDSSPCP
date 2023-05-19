package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.springframework.transaction.annotation.Transactional;

public interface RuleManagerService extends CDSSService {
	
	@Authorized
	@Transactional
	Boolean modifyRule(int ruleId);
	
	@Authorized
	@Transactional
	Boolean deleteRule(int ruleId);
	
	@Authorized
	@Transactional
	Boolean addRule();
}
