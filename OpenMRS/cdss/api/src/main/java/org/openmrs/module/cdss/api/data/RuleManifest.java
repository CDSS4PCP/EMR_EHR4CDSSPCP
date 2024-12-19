package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.log4j.Logger;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class RuleManifest {

    private final Logger log = Logger.getLogger(getClass());

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

    public RuleDescriptor getRule(String libraryName, String version) throws RuleNotFoundException {


        Optional<RuleDescriptor> descriptorOptional = Optional.empty();

        if (version != null)
            descriptorOptional = getRules().stream().filter(e -> e.getLibraryName().equals(libraryName)).filter(e -> e.getVersion().equals(version)).findFirst();
        else
            descriptorOptional = getRules().stream().filter(e -> e.getLibraryName().equals(libraryName)).findFirst();

        if (!descriptorOptional.isPresent()) {
            throw new RuleNotFoundException(libraryName, version);
        }
        return descriptorOptional.get();


    }


    public RuleDescriptor getRule(String ruleId, RuleIdentifierType identifierType) throws RuleNotFoundException {
        Optional<RuleDescriptor> descriptorOptional = Optional.empty();
        if (identifierType == RuleIdentifierType.RULE_ID) {
            descriptorOptional = getRules().stream().filter(e -> e.getId().equals(ruleId)).findFirst();
        } else if (identifierType == RuleIdentifierType.LIBRARY_NAME) {
            descriptorOptional = getRules().stream().filter(e -> e.getLibraryName().equals(ruleId)).findFirst();
        }
        if (!descriptorOptional.isPresent()) {
            throw new RuleNotFoundException(ruleId);
        }
        return descriptorOptional.get();
    }

    public Boolean addRule(RuleDescriptor descriptor) {
        try {
            RuleDescriptor existingDescriptor1 = getRule(descriptor.getId(), RuleIdentifierType.RULE_ID);

            log.debug("existingDescriptor1: " + existingDescriptor1);

            return false;

        } catch (RuleNotFoundException e) {
            return rules.add(descriptor);
        }


    }


}
