package org.openmrs.module.cdss.api.data.criteria.filter;

import org.apache.maven.artifact.versioning.ComparableVersion;
import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A filter that filters rules by library name and selects only the latest version based on lexicographical order.
 */
public class LibraryNameLatestVersionFilter extends RuleFilter {

    private LibraryNameFilter nameFilter;

    /**
     * Constructs a LibraryNameLatestVersionFilter with the specified library name.
     *
     * @param name the library name to filter rules by
     */
    public LibraryNameLatestVersionFilter(String name) {
        nameFilter = new LibraryNameFilter(name);
    }

    /**
     * Filters a list of RuleDescriptor objects by library name and returns only the rule with the latest version.
     *
     * @param rules the list of rules to filter
     * @return a list containing only the latest version of the rule, or an empty list if no match is found
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {


        List<RuleDescriptor> newList = nameFilter.apply(rules);
        if (newList.size() <= 1) {
            return newList;
        }


        ComparableVersion latestVersion = null;
        RuleDescriptor latestDescriptor = null;

        for (RuleDescriptor rule : newList) {
            if (rule.getVersion() == null) {
                continue;
            }
            if (latestVersion == null && rule.getVersion() != null) {
                latestVersion = new ComparableVersion(rule.getVersion());
                latestDescriptor = rule;
            }
            ComparableVersion newVersion = new ComparableVersion(rule.getVersion());
            if (newVersion.compareTo(latestVersion) > 0) {
                latestVersion = newVersion;
                latestDescriptor = rule;
            }
        }

        if (latestVersion == null) {
            return new ArrayList<>();
        }
        return Collections.singletonList(latestDescriptor);
    }
}
