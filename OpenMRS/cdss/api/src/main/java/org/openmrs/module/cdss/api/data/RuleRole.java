package org.openmrs.module.cdss.api.data;

public enum RuleRole {
    SUPPORT("support"), RULE("rule");

    private String value;

    RuleRole(String r) {
        this.value = r.toLowerCase();
    }
}
