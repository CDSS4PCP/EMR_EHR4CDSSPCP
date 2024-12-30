package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class LibraryVersionFilter extends RuleFilter {
    String libraryVersion;

    public LibraryVersionFilter(String version) {
        libraryVersion = version;
    }

    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> e.getVersion().equals(libraryVersion)).collect(Collectors.toList());
    }
}
