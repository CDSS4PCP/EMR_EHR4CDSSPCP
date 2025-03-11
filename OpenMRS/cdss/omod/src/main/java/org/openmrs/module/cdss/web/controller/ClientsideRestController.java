package org.openmrs.module.cdss.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.module.cdss.api.CDSSService;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.ValueSetService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.openmrs.module.cdss.api.serialization.CdssUsageDeserializer;
import org.openmrs.module.cdss.api.serialization.CdssUsageSerializer;
import org.openmrs.module.cdss.api.serialization.RuleManifestDeserializer;
import org.openmrs.module.cdss.api.serialization.RuleManifestSerializer;
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
public class ClientsideRestController extends CdssRestController {

    Logger log = Logger.getLogger(ClientsideRestController.class);

    @Autowired
    protected CDSSDao dao;

//    @Autowired
//    protected CDSSService cdssService;

    @Autowired
    @Qualifier("adminService")
    protected AdministrationService administrationService;

    @Autowired
    protected RuleLoggerService ruleLoggerService;

    @Autowired
    protected RuleManagerService ruleManagerService;

    @Autowired
    protected ValueSetService valueSetService;


    /**
     * Records the usage of a Clinical Decision Support System (CDSS) based on the provided
     * newUsageString.
     *
     * @param newUsageString the JSON string representing the new CdssUsage to be recorded
     * @return ResponseEntity<String> containing the JSON string of the saved CdssUsage if
     * successful HttpStatus.INTERNAL_SERVER_ERROR if there is an error during processing
     */
    @RequestMapping(path = "/record-usage.form", produces = "application/json", method = {RequestMethod.POST})
    public ResponseEntity<String> recordUsage(@RequestBody String newUsageString) {
        checkAuthorizationAndPrivilege();



        ObjectMapper  objectMapper = new ObjectMapper();
        SimpleModule  simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        objectMapper.registerModule(simpleModule);

        log.debug("Received new usage string: \n" + newUsageString + "\n will attempt to parse");
        CdssUsage newUsage;
        try {
            newUsage = objectMapper.readValue(newUsageString, CdssUsage.class);
            log.debug(newUsage);
        } catch (JsonProcessingException e) {
            log.error("Error encountered when deserializing CdssUsage\n" + e.getMessage());

            return new ResponseEntity<>("Internal Error encountered", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        CdssUsage saved = ruleLoggerService.recordRuleUsage(newUsage);

        if (saved == null) {
            log.warn("Attempted to save CdssUsage but could not");
            return new ResponseEntity<>("Internal Issue Encountered", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            String savedString =objectMapper.writeValueAsString(saved);

            return new ResponseEntity<>(savedString, HttpStatus.OK);

        } catch (JsonProcessingException e) {
            log.error("Error encountered when serializing CdssUsage\n" + e.getMessage());

            return new ResponseEntity<>("Internal Error encountered", HttpStatus.INTERNAL_SERVER_ERROR);

        }
//        return new ResponseEntity<>("Did not save because cdssService is disbled", HttpStatus.OK);

    }

    /**
     * Retrieves the list of CdssUsage objects and serializes them into a JSON string using the
     * CdssObjectMapper. Returns a ResponseEntity with the JSON string if successful, or an
     * INTERNAL_SERVER_ERROR status if there is an error during processing.
     *
     * @return ResponseEntity<String> containing the JSON string of CdssUsage objects if successful
     * HttpStatus.INTERNAL_SERVER_ERROR if there is an error during processing
     */
    @RequestMapping(path = "/usages.form", produces = "application/json", method = {RequestMethod.GET})
    public ResponseEntity<String> getUsages() {
        checkAuthorizationAndPrivilege();


        ObjectMapper  objectMapper = new ObjectMapper();
        SimpleModule  simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        objectMapper.registerModule(simpleModule);


// This block is disabled because cdssService is disabled
        List<CdssUsage> usages = ruleLoggerService.getRuleUsages();

        String out = null;
        try {
            out = objectMapper.writeValueAsString(usages);
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
        checkAuthorizationAndPrivilege();

        final String apiKey = administrationService.getGlobalProperty("cdss.vsacApiKey");
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
    @RequestMapping(path = "/RetrieveFhirValueSet/{id}.form", produces = "application/json", method = {RequestMethod.GET, RequestMethod.OPTIONS})
    public ResponseEntity<String> getFhirValuesets(@PathVariable(required = true) String id, @RequestParam(required = false) String version, @RequestParam(required = false) Integer offset) {
        checkAuthorizationAndPrivilege();

        final String apiKey = administrationService.getGlobalProperty("cdss.vsacApiKey");
        ValueSetResponse valueset = valueSetService.getFhirValueSet(apiKey, id, version, offset);
        if (valueset != null)
            return new ResponseEntity<>(valueset.getContent(), HttpStatus.valueOf(valueset.getStatus()));
        return new ResponseEntity<>("Valueset was null", HttpStatus.INTERNAL_SERVER_ERROR);

    }




}
