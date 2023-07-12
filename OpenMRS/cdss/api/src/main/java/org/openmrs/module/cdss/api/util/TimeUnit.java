package org.openmrs.module.cdss.api.util;

public enum TimeUnit {
	YEAR("year"), MONTH("month"), WEEK("week"), DAY("day");
	
	private String value;
	
	TimeUnit(String value) {
		this.value = value.toUpperCase();
	}
	
	@Override
	public String toString() {
		return value;
	}
}
