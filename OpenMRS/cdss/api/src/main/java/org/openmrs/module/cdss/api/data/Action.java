package org.openmrs.module.cdss.api.data;

import org.openmrs.BaseOpenmrsData;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

//@Entity(name = "cdss.Action")
//@Table(name = "cdss_action")
public class Action extends BaseOpenmrsData {
	
	@Id
	@GeneratedValue
	@Column(name = "cdss_action_id")
	private Integer id;
	
	@Basic
	@Column(name = "cdss_action_priority")
	private Integer priority;
	
	@Basic
	@Column(name = "displayString", length = 255)
	private String displayString;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer integer) {
		throw new RuntimeException("CDSS ERROR: You cannot change the id of an action instance!");
	}
	
	public Integer getPriority() {
		return priority;
	}
	
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
	
	public String getDisplayString() {
		return displayString;
	}
	
	public void setDisplayString(String displayString) {
		this.displayString = displayString;
	}
}
