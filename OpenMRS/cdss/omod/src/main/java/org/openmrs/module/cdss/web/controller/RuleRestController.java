package org.openmrs.module.cdss.web.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.ModifyRuleRequest;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
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
    @Autowired
    protected RuleManagerService ruleManagerService;
    Logger log = Logger.getLogger(RuleRestController.class);

    @GetMapping(path = "/elm-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> getRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            String rule = ruleManagerService.getElmRule(ruleId);
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
    public ResponseEntity<String> getCqlRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            String rule = ruleManagerService.getCqlRule(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException | RuleNotFoundException | FileNotFoundException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping(path = "/rule.form", produces = {"application/json"})
    public ResponseEntity<List<String>> getRules(@RequestParam(required = false) Boolean allRules, @RequestParam(required = false) String role) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();
        if (allRules == null) {
            allRules = false;
        }

        List<String> rules;

        if (role != null) {
            if (allRules)
                rules = ruleManagerService.getAllRules(RuleRole.valueOf(role.toUpperCase()));
            else
                rules = ruleManagerService.getEnabledRules(RuleRole.valueOf(role.toUpperCase()));
        } else {
            if (allRules)
                rules = ruleManagerService.getAllRules();
            else
                rules = ruleManagerService.getEnabledRules();

        }


        return ResponseEntity.ok(rules);

    }


    @PostMapping(path = "/enable-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> enableRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            ruleManagerService.enableRule(ruleId);
        } catch (RuleNotFoundException e) {
            throw new RuntimeException(e);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("true");
    }

    @PostMapping(path = "/disable-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> disableRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
//        checkAuthorizationAndPrivilege();

        try {
            ruleManagerService.disableRule(ruleId);
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
            result = ruleManagerService.modifyRule(ruleId, version, params);
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
