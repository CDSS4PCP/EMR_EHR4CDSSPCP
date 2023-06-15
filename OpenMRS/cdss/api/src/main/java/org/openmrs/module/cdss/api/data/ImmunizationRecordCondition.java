package org.openmrs.module.cdss.api.data;

import java.util.Arrays;

public class ImmunizationRecordCondition {
	
	String vaccine;
	
	Integer numberDoses;
	
	Integer[] intervals;
	
	public ImmunizationRecordCondition(String vaccine, Integer numberDoses) {
		this.vaccine = vaccine;
		this.numberDoses = numberDoses;
		this.intervals = new Integer[numberDoses + 1];
	}
	
	public String getVaccine() {
		return vaccine;
	}
	
	public void setVaccine(String vaccine) {
		this.vaccine = vaccine;
	}
	
	public Integer getNumberDoses() {
		return numberDoses;
	}
	
	public void setNumberDoses(Integer numberDoses) {
		this.numberDoses = numberDoses;
	}
	
	public Integer getIntervalAfterDose(Integer doseIndex) {
		
		if (doseIndex >= intervals.length) {
			return null;
		}
		return intervals[doseIndex - 1];
	}
	
	public void setIntervalAfterDose(Integer doseIndex, Integer interval) {
		
		if (doseIndex >= intervals.length) {
			return;
		}
		intervals[doseIndex - 1] = interval;
	}
	
	@Override
	public String toString() {
		return "ImmunizationRecordCondition{" + "vaccine='" + vaccine + '\'' + ", numberDoses=" + numberDoses
		        + ", intervals=" + Arrays.toString(intervals) + '}';
	}
}
