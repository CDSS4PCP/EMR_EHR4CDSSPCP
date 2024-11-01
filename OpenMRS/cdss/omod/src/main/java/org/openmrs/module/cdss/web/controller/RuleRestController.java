package org.openmrs.module.cdss.web.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cdss")
public class RuleRestController extends CdssRestController {
    Logger log = Logger.getLogger(RuleRestController.class);


    @Autowired
    protected RuleManagerService ruleManagerService;


    /**
     * Retrieves a specific rule based on the provided ruleId.
     *
     * @param ruleId the unique identifier of the rule to retrieve
     * @return ResponseEntity<String> containing the rule in JSON format if found
     * HttpStatus.NOT_FOUND if the rule is not found
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/elm-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> getRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
        checkAuthorizationAndPrivilege();

        try {
            String rule = ruleManagerService.getElmRule(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Retrieves a specific rule based on the provided ruleId.
     *
     * @param ruleId the unique identifier of the rule to retrieve
     * @return ResponseEntity<String> containing the rule in JSON format if found
     * HttpStatus.NOT_FOUND if the rule is not found
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/cql-rule/{ruleId}.form", produces = {"application/json"})
    public ResponseEntity<String> getCqlRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {
        checkAuthorizationAndPrivilege();

        try {
            String rule = ruleManagerService.getCqlRule(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Retrieves all rules.
     *
     * @return ResponseEntity<String [ ]> containing an array of rules in JSON format
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/rule.form", produces = {"application/json"})
    public ResponseEntity<String[]> getRules(@RequestParam(required = false) Boolean allRules) throws APIAuthenticationException {
        checkAuthorizationAndPrivilege();
        if (allRules == null){
            allRules = false;
        }
        String[] rules;
        if (allRules) {
            rules = ruleManagerService.getRules();
        } else {
            rules = ruleManagerService.getEnabledRules();
        }
        return ResponseEntity.ok(rules);

    }

    /**
     * Retrieves all rules.
     *
     * @return ResponseEntity<String [ ]> containing an array of rules in JSON format
     * @throws APIAuthenticationException if there is an issue with API authentication
     */
    @GetMapping(path = "/rule-manifest.form", produces = {"application/json"})
    public ResponseEntity<String> getRuleManifest() throws APIAuthenticationException, JsonProcessingException {
        checkAuthorizationAndPrivilege();
        String val = cdssService.getCdssObjectMapper().writeValueAsString(ruleManagerService.getRuleManifest());

        return ResponseEntity.ok(val);

    }
}
