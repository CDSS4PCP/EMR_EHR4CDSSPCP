package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that filters rules based on their unique identifier (ID).
 */
public class IdFilter extends RuleFilter {
    private String id;

    /**
     * Constructs an IdFilter with the specified ID.
     *
     * @param id the ID to filter rules by
     */
    public IdFilter(String id) {
        this.id = id;
    }

    /**
     * Filters a list of RuleDescriptor objects based on the specified ID.
     *
     * @param rules the list of rules to filter
     * @return a list of rules that match the specified ID
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null) {
                return id.equals(e.getId());
            }
            return false;
        }).collect(Collectors.toList());
    }
}
