package org.openmrs.module.cdss.api.data;

import org.openmrs.module.cdss.api.util.BaseTimeUnit;

public class AgeCondition {
	
	Integer minimumAge;
	
	BaseTimeUnit minimumAgeUnit;
	
	Boolean minimumAgeInclusive;
	
	Integer maximumAge;
	
	BaseTimeUnit maximumAgeUnit;
	
	Boolean maximumAgeInclusive;
	
	public AgeCondition(Integer minimumAge, BaseTimeUnit minimumAgeUnit, Boolean minimumAgeInclusive, Integer maximumAge,
	    BaseTimeUnit maximumAgeUnit, Boolean maximumAgeInclusive) {
		this.minimumAge = minimumAge;
		this.minimumAgeUnit = minimumAgeUnit;
		this.minimumAgeInclusive = minimumAgeInclusive;
		this.maximumAge = maximumAge;
		this.maximumAgeUnit = maximumAgeUnit;
		this.maximumAgeInclusive = maximumAgeInclusive;
	}
	
	public AgeCondition(Integer minimumAge, BaseTimeUnit minimumAgeUnit, Integer maximumAge, BaseTimeUnit maximumAgeUnit) {
		this.minimumAge = minimumAge;
		this.minimumAgeUnit = minimumAgeUnit;
		this.minimumAgeInclusive = true;
		this.maximumAge = maximumAge;
		this.maximumAgeUnit = maximumAgeUnit;
		this.maximumAgeInclusive = true;
	}
	
	public AgeCondition(Integer minimumAge, Integer maximumAge) {
		this.minimumAge = minimumAge;
		this.minimumAgeUnit = BaseTimeUnit.DAY;
		this.minimumAgeInclusive = true;
		this.maximumAge = maximumAge;
		this.maximumAgeUnit = BaseTimeUnit.DAY;
		this.maximumAgeInclusive = true;
	}
	
	public AgeCondition() {
		this.minimumAge = 0;
		this.minimumAgeUnit = BaseTimeUnit.DAY;
		this.minimumAgeInclusive = true;
		this.maximumAge = 999;
		this.maximumAgeUnit = BaseTimeUnit.DAY;
		this.maximumAgeInclusive = true;
	}
	
	public Integer getMinimumAge() {
		return minimumAge;
	}
	
	public void setMinimumAge(Integer minimumAge) {
		this.minimumAge = minimumAge;
	}
	
	public BaseTimeUnit getMinimumAgeUnit() {
		return minimumAgeUnit;
	}
	
	public void setMinimumAgeUnit(BaseTimeUnit minimumAgeUnit) {
		this.minimumAgeUnit = minimumAgeUnit;
	}
	
	public Boolean getMinimumAgeInclusive() {
		return minimumAgeInclusive;
	}
	
	public void setMinimumAgeInclusive(Boolean minimumAgeInclusive) {
		this.minimumAgeInclusive = minimumAgeInclusive;
	}
	
	public Integer getMaximumAge() {
		return maximumAge;
	}
	
	public void setMaximumAge(Integer maximumAge) {
		this.maximumAge = maximumAge;
	}
	
	public BaseTimeUnit getMaximumAgeUnit() {
		return maximumAgeUnit;
	}
	
	public void setMaximumAgeUnit(BaseTimeUnit maximumAgeUnit) {
		this.maximumAgeUnit = maximumAgeUnit;
	}
	
	public Boolean getMaximumAgeInclusive() {
		return maximumAgeInclusive;
	}
	
	public void setMaximumAgeInclusive(Boolean maximumAgeInclusive) {
		this.maximumAgeInclusive = maximumAgeInclusive;
	}
	
	@Override
	public String toString() {
		return "AgeCondition{" + "minimumAge=" + minimumAge + ", minimumAgeUnit=" + minimumAgeUnit
		        + ", minimumAgeInclusive=" + minimumAgeInclusive + ", maximumAge=" + maximumAge + ", maximumAgeUnit="
		        + maximumAgeUnit + ", maximumAgeInclusive=" + maximumAgeInclusive + '}';
	}
}
