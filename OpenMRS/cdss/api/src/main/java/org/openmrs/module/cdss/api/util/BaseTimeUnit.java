package org.openmrs.module.cdss.api.util;

public enum BaseTimeUnit {
	MONTH("month"), DAY("day");
	
	private String value;
	
	BaseTimeUnit(String value) {
		this.value = value;
	}
	
	@Override
	public String toString() {
		return value;
	}
}
