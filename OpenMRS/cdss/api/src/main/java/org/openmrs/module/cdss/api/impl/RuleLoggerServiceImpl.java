package org.openmrs.module.cdss.api.impl;

import org.apache.commons.lang.NotImplementedException;

import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.User;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.data.Action;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

public class RuleLoggerServiceImpl extends BaseOpenmrsService implements RuleLoggerService {
	
	private final Logger log = Logger.getLogger(getClass());
	
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
	public List<String> getLoadedVaccineRulesets() {
		return CDSSConfig.VACCINE_CODES;
	}
	
	@Override
	public void recordRuleHit(ZonedDateTime time, Patient patient, int ruleId, String vaccine, Action action,
	        Boolean actionTaken, User userInitiated, User userActionAdministered) {
		Instant i = Instant.now();
		
		throw new NotImplementedException("This method is not finished yet!");
	}
}
