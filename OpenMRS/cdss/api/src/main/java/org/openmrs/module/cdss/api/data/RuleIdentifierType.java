package org.openmrs.module.cdss.api.data;

public enum RuleIdentifierType {
    RULE_ID("rule_id"), LIBRARY_NAME("library_name");

    private String value;

    RuleIdentifierType(String r) {
        this.value = r.toLowerCase();
    }
}
