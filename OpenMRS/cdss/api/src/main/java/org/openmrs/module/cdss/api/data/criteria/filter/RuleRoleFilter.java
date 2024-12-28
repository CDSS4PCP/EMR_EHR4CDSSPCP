package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;

import java.util.Collection;
import java.util.stream.Collectors;

public class RuleRoleFilter extends RuleFilter{
    RuleRole role;
    public RuleRoleFilter(RuleRole role) {
        this.role = role;
    }


    @Override
    public Collection<RuleDescriptor> apply(Collection<RuleDescriptor> rules) {
        return rules.stream().filter(e -> e.getRole().equals(role)).collect(Collectors.toList());
    }
}
