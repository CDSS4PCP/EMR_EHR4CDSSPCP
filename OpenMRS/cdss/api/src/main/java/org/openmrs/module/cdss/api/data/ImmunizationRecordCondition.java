package org.openmrs.module.cdss.api.data;

import org.openmrs.module.cdss.api.util.BaseTimeUnit;

import java.util.Arrays;

public class ImmunizationRecordCondition {
	
	class Dose {
		
		Integer timePeriod;
		
		AgeCondition ageCondition = new AgeCondition();
		
		public Integer getTimePeriod() {
			return timePeriod;
		}
		
		public void setTimePeriod(Integer timePeriod) {
			this.timePeriod = timePeriod;
		}
		
		public Integer getMinAdministerAge() {
			return ageCondition.minimumAge;
		}
		
		public void setMinAdministerAge(Integer minAdministerAge) {
			ageCondition.setMinimumAge(minAdministerAge);
		}
		
		public BaseTimeUnit getMinAdministerAgeUnit() {
			return ageCondition.getMinimumAgeUnit();
		}
		
		public void setMinAdministerAgeUnit(BaseTimeUnit unit) {
			ageCondition.setMinimumAgeUnit(unit);
		}
		
		public Integer getMaxAdministerAge() {
			return ageCondition.getMaximumAge();
		}
		
		public void setMaxAdministerAgeUnit(BaseTimeUnit unit) {
			ageCondition.setMaximumAgeUnit(unit);
		}
		
		public BaseTimeUnit getMaxAdministerAgeUnit() {
			return ageCondition.getMaximumAgeUnit();
		}
		
		public void setMaxAdministerAge(Integer maxAdministerAge) {
			ageCondition.setMaximumAge(maxAdministerAge);
		}
		
		public boolean isTimePeriodBased() {
			return timePeriod != null;
		}
		
		public boolean isAgeBased() {
			return ageCondition != null && (ageCondition.getMinimumAge() != null || ageCondition.getMaximumAge() != null);
		}
		
		public AgeCondition getAgeCondition() {
			return ageCondition;
		}
		
		public void setAgeCondition(AgeCondition ageCondition) {
			this.ageCondition = ageCondition;
		}
		
		@Override
		public String toString() {
			return "Dose{" + "timePeriod=" + timePeriod + ", ageCondition=" + ageCondition + '}';
		}
	}
	
	String vaccine;
	
	Integer numberDoses;
	
	Dose[] doses;
	
	public ImmunizationRecordCondition(String vaccine, Integer numberDoses) {
		this.vaccine = vaccine;
		this.numberDoses = numberDoses;
		this.doses = new Dose[numberDoses + 1];
		
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
	
	public void setDoseTimePeriod(Integer doseIndex, Integer timePeriod) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setTimePeriod(timePeriod);
	}
	
	public Integer getDoseTimePeriod(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		
		return doses[doseIndex].getTimePeriod();
	}
	
	public BaseTimeUnit getDoseMinAgeUnit(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		
		return doses[doseIndex].getMinAdministerAgeUnit();
	}
	
	public void setDoseMinAgeUnit(Integer doseIndex, BaseTimeUnit unit) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setMinAdministerAgeUnit(unit);
	}
	
	public Integer getDoseMinAge(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		
		return doses[doseIndex].getMinAdministerAge();
	}
	
	public void setDoseMinAge(Integer doseIndex, Integer minAdministerAge) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setMinAdministerAge(minAdministerAge);
	}
	
	public Integer getDoseMaxAge(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		return doses[doseIndex].getMaxAdministerAge();
	}
	
	public void setDoseMaxAge(Integer doseIndex, Integer maxAdministerAge) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setMaxAdministerAge(maxAdministerAge);
	}
	
	public BaseTimeUnit getDoseMaxAgeUnit(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		return doses[doseIndex].getMaxAdministerAgeUnit();
	}
	
	public void setDoseMaxAgeUnit(Integer doseIndex, BaseTimeUnit unit) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setMaxAdministerAgeUnit(unit);
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
	
	public void setAgeCondition(Integer doseIndex, AgeCondition ageCondition) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		doses[doseIndex].setAgeCondition(ageCondition);
	}
	
	public AgeCondition getAgeCondition(Integer doseIndex) {
		//		if (doses[doseIndex] == null)
		//			doses[doseIndex] = new Dose();
		return doses[doseIndex].getAgeCondition();
	}
	
	@Override
	public String toString() {
		return "ImmunizationRecordCondition{" + "vaccine='" + vaccine + '\'' + ", numberDoses=" + numberDoses + ", doses="
		        + Arrays.toString(doses) + '}';
	}
}
