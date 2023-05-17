package org.openmrs.module.cdss;

import org.openmrs.Patient;

public class RunnerResult {
	
	// Message to be displayed to clinician.
	private String message;
	
	// The patient that this result is for
	private Patient patient;
	
	// The vaccine code that this result is for.
	private String vaccine;
	
	// Status of the result. if zero, then no action is needed by clinician.
	// Otherwise, some action needs to be taken as instructed by message
	private int status;
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public Patient getPatient() {
		return patient;
	}
	
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	
	public String getVaccine() {
		return vaccine;
	}
	
	public void setVaccine(String vaccine) {
		this.vaccine = vaccine;
	}
	
	public int getStatus() {
		return status;
	}
	
	public void setStatus(int status) {
		this.status = status;
	}
}
