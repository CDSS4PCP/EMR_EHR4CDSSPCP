package org.openmrs.module.cdss.api.data;

import org.openmrs.Concept;
import org.openmrs.module.cdss.api.util.BaseTimeUnit;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

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
	
	private AgeCondition ageCondition;
	
	private SpecialCondition specialCondition;
	
	private List<Concept> medicalConditions;
	
	private ImmunizationRecordCondition previousRecord;
	
	private List<Action> actions;
	
	public Rule() {
		id = nextIndex++;
		ageCondition = new AgeCondition();
	}
	
	public Rule(Integer id, String vaccine, Integer minimumAge, Integer maximumAge, Action... actions) {
		this.id = id;
		this.vaccine = vaccine;
		this.ageCondition = new AgeCondition(minimumAge, maximumAge);
		this.actions = Arrays.asList(actions);
		
		if (id == nextIndex) {
			nextIndex++;
		}
	}
	
	public Rule(String vaccine, Integer minimumAge, Integer maximumAge, Action... actions) {
		this(nextIndex, vaccine, minimumAge, maximumAge, actions);
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
		return ageCondition.getMinimumAge();
	}
	
	public void setMinimumAge(Integer minimumAge) {
		ageCondition.setMinimumAge(minimumAge);
	}
	
	public BaseTimeUnit getMinimumAgeUnit() {
		return ageCondition.getMinimumAgeUnit();
	}
	
	public void setMinimumAgeUnit(BaseTimeUnit unit) {
		ageCondition.setMinimumAgeUnit(unit);
	}
	
	public Integer getMaximumAge() {
		return ageCondition.getMaximumAge();
	}
	
	public void setMaximumAge(Integer maximumAge) {
		ageCondition.setMaximumAge(maximumAge);
	}
	
	public BaseTimeUnit getMaximumAgeUnit() {
		return ageCondition.getMaximumAgeUnit();
	}
	
	public void setMaximumAgeUnit(BaseTimeUnit unit) {
		ageCondition.setMaximumAgeUnit(unit);
	}
	
	public AgeCondition getAgeCondition() {
		return ageCondition;
	}
	
	public void setAgeCondition(AgeCondition ageCondition) {
		this.ageCondition = ageCondition;
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
	
	public List<Concept> getMedicalConditions() {
		return medicalConditions;
	}
	
	public void setMedicalConditions(Concept... medicalConditions) {
		if (medicalConditions == null || medicalConditions.length == 0) {
			this.medicalConditions = null;
			return;
		}
		this.medicalConditions = new ArrayList<Concept>();
		for (Concept condition : medicalConditions) {
			if (condition != null)
				this.medicalConditions.add(condition);
		}
	}
	
	public ImmunizationRecordCondition getPreviousRecord() {
		return previousRecord;
	}
	
	public void setPreviousRecord(ImmunizationRecordCondition previousRecord) {
		this.previousRecord = previousRecord;
	}
	
	public List<Action> getActions() {
		return actions;
	}
	
	public void setActions(Action... actions) {
		this.actions = new ArrayList<Action>(Arrays.asList(actions));
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Rule rule = (Rule) o;
		return id.equals(rule.id) && vaccine.equals(rule.vaccine) && ageCondition.equals(rule.ageCondition)
		        && specialCondition.equals(rule.specialCondition) && medicalConditions.equals(rule.medicalConditions)
		        && previousRecord.equals(rule.previousRecord) && actions.equals(rule.actions);
	}
	
	@Override
	public String toString() {
		return "Rule{" + "id=" + id + ", vaccine='" + vaccine + '\'' + ", ageCondition=" + ageCondition
		        + ", specialCondition='" + specialCondition + '\'' + ", medicalConditions='" + medicalConditions + '\''
		        + ", previousRecord='" + previousRecord + '\'' + ", actions=" + actions + '}';
	}
}
