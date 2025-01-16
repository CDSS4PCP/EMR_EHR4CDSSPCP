package org.openmrs.module.cdss.web.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.ModifyRuleRequest;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.RuleCriteria;
import org.openmrs.module.cdss.api.data.criteria.projection.*;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cdss")
public class RuleRestController extends CdssRestController {
    @Autowired
    @Qualifier("adminService")
    protected AdministrationService administrationService;

    //    @Qualifier("ruleManagerService")
    @Autowired
    protected RuleManagerService ruleManagerService;
    Logger log = Logger.getLogger(RuleRestController.class);

    /**
     * Retrieves an ELM rule by its ID or name, optionally considering the version.
     *
     * @param ruleId  the ID or name of the rule to retrieve
     * @param version the version of the rule, optional
     * @return ResponseEntity containing the rule in JSON format if found, or a not found message
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = {"/elm-rule/idOrName/{ruleId}.form"}, produces = {"application/json"})
    public ResponseEntity<String> getElmRuleByIdOrName(@PathVariable(value = "ruleId") String ruleId, @RequestParam(value = "version", required = false) String version) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            String rule = ruleManagerService.getElmRuleById(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuleNotFoundException e) {
            try {
                String rule;
                if (version == null) {
                    rule = ruleManagerService.getElmRuleByName(ruleId);
                } else {
                    rule = ruleManagerService.getElmRuleByNameVersion(ruleId, version);
                }
                return ResponseEntity.ok(rule);
            } catch (RuleNotFoundException e2) {
                throw new RuntimeException(e);

            } catch (FileNotFoundException ex) {
                throw new RuntimeException(ex);
            }


//            throw new RuntimeException(e);
        }
    }

    /**
     * Retrieves an ELM rule by its ID.
     *
     * @param ruleId the ID of the rule to retrieve
     * @return ResponseEntity containing the rule in JSON format if found, or a not found message
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = {"/elm-rule/id/{ruleId}.form", "/elm-rule/{ruleId}.form"}, produces = {"application/json"})
    public ResponseEntity<String> getElmRuleById(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            String rule = ruleManagerService.getElmRuleById(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Retrieves a CQL rule by its ID.
     *
     * @param ruleId the ID of the rule to retrieve
     * @return ResponseEntity containing the rule in JSON format if found, or a not found message
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = {"/cql-rule/id/{ruleId}.form", "/cql-rule/{ruleId}.form"}, produces = {"application/json"})
    public ResponseEntity<String> getCqlRuleById(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();


        try {
            String rule = ruleManagerService.getCqlRuleById(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException | RuleNotFoundException | FileNotFoundException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Retrieves an ELM rule by its library name, optionally considering the version.
     *
     * @param libraryName the name of the library to retrieve the rule from
     * @param version     the version of the rule, optional
     * @return ResponseEntity containing the rule in JSON format if found, or a not found message
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/elm-rule/name/{libraryName}.form", produces = {"application/json"})
    public ResponseEntity<String> getElmRuleByName(@PathVariable(value = "libraryName") String libraryName, @RequestParam(value = "version", required = false) String version) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            String rule;
            if (version != null) {
                rule = ruleManagerService.getCqlRuleByNameVersion(libraryName, version);
            } else {
                rule = ruleManagerService.getElmRuleByName(libraryName);
            }
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>(version != null ? "Rule with libraryName=" + libraryName + " and version=" + version + " Not found" : "Rule with libraryName=" + libraryName + " Not found", HttpStatus.NOT_FOUND);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Retrieves a CQL rule by its library name, optionally considering the version.
     *
     * @param libraryName the name of the library to retrieve the rule from
     * @param version     the version of the rule, optional
     * @return ResponseEntity containing the rule in JSON format if found, or a not found message
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/cql-rule/name/{libraryName}.form", produces = {"application/json"})
    public ResponseEntity<String> getCqlRuleById(@PathVariable(value = "libraryName") String libraryName, @RequestParam(value = "version", required = false) String version) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();


        try {
            String rule;
            if (version != null) {
                rule = ruleManagerService.getCqlRuleByNameVersion(libraryName, version);
            } else {
                rule = ruleManagerService.getCqlRuleByName(libraryName);
            }
            return ResponseEntity.ok(rule);
        } catch (NullPointerException | RuleNotFoundException | FileNotFoundException e) {
            return new ResponseEntity<>(version != null ? "Rule with libraryName=" + libraryName + " and version=" + version + " Not found" : "Rule with libraryName=" + libraryName + " Not found", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Retrieves a CQL rule by its ID or name, optionally considering the version.
     *
     * @param ruleId  the ID or name of the rule to retrieve
     * @param version the version of the rule, optional
     * @return ResponseEntity containing the rule in JSON format if found, or a not found message
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = {"/cql-rule/idOrName/{ruleId}.form", "/cql-rule/{ruleId}.form"}, produces = {"application/json"})
    public ResponseEntity<String> getCqlRuleByIdOrName(@PathVariable(value = "ruleId") String ruleId, @RequestParam(value = "version", required = false) String version) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            String rule = ruleManagerService.getCqlRuleById(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuleNotFoundException e) {
            try {
                String rule;
                if (version == null) {
                    rule = ruleManagerService.getCqlRuleByName(ruleId);
                } else {
                    rule = ruleManagerService.getCqlRuleByNameVersion(ruleId, version);
                }
                return ResponseEntity.ok(rule);
            } catch (RuleNotFoundException e2) {
                throw new RuntimeException(e);

            } catch (FileNotFoundException ex) {
                throw new RuntimeException(ex);
            }


//            throw new RuntimeException(e);
        }
    }

    /**
     * Retrieves a list of rules based on specified criteria.
     *
     * @param allRules     optional flag to include all rules or only enabled ones
     * @param role         optional role to filter rules by
     * @param showNames    optional flag to include rule names in the response
     * @param showVersions optional flag to include rule versions in the response
     * @return ResponseEntity containing a list of rules in JSON format
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/rule.form", produces = {"application/json"})
    public ResponseEntity<List<String>> getRules(@RequestParam(required = false) Boolean allRules, @RequestParam(required = false) String role, @RequestParam(required = false) Boolean showNames, @RequestParam(required = false) Boolean showVersions) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();


        if (showNames == null) {
            showNames = false;
        }
        if (showVersions == null) {
            showVersions = false;
        }

        RuleCriteria criteria = new RuleCriteria();
        if (allRules != null) {
            if (!allRules) {
                criteria.setEnabled(true);
            }
        }
        if (role != null) {
            criteria.setRole(RuleRole.valueOf(role.toUpperCase()));
        }
        RuleProjection<String> projection = new IdProjection();

        boolean showNameAndVersions = showNames && showVersions;
        if (showNames != null && showNames) {
            projection = new LibraryNameProjection();
        }
        if (showVersions != null && showVersions) {
            projection = new LibraryVersionProjection();
        }

        if (showNameAndVersions) {
            projection = new LibraryNameVersionProjection();
        }
        List<RuleDescriptor> rules = ruleManagerService.getAllRules(criteria);
        List<String> s = criteria.applyProjection(rules, projection);

        return new ResponseEntity<>(s, HttpStatus.OK);


//        checkAuthorizationAndPrivilege();
//        if (allRules == null) {
//            allRules = false;
//        }
//
//        if (role != null && role.trim().isEmpty()) {
//            role = null;
//        }
//
//
//        if (identifierType != null && identifierType.trim().isEmpty()) {
//            identifierType = null;
//        }
//
//
//        RuleRole ruleRole = role == null ? null : RuleRole.valueOf(role.toUpperCase());
//        RuleIdentifierType identifierType1 = identifierType == null ? null : RuleIdentifierType.valueOf(identifierType.toUpperCase());
//        List<String> rules;
//
//        if (allRules) rules = ruleManagerService.getAllRules(ruleRole, identifierType1);
//        else rules = ruleManagerService.getEnabledRules(ruleRole, identifierType1);
//
//
//        return ResponseEntity.ok(rules);

    }

    /**
     * Enables a rule by its ID.
     *
     * @param ruleId the ID of the rule to enable
     * @return ResponseEntity containing "true" if the rule is successfully enabled
     * @throws APIAuthenticationException if there is an issue with API authentication
     * @throws RuntimeException           if the rule is not found or a file-related error occurs
     */
    @PostMapping(path = {"/enable-rule/id/{ruleId}.form", "/enable-rule/{ruleId}.form"}, produces = {"application/json"})
    public ResponseEntity<String> enableRuleById(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            ruleManagerService.enableRuleById(ruleId);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("true");
    }

