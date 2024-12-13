package org.openmrs.module.cdss.api.exception;

import java.io.IOException;

public class RuleNotFoundException extends IOException {

    public RuleNotFoundException(String ruleId, String path) {
        super(ruleId + " is not found in path " + path);
    }

    public RuleNotFoundException(String ruleId) {
        super(ruleId + " is not found ");
    }
}
