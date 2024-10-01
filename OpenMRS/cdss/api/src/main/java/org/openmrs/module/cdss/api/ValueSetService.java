package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.OpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.util.ValueSetResponse;

public interface ValueSetService extends OpenmrsService {
	
	@Authorized({ CDSSConfig.MODULE_PRIVILEGE })
	ValueSetResponse getFhirValueSet(String apiKey, String oid, String version, Integer offset)
	        throws APIAuthenticationException;
	
	@Authorized({ CDSSConfig.MODULE_PRIVILEGE })
	ValueSetResponse getSvsValueSet(String apiKey, String oid, String version) throws APIAuthenticationException;
}
