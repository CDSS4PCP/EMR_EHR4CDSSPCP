package org.openmrs.module.cdss.api.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValueSetResponse {
	
	Integer status;
	
	String content;
}
