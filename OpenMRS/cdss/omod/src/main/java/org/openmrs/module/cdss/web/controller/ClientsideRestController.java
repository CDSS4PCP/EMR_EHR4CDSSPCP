package org.openmrs.module.cdss.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.ServiceContext;
import org.openmrs.module.cdss.api.CDSSService;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.ValueSetService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.openmrs.module.cdss.api.util.ValueSetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cdss")
public class ClientsideRestController {

    Logger log = Logger.getLogger(ClientsideRestController.class);

    @Autowired
    CDSSDao dao;

    @Autowired
    CDSSService cdssService;

    @Autowired
    @Qualifier("adminService")
    protected AdministrationService administrationService;

    @Autowired
    protected RuleLoggerService ruleLoggerService;

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
    @GetMapping(path = "/rule/{ruleId}", produces = {"application/json"})
    public ResponseEntity<String> getRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {

        try {
            String rule = ruleManagerService.getRule(ruleId);
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
    public ResponseEntity<String[]> getRules() throws APIAuthenticationException {
        String[] rules = ruleManagerService.getRules();
        return ResponseEntity.ok(rules);

    }

    /**
     * Records the usage of a Clinical Decision Support System (CDSS) based on the provided newUsageString.
     *
     * @param newUsageString the JSON string representing the new CdssUsage to be recorded
     * @return ResponseEntity<String> containing the JSON string of the saved CdssUsage if successful
     * HttpStatus.INTERNAL_SERVER_ERROR if there is an error during processing
     */
    @RequestMapping(path = "/record-usage.form", produces = "application/json", method = {RequestMethod.POST})
    public ResponseEntity<String> recordUsage(@RequestBody String newUsageString) {
        CdssUsage newUsage;
        try {
            newUsage = cdssService.getCdssObjectMapper().readValue(newUsageString, CdssUsage.class);
            log.debug(newUsage);
        } catch (JsonProcessingException e) {
            log.error("Error encountered when deserializing CdssUsage\n" + e.getMessage());

            return new ResponseEntity<>("Internal Error encountered", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        CdssUsage saved = ruleLoggerService.recordRuleUsage(newUsage);

        if (saved == null) {
            log.warn("Attempted to save CdssUsage but could not");
            return new ResponseEntity<>("Internal Issue Encountered", HttpStatus.OK);
        }

        try {
            String savedString = cdssService.getCdssObjectMapper().writeValueAsString(saved);

            return new ResponseEntity<>(savedString, HttpStatus.OK);

        } catch (JsonProcessingException e) {
            log.error("Error encountered when serializing CdssUsage\n" + e.getMessage());

            return new ResponseEntity<>("Internal Error encountered", HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    /**
     * Retrieves the list of CdssUsage objects and serializes them into a JSON string using the CdssObjectMapper.
     * Returns a ResponseEntity with the JSON string if successful, or an INTERNAL_SERVER_ERROR status if there is an error during processing.
     *
     * @return ResponseEntity<String> containing the JSON string of CdssUsage objects if successful
     * HttpStatus.INTERNAL_SERVER_ERROR if there is an error during processing
     */
    @RequestMapping(path = "/usages.form", produces = "application/json", method = {RequestMethod.GET})
    public ResponseEntity<String> getUsages() {
        List<CdssUsage> usages = ruleLoggerService.getRuleUsages();

        String out = null;
        try {
            out = cdssService.getCdssObjectMapper().writeValueAsString(usages);
        } catch (JsonProcessingException e) {
            log.error("Error encountered when serializing CdssUsage\n" + e.getMessage());
            return new ResponseEntity<>("Internal Error encountered", HttpStatus.INTERNAL_SERVER_ERROR);

        }


        return new ResponseEntity<>(out, HttpStatus.OK);
    }

    /**
     * Retrieves the valuesets based on the provided id and version.
     *
     * @param id      the unique identifier of the valueset to retrieve
     * @param version the version of the valueset (optional)
     * @return ResponseEntity<String> containing the content of the valueset if found
     * HttpStatus.INTERNAL_SERVER_ERROR if there is an error during processing
     */
    @RequestMapping(path = "/RetrieveSvsValueSet.form", produces = "application/xml")
    public ResponseEntity<String> getSvsValuesets(@RequestParam(required = true) String id, @RequestParam(required = false) String version) {

        final String apiKey = administrationService.getGlobalProperty("cdss.vsacApiKey");
        ValueSetService valueSetService = ServiceContext.getInstance().getService(ValueSetService.class);
        ValueSetResponse valueset = valueSetService.getSvsValueSet(apiKey, id, version);

        if (valueset != null)
            return new ResponseEntity<>(valueset.getContent(), HttpStatus.valueOf(valueset.getStatus()));
        return new ResponseEntity<>("Valueset was null", HttpStatus.INTERNAL_SERVER_ERROR);

    }


    /**
     * Retrieves FHIR value sets based on the provided id, version, and offset.
     *
     * @param id      the unique identifier of the value set to retrieve
     * @param version the version of the value set (optional)
     * @param offset  the offset for pagination (optional)
     * @return ResponseEntity<String> containing the content of the value set if found
     * HttpStatus.INTERNAL_SERVER_ERROR if there is an error during processing
     */
    @RequestMapping(path = "/RetrieveFhirValueSet/{id}.form", produces = "application/json")
    public ResponseEntity<String> getFhirValuesets(@PathVariable(required = true) String id, @RequestParam(required = false) String version, @RequestParam(required = false) Integer offset) {

        final String apiKey = administrationService.getGlobalProperty("cdss.vsacApiKey");
        ValueSetService valueSetService = ServiceContext.getInstance().getService(ValueSetService.class);
        ValueSetResponse valueset = valueSetService.getFhirValueSet(apiKey, id, version, offset);
        if (valueset != null)
            return new ResponseEntity<>(valueset.getContent(), HttpStatus.valueOf(valueset.getStatus()));
        return new ResponseEntity<>("Valueset was null", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles APIAuthenticationException by creating a ResponseEntity with the exception details.
     *
     * @param error the APIAuthenticationException to handle
     * @return ResponseEntity<Throwable> containing the exception details in JSON format
     */
    @ExceptionHandler({APIAuthenticationException.class})
    public ResponseEntity<Throwable> handleApiAuthException(APIAuthenticationException error) {
        MultiValueMap<String, String> headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Send error stacktrace as json
        ResponseEntity<Throwable> response = new ResponseEntity<>(error, headers, HttpStatus.UNAUTHORIZED);
        return response;
    }
}
