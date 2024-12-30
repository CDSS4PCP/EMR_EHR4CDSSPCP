package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;

public abstract class RuleFilter {

    public abstract List<RuleDescriptor> apply(List<RuleDescriptor> rules);
}
