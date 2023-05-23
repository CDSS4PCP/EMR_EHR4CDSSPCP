package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.module.cdss.api.data.Rule;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RuleManagerService extends CDSSService {
	
	@Authorized
	@Transactional
	Boolean modifyRule(int ruleId);
	
	@Authorized
	@Transactional
	Boolean deleteRule(int ruleId);
	
	@Authorized
	@Transactional
	Integer addRule();
	
	@Authorized
	@Transactional
	List<Rule> getRulesByVaccine(String vaccine);
}
