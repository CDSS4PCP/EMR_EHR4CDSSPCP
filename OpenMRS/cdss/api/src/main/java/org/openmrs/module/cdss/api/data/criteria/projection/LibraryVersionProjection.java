package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;
import java.util.stream.Collectors;

public class LibraryVersionProjection extends RuleProjection<String> {

    @Override
    public Collection<String> apply(Collection<RuleDescriptor> rules) {
        return rules.stream().map(RuleDescriptor::getVersion).collect(Collectors.toList());
    }
}
