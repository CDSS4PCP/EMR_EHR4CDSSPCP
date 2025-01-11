package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that filters rules based on their enabled status.
 */
public class EnabledFilter extends RuleFilter {

    private boolean isEnabled;

    /**
     * Constructs an EnabledFilter with the specified enabled status.
     *
     * @param isEnabled the enabled status to filter rules by
     */
    public EnabledFilter(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    /**
     * Constructs an EnabledFilter that defaults to filtering only enabled rules.
     */
    public EnabledFilter() {
        this.isEnabled = true;
    }

    /**
     * Filters a list of RuleDescriptor objects based on their enabled status.
     *
     * @param rules the list of rules to filter
     * @return a list of rules that match the specified enabled status
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream()
                .filter(e -> e.isEnabled() == isEnabled)
                .collect(Collectors.toList());
    }
}
