package org.openmrs.module.cdss.api.impl;

import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleManagerService;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

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
	public List<String> getLoadedVaccineRulesets() {
		return CDSSConfig.VACCINE_CODES;
	}
	
	@Override
	public String[] getRules() throws APIAuthenticationException {
		return new String[] { "MMR_Rule1.json", "MMR_Rule4.json", "MMR_Rule5.json", "MMR_Rule6.json", "MMR_Rule7.json",
		        "MMR_Rule7.json", "MMR_Rule9.json", "MMR_Rule10.json", "MMR_Rule11.json" };
	}
	
	@Override
	public String getRule(String ruleId) throws APIAuthenticationException, NullPointerException {
		String path = "rules/elm/" + ruleId;
		
		if (!ruleId.endsWith(".json")) {
			path = path + ".json";
		}
		if (!ruleId.endsWith(".json")) {
			path = path + ".json";
		}
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream(path);
		String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
		return result;
	}
}
