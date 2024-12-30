package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

public class LibraryNameVersionProjection extends RuleProjection<String> {
    @Override
    public List<String> apply(List<RuleDescriptor> rules) {
        return rules.stream().map(e -> e.getLibraryName() + "-" + e.getVersion()).collect(Collectors.toList());
    }
}
