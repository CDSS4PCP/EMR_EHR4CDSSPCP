package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

public class LibraryNameFilter extends RuleFilter {
    String libraryName;

    public LibraryNameFilter(String name) {
        libraryName = name;
    }


    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null)
                return libraryName.equals(e.getLibraryName());
            return false;
        }).collect(Collectors.toList());
    }
}
