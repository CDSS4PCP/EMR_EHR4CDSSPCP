package org.openmrs.module.cdss.api.data;

import org.openmrs.module.cdss.api.util.TimeUnit;

import java.util.Arrays;
import java.util.Comparator;

public class Rule {
	
	public static class RuleIdComparator implements Comparator<Rule> {
		
		@Override
		public int compare(Rule o1, Rule o2) {
			return o1.getId() - o2.getId();
		}
		
	}
	
	public static class RuleVaccineComparator implements Comparator<Rule> {
		
		@Override
		public int compare(Rule o1, Rule o2) {
			int val1 = o1.getVaccine().compareTo(o2.getVaccine());
			
			if (val1 == 0) {
				RuleIdComparator cmp = new RuleIdComparator();
				return cmp.compare(o1, o2);
			}
			
			return val1;
		}
		
	}
	
	private static int nextIndex = 0;
	
	private Integer id;
	
	private String vaccine;
	
	private Integer minimumAge;
	
	private Integer maximumAge;
	
	private TimeUnit ageUnit;
	
	private SpecialCondition specialCondition;
	
	private String[] medicalConditions;
	
	private String previousRecord;
	
	private Action[] actions;
	
	public Rule() {
		id = nextIndex++;
	}
	
	public Rule(Integer id, String vaccine, Integer minimumAge, Integer maximumAge, Action... actions) {
		this.id = id;
		this.vaccine = vaccine;
		this.minimumAge = minimumAge;
		this.maximumAge = maximumAge;
		this.ageUnit = TimeUnit.Day;
		this.actions = actions;
		
		if (id == nextIndex) {
			nextIndex++;
		}
	}
	
	public Rule(String vaccine, Integer minimumAge, Integer maximumAge, Action... actions) {
		this.id = nextIndex;
		this.vaccine = vaccine;
		this.minimumAge = minimumAge;
		this.maximumAge = maximumAge;
		this.ageUnit = TimeUnit.Day;
		this.actions = actions;
		
		nextIndex++;
		
	}
	
	public Integer getId() {
		return id;
	}
	
	public String getVaccine() {
		return vaccine;
	}
	
	public void setVaccine(String vaccine) {
		this.vaccine = vaccine;
	}
	
	public Integer getMinimumAge() {
		return minimumAge;
	}
	
	public void setMinimumAge(Integer minimumAge) {
		this.minimumAge = minimumAge;
	}
	
	public Integer getMaximumAge() {
		return maximumAge;
	}
	
	public void setMaximumAge(Integer maximumAge) {
		this.maximumAge = maximumAge;
	}
	
	public TimeUnit getAgeUnit() {
		return ageUnit;
	}
	
	public void setAgeUnit(TimeUnit ageUnit) {
		this.ageUnit = ageUnit;
	}
	
	public SpecialCondition getSpecialCondition() {
		return specialCondition;
	}
	
	public void setSpecialCondition(SpecialCondition specialCondition) {
		this.specialCondition = specialCondition;
	}
	
	public void setSpecialCondition(String label) {
		this.specialCondition = new SpecialCondition(label);
	}
	
	public String[] getMedicalConditions() {
		return medicalConditions;
	}
	
	public void setMedicalConditions(String... medicalConditions) {
		this.medicalConditions = medicalConditions;
	}
	
	public String getPreviousRecord() {
		return previousRecord;
	}
	
	public void setPreviousRecord(String previousRecord) {
		this.previousRecord = previousRecord;
	}
	
	public Action[] getActions() {
		return actions;
	}
	
	public void setActions(Action[] actions) {
		this.actions = actions;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Rule rule = (Rule) o;
		return id.equals(rule.id) && vaccine.equals(rule.vaccine) && minimumAge.equals(rule.minimumAge)
		        && maximumAge.equals(rule.maximumAge) && specialCondition.equals(rule.specialCondition)
		        && medicalConditions.equals(rule.medicalConditions) && previousRecord.equals(rule.previousRecord)
		        && Arrays.equals(actions, rule.actions);
	}
	
	@Override
	public String toString() {
		return "Rule{" + "id=" + id + ", vaccine='" + vaccine + '\'' + ", minimumAge=" + minimumAge + ", maximumAge="
		        + maximumAge + ", specialCondition='" + specialCondition + '\'' + ", medicalConditions='"
		        + Arrays.toString(medicalConditions) + '\'' + ", previousRecord='" + previousRecord + '\'' + ", actions="
		        + Arrays.toString(actions) + '}';
	}
}
