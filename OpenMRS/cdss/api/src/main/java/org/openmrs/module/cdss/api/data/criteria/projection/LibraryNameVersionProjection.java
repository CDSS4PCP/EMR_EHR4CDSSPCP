package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A projection that combines the `libraryName` and `version` from a list of RuleDescriptors
 * into a single string in the format "libraryName-version".
 *
 * This projection transforms each RuleDescriptor into a string representing its library name and version.
 */
public class LibraryNameVersionProjection extends RuleProjection<String> {

    /**
     * Applies the projection to a list of RuleDescriptors, combining the `libraryName` and `version`.
     *
     * @param rules the list of RuleDescriptors to project
     * @return a list of strings, each in the format "libraryName-version"
     */
    @Override
    public List<String> apply(List<RuleDescriptor> rules) {
        return rules.stream()
                .map(e -> e.getLibraryName() + "-" + e.getVersion())  // Combine libraryName and version
                .collect(Collectors.toList());  // Collect and return as a list of strings
    }
}
