package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that filters rules based on their library name.
 */
public class LibraryNameFilter extends RuleFilter {
    private String libraryName;

    /**
     * Constructs a LibraryNameFilter with the specified library name.
     *
     * @param name the library name to filter rules by
     */
    public LibraryNameFilter(String name) {
        this.libraryName = name;
    }

    /**
     * Filters a list of RuleDescriptor objects based on the specified library name.
     *
     * @param rules the list of rules to filter
     * @return a list of rules that match the specified library name
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null) {
                return libraryName.equals(e.getLibraryName());
            }
            return false;
        }).collect(Collectors.toList());
    }
}