    /**
     * Enables a rule by its library name, optionally considering the version.
     *
     * @param libraryName the name of the library to enable the rule from
     * @param version     the version of the rule, optional
     * @return ResponseEntity containing "true" if the rule is successfully enabled
     * @throws APIAuthenticationException if there is an issue with API authentication
     * @throws RuntimeException           if the rule is not found or a file-related error occurs
     */
    @PostMapping(path = {"/enable-rule/name/{libraryName}.form"}, produces = {"application/json"})
    public ResponseEntity<String> enableRuleByName(@PathVariable(value = "libraryName") String libraryName, @RequestParam(value = "version", required = false) String version) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            Boolean success;
            if (version == null) {
                success = ruleManagerService.enableRuleByName(libraryName);
            } else {
                success = ruleManagerService.enableRuleByNameVersion(libraryName, version);
            }
            return ResponseEntity.ok(success + "");

        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Disables a rule by its ID.
     *
     * @param ruleId the ID of the rule to disable
     * @return ResponseEntity containing "true" if the rule is successfully disabled
     * @throws APIAuthenticationException if there is an issue with API authentication
     * @throws RuntimeException           if the rule is not found or a file-related error occurs
     */
    @PostMapping(path = {"/disable-rule/id/{ruleId}.form", "/disable-rule/{ruleId}.form"}, produces = {"application/json"})
    public ResponseEntity<String> disableRuleById(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            ruleManagerService.disableRuleById(ruleId);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("true");
    }

