package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;

/**
 * An abstract class that defines a contract for applying projections on RuleDescriptor objects.
 *
 * A projection allows transforming or selecting specific parts of RuleDescriptor data rather than returning the entire object.
 * Subclasses must implement the `apply` method to define how to project the RuleDescriptors.
 *
 * @param <P> the type of the projected data (e.g., String, Integer, or custom DTOs)
 */
public abstract class RuleProjection<P> {

    /**
     * Applies a projection on a list of RuleDescriptors and returns a list of projected results.
     *
     * @param rules the list of RuleDescriptors to apply the projection to
     * @return a list of projected results of type P
     */
    public abstract List<P> apply(List<RuleDescriptor> rules);
}
