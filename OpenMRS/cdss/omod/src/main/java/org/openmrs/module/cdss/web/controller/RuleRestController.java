package org.openmrs.module.cdss.web.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cdss")
public class RuleRestController extends CdssRestController {
    Logger log = Logger.getLogger(RuleRestController.class);

    @Autowired
    @Qualifier("adminService")
    protected AdministrationService administrationService;
    @Autowired
    protected RuleManagerService ruleManagerService;

    private OkHttpClient client;

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
        if (allRules == null) {
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


    @PostMapping(path = "/modify-rule.form", produces = {"application/json"})
    public ResponseEntity<String> modifyRule(@RequestBody String body) throws APIAuthenticationException, JsonProcessingException {
//        checkAuthorizationAndPrivilege();
        if (client == null) {
            client = new OkHttpClient();
        }

        Map<String, Object> map = cdssService.getCdssObjectMapper().readValue(body, HashMap.class);
        log.debug("Get BODY: " + map);
        String ruleId;
        String version;
        HashMap<String, HashMap<String, Object>> params;

        try {
            ruleId = (String) ((Map<String, Object>) map.get("rule")).get("id");
        } catch (NullPointerException e) {
            return new ResponseEntity<>("rule.id is required!", HttpStatus.BAD_REQUEST);
        }
        try {
            version = (String) ((Map<String, Object>) map.get("rule")).get("version");
        } catch (NullPointerException e) {
            version = null;
        }
        try {
            params = ((HashMap<String, HashMap<String, Object>>) map.get("params"));

        } catch (NullPointerException e) {
            return new ResponseEntity<>("params is required?", HttpStatus.BAD_REQUEST);
        }


        String stringManifest = cdssService.getCdssObjectMapper().writeValueAsString(ruleManagerService.getRuleManifest());
        RuleManifest manifest = cdssService.getCdssObjectMapper().readValue(stringManifest, RuleManifest.class);

        HashMap<String, HashMap<String, Object>> newRequestBody = new HashMap<>();
        newRequestBody.put("params", new HashMap<>());

        for (Map.Entry<String, HashMap<String, Object>> entry : params.entrySet()) {
            HashMap<String, Object> param = entry.getValue();
            String paramName = entry.getKey();
            Object newValue = param.get("value");
            RuleDescriptor ruleDescriptor = manifest.getRule(ruleId, version);
            ParamDescriptor newParamDescriptor = new ParamDescriptor(ruleDescriptor.getParams().get(paramName));
            newParamDescriptor.setValue(newValue);
            ruleDescriptor.getParams().put(paramName, newParamDescriptor);
            newRequestBody.get("params").put(paramName, newParamDescriptor);
        }
        newRequestBody.put("rule", new HashMap<>());
        newRequestBody.get("rule").put("id", ruleId);
        if (version != null)
            newRequestBody.get("rule").put("version", version);
        newRequestBody.get("rule").put("content", encodeCql(ruleManagerService.getCqlRule(ruleId)));

        String stringBody = cdssService.getCdssObjectMapper().writeValueAsString(newRequestBody);
        log.debug(stringBody);

        okhttp3.RequestBody body1 = okhttp3.RequestBody.create(
                MediaType.parse("application/json"), stringBody);
        Request rq = new Request.Builder().post(body1).url("http://host.docker.internal:9090/api/inject").build();

        try {
            Response rs = client.newCall(rq).execute();
            String result = rs.body().string();
            rs.body().close();

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }

    }

    public static String decodeCql(String encodedCql) {
        byte[] bytes = encodedCql.getBytes(StandardCharsets.UTF_8);
        byte[] decoded = Base64.getDecoder().decode(bytes);
        String decodedCql = new String(decoded, StandardCharsets.UTF_8);
        return decodedCql;
    }


    public static String encodeCql(String cql) {
        byte[] bytes = cql.getBytes(StandardCharsets.UTF_8);
        byte[] encoded = Base64.getEncoder().encode(bytes);
        String encodedCql = new String(encoded, StandardCharsets.UTF_8);
        return encodedCql;
    }
}
