package org.openmrs.module.cdss.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.context.ServiceContext;
import org.openmrs.module.cdss.api.CDSSService;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;
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
	
	@GetMapping(path = "/rule/{ruleId}", produces = {"application/json"})
    public ResponseEntity<String> getRule(@PathVariable(value = "ruleId") String ruleId) throws APIAuthenticationException {

        RuleManagerService service = ServiceContext.getInstance().getService(RuleManagerService.class);
        try {
            String rule = service.getRule(ruleId);
            return ResponseEntity.ok(rule);
        } catch (NullPointerException e) {
            return new ResponseEntity<>("Rule " + ruleId + " Not found", HttpStatus.NOT_FOUND);
        }

    }
	
	@GetMapping(path = "/rule.form", produces = { "application/json" })
	public ResponseEntity<String[]> getRules() throws APIAuthenticationException {
		RuleManagerService service = ServiceContext.getInstance().getService(RuleManagerService.class);
		
		String[] rules = service.getRules();
		return ResponseEntity.ok(rules);
		
	}
	
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

        RuleLoggerService service = ServiceContext.getInstance().getService(RuleLoggerService.class);
        CdssUsage saved = service.recordRuleUsage(newUsage);

//        CdssUsage saved = dao.saveEngineUsage(newUsage);
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
	
	@RequestMapping(path = "/usages.form", produces = "application/json", method = {RequestMethod.GET})
    public ResponseEntity<String> getUsages() {
        RuleLoggerService service = ServiceContext.getInstance().getService(RuleLoggerService.class);
        List<CdssUsage> usages = service.getRuleUsages();

        String out = null;
        try {
            out = cdssService.getCdssObjectMapper().writeValueAsString(usages);
        } catch (JsonProcessingException e) {
            log.error("Error encountered when serializing CdssUsage\n" + e.getMessage());
            return new ResponseEntity<>("Internal Error encountered", HttpStatus.INTERNAL_SERVER_ERROR);

        }


        return new ResponseEntity<>(out, HttpStatus.OK);
    }
	
	@RequestMapping(path = "/RetrieveSvsValueSet.form")
    public ResponseEntity<String> getSvsValuesets(@RequestParam(required = true) String id, @RequestParam(required = false) String version) {
        // Get the API key
        final String apiKey = administrationService.getGlobalProperty("cdss.vsacApiKey");

        // Create Http client
        OkHttpClient client = new OkHttpClient();

        // Encode basic authentication string
        byte[] encodedBytes = Base64.getEncoder().encode(String.format(":%s", apiKey).getBytes());
        String encoded = new String(encodedBytes);

        // Build the url parameters
        String params = String.format("%s=%s", "id", id);
        if (version != null) params = String.format("%s=%s&%s=%s", "id", id, "version", version);

        // Send the request
        Request rq = new Request.Builder().get().url(String.format("%s?%s", "https://vsac.nlm.nih.gov/vsac/svs/RetrieveValueSet", params)).header("Authorization", "Basic " + encoded).build();

        // Return response
        try {
            Response rs = client.newCall(rq).execute();
            return new ResponseEntity<>(rs.body().string(), HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@RequestMapping(path = "/RetrieveFhirValueSet/{id}.form")
    public ResponseEntity<String> getFhirValuesets(@PathVariable(required = true) String id, @RequestParam(required = false) String version, @RequestParam(required = false) Integer offset) {

        // Get the API key
        final String apiKey = administrationService.getGlobalProperty("cdss.vsacApiKey");

        // Create Http client
        OkHttpClient client = new OkHttpClient();

        // Encode basic authentication string
        byte[] encodedBytes = Base64.getEncoder().encode(String.format(":%s", apiKey).getBytes());
        String encoded = new String(encodedBytes);

        // Build the url parameters
        StringBuilder paramsBuilder = new StringBuilder();
        if (version != null || offset != null)
            paramsBuilder.append("?");

        if (version != null) paramsBuilder.append(String.format("%s=%s", "version", version));

        if (version != null && offset != null) paramsBuilder.append("&");

        if (offset != null) paramsBuilder.append(String.format("%s=%s", "offset", offset));

        // Send the request
        Request rq = new Request.Builder().get().url(String.format("https://cts.nlm.nih.gov/fhir/ValueSet/%s/$expand%s", id, paramsBuilder.toString())).header("Authorization", "Basic " + encoded).build();

        // Return response
        try {
            Response rs = client.newCall(rq).execute();
            return new ResponseEntity<>(rs.body().string(), HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@ExceptionHandler({APIAuthenticationException.class})
    public ResponseEntity<Throwable> handleApiAuthException(APIAuthenticationException e) {
        MultiValueMap<String, String> headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Send error stacktrace as json
        ResponseEntity<Throwable> response = new ResponseEntity<>(e, headers, HttpStatus.UNAUTHORIZED);
        return response;
    }
}
