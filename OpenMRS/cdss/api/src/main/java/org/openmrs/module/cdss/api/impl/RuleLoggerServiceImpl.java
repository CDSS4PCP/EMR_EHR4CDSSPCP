package org.openmrs.module.cdss.api.impl;

import org.apache.commons.lang.NotImplementedException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Patient;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.data.Action;

import java.util.Date;
import java.util.List;

public class RuleLoggerServiceImpl extends BaseOpenmrsService implements RuleLoggerService {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	/**
	 * Logic that is run when this service is started. At the moment, this method is not used.
	 */
	@Override
	public void onStartup() {
		log.info("CDSS Vaccine Logger service started...");
	}
	
	/**
	 * Logic that is run when this service is stopped. At the moment, this method is not used.
	 */
	@Override
	public void onShutdown() {
		log.info("CDSS Vaccine Logger service stopped...");
		
	}
	
	@Override
	public void recordRuleHit(Date date, Patient patient, int ruleId, String vaccine, Action action, Boolean actionTaken) {
		throw new NotImplementedException("This method is not finished yet!");
	}
	
	@Override
	public List<String> getLoadedVaccineRulesets() {
		return CDSSConfig.VACCINE_CODES;
	}
}
