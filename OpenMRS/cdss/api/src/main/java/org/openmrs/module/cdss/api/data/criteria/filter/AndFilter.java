package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class AndFilter extends RuleFilter {
    private Collection<RuleFilter> filters = new ArrayList<RuleFilter>();

    public AndFilter(RuleFilter... filters) {
        Collections.addAll(this.filters, filters);
    }

    public AndFilter(Collection<RuleFilter> filters) {
        this.filters = filters;
    }


    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        for (RuleFilter filter : filters) {
            rules = filter.apply(rules);
        }
        return rules;
    }
}
