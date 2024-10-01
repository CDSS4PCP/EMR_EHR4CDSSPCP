package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;

import java.util.List;

public interface CdssVaccineService extends OpenmrsService {
	
	@Authorized({ CDSSConfig.MODULE_PRIVILEGE })
	List<String> getLoadedVaccineRulesets();
	
}
