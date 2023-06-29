package org.openmrs.module.cdss.api.data;

import java.util.Arrays;

public class ImmunizationRecordCondition {
	
	class Dose {
		
		Integer timePeriod;
		
		Integer minAdministerAge;
		
		Integer maxAdministerAge;
		
		public Integer getTimePeriod() {
			return timePeriod;
		}
		
		public void setTimePeriod(Integer timePeriod) {
			this.timePeriod = timePeriod;
		}
		
		public Integer getMinAdministerAge() {
			return minAdministerAge;
		}
		
		public void setMinAdministerAge(Integer minAdministerAge) {
			this.minAdministerAge = minAdministerAge;
		}
		
		public Integer getMaxAdministerAge() {
			return maxAdministerAge;
		}
		
		public void setMaxAdministerAge(Integer maxAdministerAge) {
			this.maxAdministerAge = maxAdministerAge;
		}
		
		public boolean isTimePeriodBased() {
			return timePeriod != null;
		}
		
		public boolean isAgeBased() {
			return maxAdministerAge != null || minAdministerAge != null;
		}
	}
	
	String vaccine;
	
	Integer numberDoses;
	
	Dose[] doses;
	
	public ImmunizationRecordCondition(String vaccine, Integer numberDoses) {
		this.vaccine = vaccine;
		this.numberDoses = numberDoses;
		this.doses = new Dose[numberDoses + 1];
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
	
	public Dose getDose(Integer doseIndex) {
		return doses[doseIndex];
	}
	
	public Integer getDoseTimePeriod(Integer doseIndex) {
		if (doses[doseIndex] == null)
			doses[doseIndex] = new Dose();
		
		return doses[doseIndex].timePeriod;
	}
	
	public Integer getDoseMinAge(Integer doseIndex) {
		if (doses[doseIndex] == null)
			doses[doseIndex] = new Dose();
		
		return doses[doseIndex].timePeriod;
	}
	
	public Integer getDoseMaxAge(Integer doseIndex) {
		if (doses[doseIndex] == null)
			doses[doseIndex] = new Dose();
		return doses[doseIndex].maxAdministerAge;
	}
	
	public void setDoseTimePeriod(Integer doseIndex, Integer timePeriod) {
		if (doses[doseIndex] == null)
			doses[doseIndex] = new Dose();
		doses[doseIndex].timePeriod = timePeriod;
	}
	
	public void setDoseMinAge(Integer doseIndex, Integer minAdministerAge) {
		if (doses[doseIndex] == null)
			doses[doseIndex] = new Dose();
		doses[doseIndex].minAdministerAge = minAdministerAge;
	}
	
	public void setDoseMaxAge(Integer doseIndex, Integer maxAdministerAge) {
		if (doses[doseIndex] == null)
			doses[doseIndex] = new Dose();
		doses[doseIndex].maxAdministerAge = maxAdministerAge;
	}
	
	@Override
	public String toString() {
		return "ImmunizationRecordCondition{" + "vaccine='" + vaccine + '\'' + ", numberDoses=" + numberDoses
		        + ", intervals=" + Arrays.toString(doses) + '}';
	}
}
