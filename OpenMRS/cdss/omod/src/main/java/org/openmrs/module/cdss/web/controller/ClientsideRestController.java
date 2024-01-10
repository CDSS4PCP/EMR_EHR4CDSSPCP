package org.openmrs.module.cdss.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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
	
	@GetMapping(path = "/rule1.form", produces = "application/json")
	public String getRule() {
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("cql/age-1.json");
		
		if (is != null) {
			String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
			
			return result;
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "cql/age.json not found");
	}
	
	@GetMapping(path = "/FHIRHelpers.form", produces = "application/json")
	public String getFhirHelpers() {
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("cql/FHIRHelpers.json");
		
		if (is != null) {
			String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
			
			return result;
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "cql/age.json not found");
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
