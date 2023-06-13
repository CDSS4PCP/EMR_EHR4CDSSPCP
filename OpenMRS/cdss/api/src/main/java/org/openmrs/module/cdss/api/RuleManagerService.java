package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.module.cdss.api.data.Action;
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
	Boolean addRule(Rule rule);
	
	@Authorized
	@Transactional
	Rule getRuleById(Integer id);
	
	@Authorized
	@Transactional
	List<Rule> getRulesByVaccine(String vaccine);
	
	@Authorized
	@Transactional
	boolean addVaccine(String vaccine);
	
	@Authorized
	@Transactional
	List<Action> getAllActions();
	
	@Authorized
	@Transactional
	boolean addAction(Action action);
	
	@Authorized
	@Transactional
	Action getActionById(Integer id);
	
}
