package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

public class LibraryNameLatestVersionFilter extends RuleFilter {

    LibraryNameFilter nameFilter;

    public LibraryNameLatestVersionFilter(String name) {
        nameFilter = new LibraryNameFilter(name);

    }

    @Override
    public Collection<RuleDescriptor> apply(Collection<RuleDescriptor> rules) {
        Collection<RuleDescriptor> newCollection = nameFilter.apply(rules);
        if (newCollection.size() <= 1) {
            return newCollection;
        }

        String greatestLexographicalVersion = "";
        RuleDescriptor latestVersion = null;

        for (RuleDescriptor rule : newCollection) {
            if (rule.getVersion().compareTo(greatestLexographicalVersion) > 0) {
                latestVersion = rule;
                greatestLexographicalVersion = rule.getVersion();
            }
        }

        if (latestVersion == null) {
            return new ArrayList<>();
        }
        return Collections.singletonList(latestVersion);
    }
}
