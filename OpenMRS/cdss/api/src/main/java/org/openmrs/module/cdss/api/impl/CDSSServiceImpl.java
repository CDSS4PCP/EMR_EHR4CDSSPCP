/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.cdss.api.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Patient;
import org.openmrs.api.APIException;
import org.openmrs.api.UserService;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.Item;
import org.openmrs.module.cdss.RunnerResult;
import org.openmrs.module.cdss.api.CDSSService;
import org.openmrs.module.cdss.api.dao.CDSSDao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class CDSSServiceImpl extends BaseOpenmrsService implements CDSSService {
	
	CDSSDao dao;
	
	UserService userService;
	
	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setDao(CDSSDao dao) {
		this.dao = dao;
	}
	
	/**
	 * Injected in moduleApplicationContext.xml
	 */
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	@Override
	public Item getItemByUuid(String uuid) throws APIException {
		return dao.getItemByUuid(uuid);
	}
	
	@Override
	public Item saveItem(Item item) throws APIException {
		if (item.getOwner() == null) {
			item.setOwner(userService.getUser(1));
		}
		
		return dao.saveItem(item);
	}
	
	private static final List<String> vaccineCodes = Arrays.asList("MMR", "HPV");
	
	protected final Log log = LogFactory.getLog(getClass());
	
	// Random is used to generate random vaccine results for simply displaying VaccineRunnerService's functionality.
	// In the future, this will replace by database queries for a more deterministic and accurate outcome.
	final Random random = new Random();
	
	/**
	 * Get results for a given patient and all vaccines that are avialable. It calls
	 * getLoadedVaccineRulesets() to get the vaccines
	 * 
	 * @param patient Patient to get results for.
	 * @return A list of results. Each entry corresponds to a vaccine.
	 */
	public List<RunnerResult> getAllResults(Patient patient) {
		List<String> rulesets = getLoadedVaccineRulesets();
		ArrayList<RunnerResult> results = new ArrayList<RunnerResult>(rulesets.size());
		for (String vaccine : rulesets) {
			results.add(getResult(patient, vaccine));
		}
		return results;
	}
	
	/**
	 * Get vaccine results for a given patient and a specific vaccine.
	 * 
	 * @param patient Patient to get results for.
	 * @param vaccine A string that is a valid vaccine code.
	 * @return A single result given patient and a specific vaccine.
	 */
	public RunnerResult getResult(Patient patient, String vaccine) {
		RunnerResult result = new RunnerResult();
		result.setPatient(patient);
		result.setVaccine(vaccine);
		int status = random.nextInt(2);
		
		if (status == 0) {
			result.setMessage("No further action needed");
		} else {
			result.setMessage("New dose needs to be administered");
		}
		result.setStatus(status);
		return result;
	}
	
	/**
	 * Get a list of vaccine codes that are implemented.
	 * 
	 * @return List of vaccine codes that are implemented. At the moment it only returns ["MMR",
	 *         "HPV"].
	 */
	public List<String> getLoadedVaccineRulesets() {
		return vaccineCodes;
	}
	
	/**
	 * Logic that is run when this service is started. At the moment, this method is not used.
	 */
	@Override
	public void onStartup() {
		log.info("Vaccine Runner service started...");
	}
	
	/**
	 * Logic that is run when this service is stopped. At the moment, this method is not used.
	 */
	@Override
	public void onShutdown() {
		log.info("Vaccine Runner service stopped...");
		
	}
}
