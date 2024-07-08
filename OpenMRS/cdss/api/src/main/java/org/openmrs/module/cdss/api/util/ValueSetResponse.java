package org.openmrs.module.cdss.api.util;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * The ValueSetResponse class represents a response object containing a status code and content for
 * value set retrieval. It is used in the context of a CDSS (Clinical Decision Support System)
 * module in OpenMRS.
 */
@Data
@AllArgsConstructor
public class ValueSetResponse {
	
	Integer status;
	
	String content;
}
