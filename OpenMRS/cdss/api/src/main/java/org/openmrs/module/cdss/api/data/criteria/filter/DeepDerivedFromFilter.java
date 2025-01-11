package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * A filter that identifies rules derived (directly or indirectly) from a specified rule ID.
 */
public class DeepDerivedFromFilter extends RuleFilter {
    private String derivedId;

    /**
     * Constructs a DeepDerivedFromFilter with the specified rule ID to search for derivation.
     *
     * @param derivedId the ID of the rule from which other rules may be derived
     */
    public DeepDerivedFromFilter(String derivedId) {
        this.derivedId = derivedId;
    }

    /**
     * Performs a deep search on the provided list of rules to identify all rules derived
     * directly or indirectly from the specified `derivedId`.
     *
     * @param rules the list of rules to search
     * @return a list of rules derived from the specified `derivedId`
     */
    private List<RuleDescriptor> deepSearch(List<RuleDescriptor> rules) {
        List<RuleDescriptor> outList = new ArrayList<>();
        for (RuleDescriptor rule : rules) {
            List<RuleDescriptor> collected = deepSearch(rule, rules);
            outList.addAll(collected);
        }
        return outList;
    }

    /**
     * Recursively searches the lineage of a rule to determine if it is derived from
     * the specified `derivedId`.
     *
     * @param current the current rule being analyzed
     * @param rules   the list of all rules available for reference
     * @return a list of rules (if any) derived from the specified `derivedId`
     */
    private List<RuleDescriptor> deepSearch(RuleDescriptor current, List<RuleDescriptor> rules) {
        RuleDescriptor originalCurrent = current;
        List<RuleDescriptor> outList = new ArrayList<>();

        while (current != null && current.getDerivedFrom() != null && !current.getDerivedFrom().isEmpty()) {
            if (current.getDerivedFrom().equals(derivedId)) {
                outList.add(originalCurrent);
            }
            RuleDescriptor finalCurrent = current;
            Optional<RuleDescriptor> found = rules.stream()
                    .filter(e -> e.getId().equals(finalCurrent.getDerivedFrom()))
                    .findAny();
            if (found.isPresent()) {
                current = found.get();
            } else {
                break;
            }
        }

        return outList;
    }

    /**
     * Applies the filter to a list of rules to identify all rules derived from the specified `derivedId`.
     *
     * @param rules the list of rules to filter
     * @return a list of rules derived from the specified `derivedId`
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return deepSearch(rules);
    }
}
