package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that filters rules based on whether they are directly derived from a specified rule ID.
 */
public class SimpleDerivedFromFilter extends RuleFilter {
    private String derivedId;

    /**
     * Constructs a SimpleDerivedFromFilter with the specified derived rule ID.
     *
     * @param derivedId the ID of the rule from which other rules are derived
     */
    public SimpleDerivedFromFilter(String derivedId) {
        this.derivedId = derivedId;
    }

    /**
     * Filters a list of RuleDescriptor objects to find all rules that are directly derived from the specified `derivedId`.
     *
     * @param rules the list of rules to filter
     * @return a list of rules that are directly derived from the specified `derivedId`
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null) {
                return derivedId.equals(e.getDerivedFrom());
            }
            return false;
        }).collect(Collectors.toList());
    }
}
