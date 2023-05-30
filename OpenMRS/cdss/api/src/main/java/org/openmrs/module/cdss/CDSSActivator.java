/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.cdss;

import org.apache.log4j.Logger;
import org.openmrs.module.BaseModuleActivator;

import java.io.UnsupportedEncodingException;

/**
 * This class contains the logic that is run every time this module is either started or shutdown
 */
public class CDSSActivator extends BaseModuleActivator {
	
	private static SampleData sampleData;
	
	private final Logger log = Logger.getLogger(getClass());
	
	/**
	 * @see #started()
	 */
	@Override
	public void started() {
		log.info("Started CDSS");
		
		CDSSConfig.VACCINE_CODES.add("MMR");
		CDSSConfig.VACCINE_CODES.add("HPV");
		
		sampleData = new SampleData();
		try {
			sampleData.loadSampleDataJson();
		}
		catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
		
	}
	
	/**
	 * @see #stopped()
	 */
	@Override
	public void stopped() {
		log.info("Stopped CDSS");
	}
	
	@Override
	public void contextRefreshed() {
		log.info("Refreshing CDSS");
		
	}
	
	public static SampleData getSampleData() {
		return sampleData;
	}
}
