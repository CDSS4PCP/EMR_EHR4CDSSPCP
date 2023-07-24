package org.openmrs.module.cdss.api.impl;

import org.apache.commons.lang.NotImplementedException;

import org.apache.log4j.Logger;
import org.openmrs.Patient;
import org.openmrs.User;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.EngineResult;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.data.Action;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RuleLoggerServiceImpl extends BaseOpenmrsService implements RuleLoggerService {
	
	PrintWriter writer;
	
	private final Logger log = Logger.getLogger(getClass());
	
	private List<String> resultsWithTakenActions = new ArrayList<String>();
	
	/**
	 * Logic that is run when this service is started. At the moment, this method is not used.
	 */
	@Override
	public void onStartup() {
		
		try {
			writer = new PrintWriter("CDSS-Log.txt", "UTF-8");
			log.info("Created log file at CDSS-Log.txt");
			
		}
		catch (FileNotFoundException e) {
			log.info("Unable to create log file at CDSS-Log.txt");
			
		}
		catch (UnsupportedEncodingException e) {
			log.info("Unable to encode log file at CDSS-Log.txt");
			
		}
		
		log.info("CDSS Vaccine Logger service started...");
	}
	
	/**
	 * Logic that is run when this service is stopped. At the moment, this method is not used.
	 */
	@Override
	public void onShutdown() {
		
		if (writer != null) {
			writer.flush();
			writer.close();
			
			log.info("Saving log file at CDSS-Log.txt");
		}
		log.info("CDSS Vaccine Logger service stopped...");
		
	}
	
	public List<String> getLoadedVaccineRulesets() {
		return CDSSConfig.VACCINE_CODES;
	}
	
	@Override
	public void recordRuleHit(ZonedDateTime time, EngineResult result, Boolean actionTaken, User userInitiated,
	        User userActionAdministered) {
		
		log.debug("Saving rule hit");
		if (writer == null) {
			log.debug("Could not save record hit because writer is null!");
		} else {
			writer.println("Time: " + time + " Patient: " + result.getPatient().getUuid() + " Rule: "
			        + result.getRule().getId() + " Vaccine: " + result.getVaccine() + " UserInitiated: "
			        + userInitiated.getUuid() + " ActionTaken: " + actionTaken);
			log.info("Time: " + time + " Patient: " + result.getPatient().getUuid() + " Rule: " + result.getRule().getId()
			        + " Vaccine: " + result.getVaccine() + " UserInitiated: " + userInitiated.getUuid() + " ActionTaken: "
			        + actionTaken);
			writer.flush();
		}
		
		if (actionTaken) {
			resultsWithTakenActions.add(result.getId());
		}
	}
	
	public boolean isActionTaken(String resultId) {
		return resultsWithTakenActions.contains(resultId);
	}
	
	@Override
	public int getNumberOfActionsTaken() {
		return resultsWithTakenActions.size();
	}
}
