package org.openmrs.module.cdss.web.controller;

import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.context.Context;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.CDSSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.ExceptionHandler;

public abstract class CdssRestController {
//    @Autowired
    protected CDSSService cdssService;

    protected void checkAuthorizationAndPrivilege() {
        if (!Context.isAuthenticated()) {
            throw new APIAuthenticationException("User is not authenticated. Log in first.");

        }
        if (!Context.hasPrivilege(CDSSConfig.MODULE_PRIVILEGE)) {
            throw new APIAuthenticationException(String.format("User does not have privilege '%s'", CDSSConfig.MODULE_PRIVILEGE));
        }
    }

    /**
     * Handles APIAuthenticationException by creating a ResponseEntity with the exception details.
     *
     * @param error the APIAuthenticationException to handle
     * @return ResponseEntity<Throwable> containing the exception details in JSON format
     */
    @ExceptionHandler({APIAuthenticationException.class})
    protected ResponseEntity<Throwable> handleApiAuthException(APIAuthenticationException error) {
        MultiValueMap<String, String> headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Send error stacktrace as json
        ResponseEntity<Throwable> response = new ResponseEntity<>(error, headers, HttpStatus.UNAUTHORIZED);
        return response;
    }
}
