package org.openmrs.module.cdss.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;

import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;

public interface RuleManagerService extends CdssVaccineService {

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String[] getRules() throws APIAuthenticationException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String[] getEnabledRules() throws APIAuthenticationException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getElmRule(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getCqlRule(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    RuleManifest getRuleManifest() throws APIAuthenticationException;

    Boolean modifyRule(String ruleId, String version, Map<String, ParamDescriptor> changedParameters) throws JsonProcessingException, FileNotFoundException, RuleNotFoundException;
}
