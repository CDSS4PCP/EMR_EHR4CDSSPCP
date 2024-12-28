package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;
import java.util.stream.Collectors;

public class EnabledFilter extends RuleFilter {

    boolean isEnabled;

    public EnabledFilter(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }
    public EnabledFilter() {
        this.isEnabled = true;
    }

    @Override
    public Collection<RuleDescriptor> apply(Collection<RuleDescriptor> rules) {
        return rules.stream().filter(e -> e.isEnabled() == isEnabled).collect(Collectors.toList());
    }
}
