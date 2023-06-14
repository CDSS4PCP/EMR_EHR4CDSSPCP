package org.openmrs.module.cdss.api.data;

public class SpecialCondition {
	
	private Integer id;
	
	private String label;
	
	private Boolean collegeStudent;
	
	private Boolean militaryWorker;
	
	private Boolean travel;
	
	public SpecialCondition(String label) {
		this.label = label;
		
		setCollegeStudent(false);
		setMilitaryWorker(false);
		setTravel(false);
	}
	
	public SpecialCondition(String label, Boolean collegeStudent, Boolean militaryWorker, Boolean travel) {
		this.label = label;
		this.collegeStudent = collegeStudent;
		this.militaryWorker = militaryWorker;
		this.travel = travel;
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getLabel() {
		return label;
	}
	
	public void setLabel(String label) {
		this.label = label;
	}
	
	public Boolean getCollegeStudent() {
		return collegeStudent;
	}
	
	public void setCollegeStudent(Boolean collegeStudent) {
		this.collegeStudent = collegeStudent;
	}
	
	public Boolean getMilitaryWorker() {
		return militaryWorker;
	}
	
	public void setMilitaryWorker(Boolean militaryWorker) {
		this.militaryWorker = militaryWorker;
	}
	
	public Boolean getTravel() {
		return travel;
	}
	
	public void setTravel(Boolean travel) {
		this.travel = travel;
	}
	
	@Override
	public String toString() {
		return "SpecialCondition{" + "id=" + id + ", label='" + label + '\'' + ", collegeStudent=" + collegeStudent
		        + ", militaryWorker=" + militaryWorker + ", travel=" + travel + '}';
	}
}
