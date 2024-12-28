package org.openmrs.module.cdss.api.data.criteria.filter;


import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;
import java.util.stream.Collectors;

public class SimpleDerivedFromFilter extends RuleFilter {
    String derivedId;

    Collection<RuleDescriptor> searchList;

    public SimpleDerivedFromFilter(String derivedId, boolean deepDerived, Collection<RuleDescriptor> searchList) {
        this.derivedId = derivedId;
        this.searchList = searchList;
    }

    public SimpleDerivedFromFilter(String derivedId) {
        this.derivedId = derivedId;
    }

    @Override
    public Collection<RuleDescriptor> apply(Collection<RuleDescriptor> rules) {
        return rules.stream().filter(e -> e.getDerivedFrom().equals(derivedId)).collect(Collectors.toList());

    }


}
