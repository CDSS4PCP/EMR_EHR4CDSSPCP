package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class LibraryNameLatestVersionFilter extends RuleFilter {

    LibraryNameFilter nameFilter;

    public LibraryNameLatestVersionFilter(String name) {
        nameFilter = new LibraryNameFilter(name);

    }

    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        List<RuleDescriptor> newList = nameFilter.apply(rules);
        if (newList.size() <= 1) {
            return newList;
        }

        String greatestLexographicalVersion = "";
        RuleDescriptor latestVersion = null;

        for (RuleDescriptor rule : newList) {
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
