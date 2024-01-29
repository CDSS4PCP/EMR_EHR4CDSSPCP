package org.openmrs.module.cdss.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cdss")
public class ClientsideRestController {
	
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
	
	@GetMapping(path = "/patient.form", produces = "application/json")
	public String getPatient() {
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("cql/patient.json");
		
		if (is != null) {
			String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
			
			return result;
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "cql/patient.json not found");
	}
	
}
