package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;

public abstract class RuleProjection<P> {
    public abstract Collection<P> apply(Collection<RuleDescriptor> rules);

}
