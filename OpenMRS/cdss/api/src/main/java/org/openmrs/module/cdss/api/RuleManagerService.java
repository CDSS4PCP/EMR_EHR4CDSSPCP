package org.openmrs.module.cdss.api;

import org.openmrs.api.APIAuthenticationException;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.RuleCriteria;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;

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
    List<String> getEnabledRules(RuleRole role) throws APIAuthenticationException;


    // TODO Change methods to utilize version as well as ruleId
//    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getElmRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getCqlRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    String getElmRuleByName(String ruleName) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getCqlRuleByName(String ruleName) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    String getElmRuleByNameVersion(String ruleName, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    String getCqlRuleByNameVersion(String ruleName, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;


    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    RuleManifest getRuleManifest() throws APIAuthenticationException;


    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Boolean enableRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Boolean enableRuleByName(String name) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Boolean enableRuleByNameVersion(String name, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Boolean disableRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Boolean disableRuleByName(String name) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Boolean disableRuleByNameVersion(String name, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Boolean modifyRule(String ruleId, Map<String, ParamDescriptor> changedParameters) throws IOException;


    Boolean createRule(String ruleId, String version, String description, Map<String, ParamDescriptor> params, RuleRole role, String derivedFrom, String cql, String elm) throws IOException;
}
