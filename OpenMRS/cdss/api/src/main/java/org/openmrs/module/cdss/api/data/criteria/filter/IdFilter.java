package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

public class IdFilter extends RuleFilter {
    String id;

    public IdFilter(String id) {
        this.id = id;
    }

    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> e.getId().equals(id)).collect(Collectors.toList());
    }
}
