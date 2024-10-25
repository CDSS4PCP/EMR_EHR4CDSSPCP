package org.openmrs.module.cdss.api;

import org.openmrs.annotation.Authorized;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.data.RuleManifest;

public interface RuleManagerService extends CdssVaccineService {

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String[] getRules() throws APIAuthenticationException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String[] getEnabledRules() throws APIAuthenticationException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getElmRule(String ruleId) throws APIAuthenticationException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getCqlRule(String ruleId) throws APIAuthenticationException;

    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    RuleManifest getRuleManifest() throws APIAuthenticationException;
}
