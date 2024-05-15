package org.openmrs.module.cdss.api;

import org.openmrs.api.OpenmrsService;

import java.util.List;

public interface CdssVaccineService extends OpenmrsService {
	
	List<String> getLoadedVaccineRulesets();
	
}
