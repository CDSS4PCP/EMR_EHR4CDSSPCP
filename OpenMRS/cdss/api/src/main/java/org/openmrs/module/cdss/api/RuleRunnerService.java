package org.openmrs.module.cdss.api;

import org.openmrs.Patient;
import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIException;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.Item;
import org.openmrs.module.cdss.RunnerResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RuleRunnerService extends CDSSService {
	
	/**
	 * Returns an item by uuid. It can be called by any authenticated user. It is fetched in read
	 * only transaction.
	 * 
	 * @param uuid
	 * @return
	 * @throws APIException
	 */
	@Authorized()
	@Transactional(readOnly = true)
	Item getItemByUuid(String uuid) throws APIException;
	
	RunnerResult getResult(Patient patient, String vaccine);
	
	List<String> getLoadedVaccineRulesets();
	
	List<RunnerResult> getAllResults(Patient patient);
}
