package org.openmrs.module.cdss.web.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.*;
import org.openmrs.module.cdss.api.data.criteria.RuleCriteria;
import org.openmrs.module.cdss.api.data.criteria.projection.IdProjection;
import org.openmrs.module.cdss.api.data.criteria.projection.LibraryNameProjection;
import org.openmrs.module.cdss.api.data.criteria.projection.LibraryNameVersionProjection;
import org.openmrs.module.cdss.api.data.criteria.projection.RuleProjection;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cdss")
public class RuleRestController extends CdssRestController {
    @Autowired
    @Qualifier("adminService")
    protected AdministrationService administrationService;
    @Autowired
    protected RuleManagerService ruleManagerService;
    Logger log = Logger.getLogger(RuleRestController.class);

    @GetMapping(path = "/elm-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> getRule(@PathVariable(value = "ruleId") String ruleId, @RequestParam(required = false) String identifierType) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();
        if (identifierType != null && identifierType.trim().isEmpty()) {
            identifierType = null;
        }
        RuleIdentifierType identifierType1 = identifierType == null ? RuleIdentifierType.RULE_ID : RuleIdentifierType.valueOf(identifierType.toUpperCase());

        try {
            String rule = ruleManagerService.getElmRule(ruleId, identifierType1);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        }
    }


    @GetMapping(path = "/cql-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> getCqlRule(@PathVariable(value = "ruleId") String ruleId, @RequestParam(required = false) String identifierType) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();


        if (identifierType != null && identifierType.trim().isEmpty()) {
            identifierType = null;
        }
        RuleIdentifierType identifierType1 = identifierType == null ? RuleIdentifierType.RULE_ID : RuleIdentifierType.valueOf(identifierType.toUpperCase());

        try {
            String rule = ruleManagerService.getCqlRule(ruleId, identifierType1);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException | RuleNotFoundException | FileNotFoundException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping(path = "/rule.form", produces = {"application/json"})
    public ResponseEntity<List<String>> getRules(@RequestParam(required = false) Boolean allRules, @RequestParam(required = false) String role, @RequestParam(required = false) Boolean showNames, @RequestParam(required = false) Boolean showVersions) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();


        if (showNames == null) {
            showNames = false;
        }
        if (showVersions == null){
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

        if (showNames != null && showNames) {
            projection = new LibraryNameProjection();
        }
        if (showVersions != null && showVersions) {
            projection = new LibraryNameVersionProjection();
        }
        List<RuleDescriptor> rules = ruleManagerService.getAllRules(criteria);
        List<String> s =  criteria.applyProjection(rules, projection);

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


    @PostMapping(path = "/enable-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> enableRule(@PathVariable(value = "ruleId") String ruleId, @RequestParam(required = false) String identifierType) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        if (identifierType != null && identifierType.trim().isEmpty()) {
            identifierType = null;
        }


        RuleIdentifierType identifierType1 = identifierType == null ? RuleIdentifierType.RULE_ID : RuleIdentifierType.valueOf(identifierType.toUpperCase());
        try {
            ruleManagerService.enableRule(ruleId, identifierType1);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("true");
    }

    @PostMapping(path = "/disable-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> disableRule(@PathVariable(value = "ruleId") String ruleId, @RequestParam(required = false) String identifierType) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();
        RuleIdentifierType identifierType1 = identifierType == null ? RuleIdentifierType.RULE_ID : RuleIdentifierType.valueOf(identifierType.toUpperCase());

        try {
            ruleManagerService.disableRule(ruleId, identifierType1);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("true");
    }


    /**
     * Retrieves all rules.
     *
     * @return ResponseEntity<String [ ]> containing an array of rules in JSON format
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/rule-manifest.form", produces = {"application/json"})
    public ResponseEntity<String> getRuleManifest() throws APIAuthenticationException, JsonProcessingException {
//        checkAuthorizationAndPrivilege();
        String val = cdssService.getCdssObjectMapper().writeValueAsString(ruleManagerService.getRuleManifest());

        return ResponseEntity.ok(val);

    }


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
