package org.openmrs.module.cdss.api.data.criteria.filter;


import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

public class SimpleDerivedFromFilter extends RuleFilter {
    String derivedId;


    public SimpleDerivedFromFilter(String derivedId) {
        this.derivedId = derivedId;
    }

    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null)
                return derivedId.equals(e.getDerivedFrom());
            return false;
        }).collect(Collectors.toList());

    }


}
