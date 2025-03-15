package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that filters rules based on their library version.
 */
public class LibraryVersionFilter extends RuleFilter {
    private String libraryVersion;

    /**
     * Constructs a LibraryVersionFilter with the specified library version.
     *
     * @param version the library version to filter rules by
     */
    public LibraryVersionFilter(String version) {
        this.libraryVersion = version;
    }

    /**
     * Filters a list of RuleDescriptor objects based on the specified library version.
     *
     * @param rules the list of rules to filter
     * @return a list of rules that match the specified library version
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null) {
                return e.getVersion().equals(libraryVersion);
            }
            return false;
        }).collect(Collectors.toList());
    }
}
