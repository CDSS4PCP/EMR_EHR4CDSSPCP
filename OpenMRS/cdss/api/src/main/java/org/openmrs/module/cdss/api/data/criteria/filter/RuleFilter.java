package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;

/**
 * Abstract class representing a filter for rules.
 * Subclasses must implement the {@code apply} method to define specific filtering logic.
 */
public abstract class RuleFilter {

    /**
     * Applies the filter to a list of RuleDescriptor objects.
     *
     * @param rules the list of rules to filter
     * @return a filtered list of RuleDescriptor objects
     */
    public abstract List<RuleDescriptor> apply(List<RuleDescriptor> rules);
}
