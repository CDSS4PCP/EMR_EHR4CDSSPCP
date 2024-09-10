package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.openmrs.OpenmrsObject;
import org.openmrs.Patient;
import org.openmrs.module.cdss.api.serialization.CdssUsageSerializer;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a CdssUsage entity that stores information about the usage of a Clinical Decision
 * Support System (CDSS). This entity includes details such as the vaccine used, patient ID,
 * timestamp of the usage, rules applied, recommendations given, status of the usage, and a unique
 * identifier (UUID). The CdssUsage entity can have multiple recommendations associated with it, up
 * to a maximum of six.
 */
@Data
@Entity(name = "cdss_usage")
@JsonSerialize(using = CdssUsageSerializer.class)
@NoArgsConstructor
public class CdssUsage implements OpenmrsObject {
	
	public CdssUsage(String vaccine, String patientId, String rule, LocalDateTime timestamp, String recommendation1,
	    String status) {
		this.vaccine = vaccine;
		this.patientId = patientId;
		this.timestamp = timestamp;
		this.recommendation1 = recommendation1;
		this.rule = rule;
		this.status = status;
	}
	
	public CdssUsage(String vaccine, String patientId, LocalDateTime timestamp, String rule, String recommendation1,
	    String recommendation2, String recommendation3, String recommendation4, String recommendation5,
	    String recommendation6, String status) {
		this.vaccine = vaccine;
		this.patientId = patientId;
		this.timestamp = timestamp;
		this.rule = rule;
		this.recommendation1 = recommendation1;
		this.recommendation2 = recommendation2;
		this.recommendation3 = recommendation3;
		this.recommendation4 = recommendation4;
		this.recommendation5 = recommendation5;
		this.recommendation6 = recommendation6;
		this.status = status;
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
	
	@Column(name = "cdss_usage_recommendation1", nullable = true)
	private String recommendation1;
	
	@Column(name = "cdss_usage_recommendation2", nullable = true)
	private String recommendation2;
	
	@Column(name = "cdss_usage_recommendation3", nullable = true)
	private String recommendation3;
	
	@Column(name = "cdss_usage_recommendation4", nullable = true)
	private String recommendation4;
	
	@Column(name = "cdss_usage_recommendation5", nullable = true)
	private String recommendation5;
	
	@Column(name = "cdss_usage_recommendation6", nullable = true)
	private String recommendation6;
	
	@Column(name = "uuid", nullable = true)
	String uuid;
	
	//	@Enumerated(EnumType.STRING)
	@Column(name = "cdss_usage_status", nullable = false, columnDefinition = "VARCHAR(8)")
	private String status;
	
	@Override
	public String getUuid() {
		return uuid;
	}
	
	@Override
	public void setUuid(String s) {
		uuid = s;
	}
}
