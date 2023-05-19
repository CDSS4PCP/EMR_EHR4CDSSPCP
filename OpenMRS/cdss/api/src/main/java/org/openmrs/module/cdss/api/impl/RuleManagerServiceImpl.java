package org.openmrs.module.cdss.api.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.api.RuleManagerService;

public class RuleManagerServiceImpl extends BaseOpenmrsService implements RuleManagerService {
	
	protected final Log log = LogFactory.getLog(getClass());
	
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
}
