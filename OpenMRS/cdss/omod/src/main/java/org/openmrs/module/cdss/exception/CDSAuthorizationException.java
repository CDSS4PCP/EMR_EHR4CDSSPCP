package org.openmrs.module.cdss.exception;

import org.openmrs.api.APIAuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class CDSAuthorizationException extends APIAuthenticationException {
	
	public CDSAuthorizationException() {
	}
	
	public CDSAuthorizationException(String message) {
		super(message);
	}
	
	public CDSAuthorizationException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public CDSAuthorizationException(Throwable cause) {
		super(cause);
	}
}
