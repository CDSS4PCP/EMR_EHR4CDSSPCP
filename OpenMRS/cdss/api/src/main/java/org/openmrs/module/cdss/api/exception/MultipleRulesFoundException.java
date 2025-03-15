package org.openmrs.module.cdss.api.exception;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;

public class MultipleRulesFoundException extends RuntimeException {
    public MultipleRulesFoundException(List<RuleDescriptor> rules) {
        super("Multiple rules found but only one was expected: " + rules.toString());
    }
}
