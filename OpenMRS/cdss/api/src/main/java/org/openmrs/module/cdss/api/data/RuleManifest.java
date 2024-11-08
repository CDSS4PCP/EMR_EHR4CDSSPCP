package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RuleManifest {


    @JsonProperty("rules")

    private List<RuleDescriptor> rules = new ArrayList<>();

    public RuleManifest(List<RuleDescriptor> rules) {
        this.rules = rules;

    }

    public RuleManifest() {

    }


    @Override
    public String toString() {
        return "RuleManifest{" +
                "rules=" + rules +
                '}';
    }


    public List<RuleDescriptor> getRules() {
        return Collections.unmodifiableList(rules);
    }

    public RuleDescriptor getRule(String id, String version) {
        if (version == null) {
            return getRule(id);
        }
        for (RuleDescriptor rule : rules) {

            if (rule.getId().equals(id) && rule.getVersion().equals(version)) {
                return rule;
            }
        }
        return null;
    }

    public RuleDescriptor getRule(String id) {
        for (RuleDescriptor rule : rules) {

            if (rule.getId().equals(id)) {
                return rule;
            }
        }
        return null;
    }

    public Boolean addRule(RuleDescriptor descriptor) {
        RuleDescriptor existingDescriptor = getRule(descriptor.getId(), descriptor.getVersion());
        if (existingDescriptor != null) {
            return false;
        }
        return rules.add(descriptor);


    }


}
