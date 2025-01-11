package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A projection that extracts only the `version` from a list of RuleDescriptors.
 *
 * This projection transforms a list of RuleDescriptors into a list of strings,
 * each representing the `version` of a RuleDescriptor.
 */
public class LibraryVersionProjection extends RuleProjection<String> {

    /**
     * Applies the projection to a list of RuleDescriptors, extracting only the `version`.
     *
     * @param rules the list of RuleDescriptors to project
     * @return a list of `version` values from the RuleDescriptors
     */
    @Override
    public List<String> apply(List<RuleDescriptor> rules) {
        return rules.stream()
                .map(RuleDescriptor::getVersion)  // Extract the `version` from each RuleDescriptor
                .collect(Collectors.toList());  // Collect and return as a list
    }
}
