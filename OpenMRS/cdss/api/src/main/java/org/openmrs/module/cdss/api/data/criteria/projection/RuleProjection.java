package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.Collection;
import java.util.List;

public abstract class RuleProjection<P> {
    public abstract List<P> apply(List<RuleDescriptor> rules);

}
