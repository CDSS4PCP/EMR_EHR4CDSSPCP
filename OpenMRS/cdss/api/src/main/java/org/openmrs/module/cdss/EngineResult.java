package org.openmrs.module.cdss;

import org.openmrs.Patient;
import org.openmrs.module.cdss.api.data.Action;
import org.openmrs.module.cdss.api.data.Rule;

import java.time.ZonedDateTime;
import java.util.*;

public class EngineResult {
	
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
	
	ZonedDateTime timestamp;
	
	public List<Action> getActions() {
		return actions;
	}
	
	public EngineResult() {
		timestamp = ZonedDateTime.now();
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
	
	public String getId() {
		return hashCode() + "";
	}
	
	public ZonedDateTime getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(ZonedDateTime timestamp) {
		this.timestamp = timestamp;
	}
	
	@Override
	public String toString() {
		return "RunnerResult{" + "actions=" + actions + ", patient=" + patient.getId() + ", vaccine='" + vaccine + '\''
		        + ", status=" + status + '}';
	}
	
	//    @Override
	//    public boolean equals(Object o) {
	//        if (this == o) return true;
	//        if (o == null || getClass() != o.getClass()) return false;
	//        EngineResult result = (EngineResult) o;
	//        return Objects.equals(actions, result.actions) && Objects.equals(patient, result.patient) && Objects.equals(vaccine, result.vaccine) && Objects.equals(rule, result.rule) && Objects.equals(status, result.status);
	//    }
	
	@Override
	public int hashCode() {
		return Arrays.hashCode(new Object[] { actions, //auto-boxed
		        patient, //auto-boxed
		        vaccine, rule, status, timestamp.getDayOfYear(), timestamp.getYear() });
	}
}
