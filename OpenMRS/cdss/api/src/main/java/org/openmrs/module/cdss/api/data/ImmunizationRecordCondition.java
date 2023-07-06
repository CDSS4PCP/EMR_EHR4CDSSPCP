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
		
		@Override
		public String toString() {
			return "Dose{" + "timePeriod=" + timePeriod + ", minAdministerAge=" + minAdministerAge + ", maxAdministerAge="
			        + maxAdministerAge + '}';
		}
	}
	
	String vaccine;
	
	Integer numberDoses;
	
	Dose[] doses;
	
	public ImmunizationRecordCondition(String vaccine, Integer numberDoses) {
		this.vaccine = vaccine;
		this.numberDoses = numberDoses;
		this.doses = new Dose[numberDoses + 10];
		
		for (int i = 0; i < doses.length; i++) {
			doses[i] = new Dose();
		}
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
	
	public Integer getDoseTimePeriod(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		
		return doses[doseIndex].getTimePeriod();
	}
	
	public Integer getDoseMinAge(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		
		return doses[doseIndex].getMinAdministerAge();
	}
	
	public Integer getDoseMaxAge(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		return doses[doseIndex].getMaxAdministerAge();
	}
	
	public void setDoseTimePeriod(Integer doseIndex, Integer timePeriod) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setTimePeriod(timePeriod);
	}
	
	public void setDoseMinAge(Integer doseIndex, Integer minAdministerAge) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setMinAdministerAge(minAdministerAge);
	}
	
	public void setDoseMaxAge(Integer doseIndex, Integer maxAdministerAge) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setMaxAdministerAge(maxAdministerAge);
	}
	
	public Boolean isDoseTimePeriodBased(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		return doses[doseIndex].isTimePeriodBased();
	}
	
	public Boolean isDoseAgeBased(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		return doses[doseIndex].isAgeBased();
	}
	
	@Override
	public String toString() {
		return "ImmunizationRecordCondition{" + "vaccine='" + vaccine + '\'' + ", numberDoses=" + numberDoses + ", doses="
		        + Arrays.toString(doses) + '}';
	}
}
