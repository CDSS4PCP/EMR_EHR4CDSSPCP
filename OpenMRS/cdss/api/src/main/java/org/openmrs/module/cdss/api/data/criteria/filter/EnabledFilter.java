package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;
import java.util.List;
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
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> e.isEnabled() == isEnabled).collect(Collectors.toList());
    }
}
