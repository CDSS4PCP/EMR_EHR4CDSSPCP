package org.openmrs.module.cdss.api.impl;

import org.apache.commons.lang.NotImplementedException;
import org.apache.log4j.Logger;
import org.openmrs.annotation.Authorized;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSActivator;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.Rule;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

public class RuleManagerServiceImpl extends BaseOpenmrsService implements RuleManagerService {
	
	private final Logger log = Logger.getLogger(getClass());
	
	/**
	 * Logic that is run when this service is started. At the moment, this method is not used.
	 */
	@Override
	public void onStartup() {
		log.info("CDSS Vaccine Manager service started...");
	}
	
	/**
	 * Logic that is run when this service is stopped. At the moment, this method is not used.
	 */
	@Override
	public void onShutdown() {
		log.info("CDSS Vaccine Manager service stopped...");
		
	}
	
	@Override
	@Transactional
	@Authorized
	public Boolean modifyRule(int ruleId) {
		throw new NotImplementedException("This method is not finished yet!");
	}
	
	@Override
	@Transactional
	@Authorized
	public Boolean deleteRule(int ruleId) {
		throw new NotImplementedException("This method is not finished yet!");
	}
	
	@Override
	@Transactional
	@Authorized
	public Integer addRule() {
		throw new NotImplementedException("This method is not finished yet!");
	}
	
	@Override
	public List<Rule> getRulesByVaccine(String vaccine) {
		ArrayList<Rule> rules = new ArrayList<Rule>();
		
		for (Rule rule : CDSSActivator.getSampleData().getRules()) {
			if (rule.getVaccine().equals(vaccine)) {
				rules.add(rule);
			}
		}
		
		return rules;
	}
	
	@Override
	public List<String> getLoadedVaccineRulesets() {
		return CDSSConfig.VACCINE_CODES;
	}
}
