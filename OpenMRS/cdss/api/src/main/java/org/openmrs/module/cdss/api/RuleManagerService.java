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
import java.util.Optional;

public interface RuleManagerService extends CdssVaccineService {

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    List<String> getAllRules() throws APIAuthenticationException;

    List<RuleDescriptor> getAllRules(RuleCriteria ruleCriteria) throws APIAuthenticationException;



    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    List<String> getEnabledRules() throws APIAuthenticationException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    List<String> getEnabledRules(RuleRole role) throws APIAuthenticationException;


//    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Optional<String>  getElmRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Optional<String>  getCqlRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Optional<String>  getElmRuleByName(String ruleName) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Optional<String>  getCqlRuleByName(String ruleName) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Optional<String>  getElmRuleByNameVersion(String ruleName, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Optional<String>  getCqlRuleByNameVersion(String ruleName, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;


    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    RuleManifest getRuleManifest() throws APIAuthenticationException;


    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Optional<String>  enableRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Optional<String>  enableRuleByName(String name) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Optional<String>  enableRuleByNameVersion(String name, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Optional<String>  disableRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Optional<String>  disableRuleByName(String name) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    Optional<String>  disableRuleByNameVersion(String name, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException;

    //    @Authorized({CDSSConfig.MODULE_PRIVILEGE})
    Optional<String>  modifyRule(String ruleId, Map<String, ParamDescriptor> changedParameters) throws IOException;


    Optional<String> createRule(String libraryName, String libraryVersion, String description, Map<String, ParamDescriptor> params, RuleRole role, String derivedFrom, String cql, String elm) throws IOException;
}
