package org.openmrs.module.cdss.api;

import org.openmrs.api.APIAuthenticationException;
import org.openmrs.module.cdss.api.data.*;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;
import org.openmrs.module.cdss.api.data.criteria.RuleCriteria;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface RuleManagerService extends CdssVaccineService {

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    List<String> getAllRules() throws APIAuthenticationException;

    List<RuleDescriptor> getAllRules(RuleCriteria ruleCriteria) throws APIAuthenticationException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
//    List<String> getAllRules(RuleRole role) throws APIAuthenticationException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
//    List<String> getAllRules(RuleRole role, RuleIdentifierType identifierType) throws APIAuthenticationException;


    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    List<String> getEnabledRules() throws APIAuthenticationException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
//    List<String> getEnabledRules(RuleRole role) throws APIAuthenticationException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    List<String> getEnabledRules(RuleRole role, RuleIdentifierType identifierType) throws APIAuthenticationException;


    // TODO Change methods to utilize version as well as ruleId
//    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getElmRule(String ruleId, RuleIdentifierType identifierType) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getCqlRule(String ruleId, RuleIdentifierType identifierType) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    RuleManifest getRuleManifest() throws APIAuthenticationException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Boolean enableRule(String ruleId, RuleIdentifierType identifierType) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Boolean disableRule(String ruleId, RuleIdentifierType identifierType) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Boolean modifyRule(String ruleId, Map<String, ParamDescriptor> changedParameters) throws IOException;
}
