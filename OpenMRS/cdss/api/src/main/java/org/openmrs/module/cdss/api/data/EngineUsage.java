package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.joda.time.DateTime;
import org.openmrs.BaseOpenmrsData;
import org.openmrs.Patient;

import javax.persistence.*;
import java.time.ZonedDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "cdss_usage")
//@Table(name = "cdss_usage")
public class EngineUsage extends BaseOpenmrsData {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "cdss_usage_id")
	private Integer id;
	
	@Override
	public Integer getId() {
		return id;
	}
	
	@Override
	public void setId(Integer id) {
		this.id = id;
	}
	
	//	@Override
	//	public String getUuid() {
	//		return super.getUuid();
	//	}
	//
	//	@Override
	//	public void setUuid(String uuid) {
	//		super.setUuid(uuid);
	//	}
	//
	@Column(name = "cdss_usage_vaccine", nullable = false)
	private String vaccine;
	
	@Column(name = "cdss_usage_patient", nullable = false)
	@JoinColumn(name = "patient_id")
	private Patient patient;
	
	@Column(name = "cdss_usage_date", nullable = false)
	private DateTime timestamp;
	
	@Override
	public String toString() {
		return "EngineUsage{" + "id=" + id + ", vaccine='" + vaccine + '\'' + ", patient=" + patient + ", timestamp="
		        + timestamp + '}';
	}
}
