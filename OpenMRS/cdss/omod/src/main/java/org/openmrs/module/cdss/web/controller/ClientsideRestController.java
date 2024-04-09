package org.openmrs.module.cdss.web.controller;

import org.apache.log4j.Logger;
import org.openmrs.api.context.ServiceContext;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cdss")
public class ClientsideRestController {

    Logger log = Logger.getLogger(ClientsideRestController.class);

    @Autowired
    CDSSDao dao;

    @GetMapping(path = "/rule/{ruleId}", produces = "application/json")
    public String getRule(@PathVariable(value = "ruleId") String ruleId) {
        String path = "cql/" + ruleId;
        if (!ruleId.endsWith(".json")) {
            path = path + ".json";
        }
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        InputStream is = classloader.getResourceAsStream(path);

        if (is != null) {
            String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));

            return result;
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, path + " not found");
    }

    @RequestMapping(path = "/record-usage.form", produces = "application/json", method = {RequestMethod.POST})
    public String recordUsage(@RequestBody CdssUsage newUsage) {
        log.debug("Saving " + newUsage.toString());

        CdssUsage saved = dao.saveEngineUsage(newUsage);
        return "{\"status\":\"success\", \"id\": " + saved.getId() + "}";
    }

    @RequestMapping(path = "/usages.form", produces = "application/json", method = {RequestMethod.GET})
    public List<CdssUsage> getUsages() {

        RuleLoggerService service = ServiceContext.getInstance().getService(RuleLoggerService.class);
        List<CdssUsage> usages = service.getRuleUsages();
        return usages;
    }
}
