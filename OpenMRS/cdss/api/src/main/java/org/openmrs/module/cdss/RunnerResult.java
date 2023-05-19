package org.openmrs.module.cdss;

import org.openmrs.Patient;
import org.openmrs.module.cdss.api.data.Action;

public class RunnerResult {
	
	// Message to be displayed to clinician.
	private Action action;
	
	// The patient that this result is for
	private Patient patient;
	
	// The vaccine code that this result is for.
	private String vaccine;
	
	// Status of the result. if zero, then no action is needed by clinician.
	// Otherwise, some action needs to be taken as instructed by message
	private int status;
	
	public Action getAction() {
		return action;
	}
	
	public void setAction(Action action) {
		this.action = action;
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
