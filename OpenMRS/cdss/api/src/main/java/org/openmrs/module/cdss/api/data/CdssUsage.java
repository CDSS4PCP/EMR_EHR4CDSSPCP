package org.openmrs.module.cdss.api.data;

import lombok.Data;
import org.openmrs.OpenmrsObject;
import org.openmrs.Patient;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity(name = "cdss_usage")
public class CdssUsage implements OpenmrsObject {
	
	public CdssUsage(Integer id, String vaccine, Patient patient, LocalDateTime timestamp) {
		this.id = id;
		this.vaccine = vaccine;
		this.patientId = patient.getUuid();
		this.timestamp = timestamp;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "cdss_usage_id")
	private Integer id;
	
	@Column(name = "cdss_usage_vaccine", nullable = false)
	private String vaccine;
	
	@Column(name = "cdss_usage_patient", nullable = false, insertable = false, updatable = false)
	private String patientId;
	
	@Version
	@Column(name = "cdss_usage_date", nullable = false)
	private LocalDateTime timestamp;
	
	@Column(name = "cdss_usage_rule", nullable = false)
	private String rule;
	
	@Column(name = "cdss_usage_recommendation", nullable = false)
	private String recommendation;
	
	@Column(name = "uuid", nullable = true)
	String uuid;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "cdss_usage_status", nullable = false, columnDefinition = "VARCHAR(8)")
	private String status;
	
	public CdssUsage() {
		
	}
	
	@Override
	public String toString() {
		return "CdssUsage{" + "id=" + id + ", vaccine='" + vaccine + '\'' + ", patientId='" + patientId + '\''
		        + ", timestamp=" + timestamp + ", rule='" + rule + '\'' + ", recommendation='" + recommendation + '\''
		        + ", uuid='" + uuid + '\'' + ", status=" + status + '}';
	}
	
	@Override
	public String getUuid() {
		return uuid;
	}
	
	@Override
	public void setUuid(String s) {
		uuid = s;
	}
}
