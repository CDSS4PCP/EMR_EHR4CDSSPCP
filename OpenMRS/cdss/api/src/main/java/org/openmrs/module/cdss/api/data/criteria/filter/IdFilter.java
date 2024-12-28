package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;
import java.util.stream.Collectors;

public class IdFilter extends RuleFilter {
    String id;

    public IdFilter(String id) {
        this.id = id;
    }

    @Override
    public Collection<RuleDescriptor> apply(Collection<RuleDescriptor> rules) {
        return rules.stream().filter(e -> e.getId().equals(id)).collect(Collectors.toList());
    }
}
