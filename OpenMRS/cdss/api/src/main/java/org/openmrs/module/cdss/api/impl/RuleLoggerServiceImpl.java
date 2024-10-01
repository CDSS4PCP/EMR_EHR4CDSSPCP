package org.openmrs.module.cdss.api.impl;

import org.apache.log4j.Logger;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.CdssUsage;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.List;

public class RuleLoggerServiceImpl extends BaseOpenmrsService implements RuleLoggerService {
	
	private final Logger log = Logger.getLogger(getClass());
	
	CDSSDao dao;
	
	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setDao(CDSSDao dao) {
		this.dao = dao;
	}
	
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
	
	/**
	 * Retrieves the list of loaded vaccine rulesets from the CDSSConfig class.
	 */
	@Override
	public List<String> getLoadedVaccineRulesets() {
		return CDSSConfig.VACCINE_CODES;
	}
	
	/**
	 * Records the rule usage by saving it using the CDSSDao's saveEngineUsage method.
	 */
	@Override
	public CdssUsage recordRuleUsage(CdssUsage usage) {
		return dao.saveEngineUsage(usage);
	}
	
	/**
	 * Retrieves a list of CdssUsage objects representing the rule usages.
	 * 
	 * @return A list of CdssUsage objects representing the rule usages.
	 */
	@Override
	public List<CdssUsage> getRuleUsages() {
		log.debug("CDSS: getRuleUsages() in RuleLoggerServiceImpl.java");
		return (List<CdssUsage>) dao.getUsages();
	}
}
