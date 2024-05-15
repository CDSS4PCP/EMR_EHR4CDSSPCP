package org.openmrs.module.cdss.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.log4j.Logger;
import org.openmrs.api.OpenmrsService;
import org.openmrs.api.context.ServiceContext;
import org.openmrs.module.cdss.api.CDSSService;
import org.openmrs.module.cdss.api.RuleLoggerService;
import org.openmrs.module.cdss.api.dao.CDSSDao;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
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
	
	@Autowired
	CDSSService cdssService;
	
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
	
	@RequestMapping(path = "/record-usage.form", produces = "application/json", method = { RequestMethod.POST })
	public CdssUsage recordUsage(@RequestBody CdssUsage newUsage) {
		
		CdssUsage saved = dao.saveEngineUsage(newUsage);
		if (saved != null)
			return saved;
		else {
			return null;
		}
	}
	
	@RequestMapping(path = "/usages.form", produces = "application/json", method = { RequestMethod.GET })
	public String getUsages() {
		RuleLoggerService service = ServiceContext.getInstance().getService(RuleLoggerService.class);
		List<CdssUsage> usages = service.getRuleUsages();

		String out = null;
		try {
			out = cdssService.getCdssObjectMapper().writeValueAsString(usages);
		}
		catch (JsonProcessingException e) {
			out = "{\"error\":true, \"exception\":\"" + e + "\"}";
		}
		
		return out;
	}
	

	


}
