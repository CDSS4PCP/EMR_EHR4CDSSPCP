package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class RuleManifest {


    @JsonProperty("rules")
    @Getter
    @Setter
    private List<RuleDescriptor> rules = new ArrayList<>();

    private RuleManifest(List<RuleDescriptor> rules) {
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
}
