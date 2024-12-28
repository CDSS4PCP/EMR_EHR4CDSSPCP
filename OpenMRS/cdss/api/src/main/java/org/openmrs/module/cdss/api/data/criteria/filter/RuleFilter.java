package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;

public abstract class RuleFilter {

    public abstract Collection<RuleDescriptor> apply(Collection<RuleDescriptor> rules);
}
