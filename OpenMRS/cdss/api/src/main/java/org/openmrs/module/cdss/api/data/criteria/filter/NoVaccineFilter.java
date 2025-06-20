package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that selects RuleDescriptor objects associated without any specific vaccine.
 */
public class NoVaccineFilter extends RuleFilter {

    /**
     * Constructs a NoVaccineFilter.
     */
    public NoVaccineFilter() {

    }

    /**
     * A RuleFilter implementation that filters RuleDescriptor objects to include only those
     * without an associated vaccine.
     * <p>
     * This filter returns rules where the vaccine property is null.
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null) {
                return e.getVaccine() == null;
            }
            return false;
        }).collect(Collectors.toList());
    }
}
