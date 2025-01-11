package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A projection that extracts only the `libraryName` from a list of RuleDescriptors.
 *
 * This projection transforms a list of RuleDescriptors into a list of strings,
 * each representing the `libraryName` of a RuleDescriptor.
 */
public class LibraryNameProjection extends RuleProjection<String> {

    /**
     * Applies the projection to a list of RuleDescriptors, extracting only the `libraryName`.
     *
     * @param rules the list of RuleDescriptors to project
     * @return a list of `libraryName` values from the RuleDescriptors
     */
    @Override
    public List<String> apply(List<RuleDescriptor> rules) {
        return rules.stream()
                .map(RuleDescriptor::getLibraryName)  // Extract the `libraryName` from each RuleDescriptor
                .collect(Collectors.toList());  // Collect and return as a list
    }
}