    /**
     * Disables a rule by its library name, optionally considering the version.
     *
     * @param libraryName the name of the library to disable the rule from
     * @param version     the version of the rule, optional
     * @return ResponseEntity containing "true" if the rule is successfully disabled
     * @throws APIAuthenticationException if there is an issue with API authentication
     * @throws RuntimeException           if the rule is not found or a file-related error occurs
     */
    @PostMapping(path = {"/disable-rule/name/{libraryName}.form"}, produces = {"application/json"})
    public ResponseEntity<String> disableRuleByName(@PathVariable(value = "libraryName") String libraryName, @RequestParam(value = "version", required = false) String version) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            Boolean success;
            if (version == null) {
                success = ruleManagerService.enableRuleByName(libraryName);
            } else {
                success = ruleManagerService.enableRuleByNameVersion(libraryName, version);
            }
            return ResponseEntity.ok(success + "");
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * Retrieves the rule manifest as a JSON string.
     *
     * @return ResponseEntity containing the rule manifest in JSON format
     * @throws APIAuthenticationException if there is an issue with API authentication
     * @throws JsonProcessingException    if there is an error processing JSON
     */
    @GetMapping(path = "/rule-manifest.form", produces = {"application/json"})
    public ResponseEntity<String> getRuleManifest() throws APIAuthenticationException, JsonProcessingException {
//        checkAuthorizationAndPrivilege();

        String val = cdssService.getCdssObjectMapper().writeValueAsString(ruleManagerService.getRuleManifest());

        return ResponseEntity.ok(val);

    }


    /**
     * Modifies an existing rule based on the provided request body.
     *
     * @param body the request body containing the rule descriptor and parameters to modify
     * @return ResponseEntity containing "true" if the rule is successfully modified, or an error message if an exception occurs
     * @throws APIAuthenticationException if there is an issue with API authentication
     * @throws JsonProcessingException    if there is an error processing JSON
     */
    @PostMapping(path = "/modify-rule.form", produces = {"application/json"})
    public ResponseEntity<String> modifyRule(@RequestBody ModifyRuleRequest body) throws APIAuthenticationException, JsonProcessingException {
//        checkAuthorizationAndPrivilege();

        String ruleId = body.rule.id;
        String version = body.rule.getVersion();
        Map<String, ParamDescriptor> params = body.getParams();

        Boolean result = null;
        try {
            result = ruleManagerService.modifyRule(ruleId, params);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result.toString(), HttpStatus.OK);

    }

}
