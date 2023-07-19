package org.openmrs.module.cdss;

import org.openmrs.Patient;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.Rule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RunnerResult {
	
	// Message to be displayed to clinician.
	private List<Action> actions;
	
	// The patient that this result is for
	private Patient patient;
	
	// The vaccine code that this result is for.
	private String vaccine;
	
	private Rule rule;
	
	// Status of the result. if zero, then no action is needed by clinician.
	// Otherwise, some action needs to be taken as instructed by message
	private Integer status;
	
	public List<Action> getActions() {
		return actions;
	}
	
	public void setActions(Action action) {
		actions = new ArrayList<Action>();
		actions.add(action);
	}
	
	public void setActions(Action... actions) {
		this.actions = Arrays.asList(actions);
		
	}
	
	public void setActions(List<Action> actions) {
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
	
	public Rule getRule() {
		return rule;
	}
	
	public void setRule(Rule rule) {
		this.rule = rule;
	}
	
	public int getStatus() {
		return status;
	}
	
	public void setStatus(int status) {
		this.status = status;
	}
	
	@Override
	public String toString() {
		return "RunnerResult{" + "actions=" + actions + ", patient=" + patient.getId() + ", vaccine='" + vaccine + '\''
		        + ", status=" + status + '}';
	}
}
