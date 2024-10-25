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


}
