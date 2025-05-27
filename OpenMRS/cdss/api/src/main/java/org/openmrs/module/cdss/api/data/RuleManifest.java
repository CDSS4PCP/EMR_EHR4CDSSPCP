package org.openmrs.module.cdss.api.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import org.apache.log4j.Logger;
import org.openmrs.module.cdss.api.data.criteria.RuleCriteria;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class RuleManifest {

    private final Logger log = Logger.getLogger(getClass());

    @JsonProperty("rules")
    @JsonView({InternalJsonView.class, WebJsonView.class})
    private List<RuleDescriptor> rules = new ArrayList<>();

    @JsonProperty("archivedRules")
    @JsonView({InternalJsonView.class})
    private List<RuleDescriptor> archivedRules = new ArrayList<>();


    public RuleManifest(List<RuleDescriptor> rules) {
        this.rules = rules;
    }

    public RuleManifest(List<RuleDescriptor> rules, List<RuleDescriptor> archivedRules) {
        this.rules = rules;
        this.archivedRules = archivedRules;
    }

    public RuleManifest() {

    }


    @Override
    public String toString() {
        return "RuleManifest{" + "rules=" + rules + '}';
    }


    public List<RuleDescriptor> getRules() {
        return Collections.unmodifiableList(rules);
    }

    public List<RuleDescriptor> getArchivedRules() {
        return Collections.unmodifiableList(archivedRules);
    }

    public RuleDescriptor getRuleById(String libraryName, String version) throws RuleNotFoundException {


        Optional<RuleDescriptor> descriptorOptional = Optional.empty();

        if (version != null)
            descriptorOptional = getRules().stream().filter(e -> e.getLibraryName().equals(libraryName)).filter(e -> e.getVersion().equals(version)).findFirst();
        else descriptorOptional = getRules().stream().filter(e -> e.getLibraryName().equals(libraryName)).findFirst();

        if (!descriptorOptional.isPresent()) {
            throw new RuleNotFoundException(libraryName, version);
        }
        return descriptorOptional.get();


    }


    public RuleDescriptor getRuleById(String ruleId) throws RuleNotFoundException {
        Optional<RuleDescriptor> descriptorOptional = Optional.empty();
        RuleCriteria criteria = new RuleCriteria();
        criteria.setId(ruleId);
        descriptorOptional = getRules().stream().filter(e -> e.getId().equals(criteria.getId())).findFirst();
        if (!descriptorOptional.isPresent()) {
            throw new RuleNotFoundException(ruleId);
        }
        return descriptorOptional.get();
    }

    public RuleDescriptor getArchivedRuleById(String ruleId) throws RuleNotFoundException {
        Optional<RuleDescriptor> descriptorOptional = Optional.empty();
        RuleCriteria criteria = new RuleCriteria();
        criteria.setId(ruleId);
        log.debug("getArchivedRules() =>" + getArchivedRules());
        descriptorOptional = getArchivedRules().stream().filter(e -> e.getId().equals(criteria.getId())).findFirst();
        if (!descriptorOptional.isPresent()) {
            throw new RuleNotFoundException(ruleId);
        }
        return descriptorOptional.get();
    }

    public Boolean addRule(RuleDescriptor descriptor) {
        try {
            RuleDescriptor existingDescriptor = getRuleById(descriptor.getId());
            return false;

        } catch (RuleNotFoundException e) {
            return rules.add(descriptor);
        }
    }


    public Boolean archiveRule(RuleDescriptor descriptor) {
        try {
            RuleDescriptor existingDescriptor = getRuleById(descriptor.getId());

            boolean success = rules.remove(existingDescriptor);

            if (success) {
                success = archivedRules.add(descriptor);
            }
            return success;

        } catch (RuleNotFoundException e) {
            return false;
        }
    }


    public Boolean restoreRule(RuleDescriptor descriptor) {
        log.debug("getArchivedRules() =>" + getArchivedRules());

        try {
            log.debug("Attempt8ing to restore rule " + descriptor.getId());
            RuleDescriptor existingDescriptor = getArchivedRuleById(descriptor.getId());

            boolean success = archivedRules.remove(existingDescriptor);

            if (success) {
                success = rules.add(descriptor);
            }
            return success;

        } catch (RuleNotFoundException e) {
            return false;
        }
    }


}
