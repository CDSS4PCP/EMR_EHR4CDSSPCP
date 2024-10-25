package org.openmrs.module.cdss.api.exception;

public class RuleNotEnabledException extends RuntimeException {
    public RuleNotEnabledException(String ruleId) {
        super(ruleId + " is not enabled! Enable it first before requesting " + ruleId);
    }
}
