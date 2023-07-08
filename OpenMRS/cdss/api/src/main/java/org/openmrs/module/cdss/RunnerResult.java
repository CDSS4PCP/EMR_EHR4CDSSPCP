package org.openmrs.module.cdss;

import org.openmrs.Patient;
import org.openmrs.module.cdss.api.data.Action;

import java.util.Arrays;

public class RunnerResult {
	
	// Message to be displayed to clinician.
	private Action[] actions;
	
	// The patient that this result is for
	private Patient patient;
	
	// The vaccine code that this result is for.
	private String vaccine;
	
	// Status of the result. if zero, then no action is needed by clinician.
	// Otherwise, some action needs to be taken as instructed by message
	private Integer status;
	
	public Action[] getActions() {
		return actions;
	}
	
	public void setActions(Action action) {
		actions = new Action[1];
		actions[0] = action;
	}
	
	public void setActions(Action[] actions) {
		this.actions = actions;
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
	
	@Override
	public String toString() {
		return "RunnerResult{" + "actions=" + Arrays.toString(actions) + ", patient=" + patient.getId() + ", vaccine='"
		        + vaccine + '\'' + ", status=" + status + '}';
	}
}
