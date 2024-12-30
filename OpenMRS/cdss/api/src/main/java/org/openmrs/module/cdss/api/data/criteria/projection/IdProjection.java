package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

public class IdProjection extends RuleProjection<String>{

    @Override
    public List<String> apply(List<RuleDescriptor> rules) {
        return rules.stream().map(RuleDescriptor::getId).collect(Collectors.toList());
    }
}
