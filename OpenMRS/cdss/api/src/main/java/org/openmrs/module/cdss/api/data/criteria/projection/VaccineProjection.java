package org.openmrs.module.cdss.api.data.criteria.projection;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

public class VaccineProjection extends RuleProjection<String> {
    /**
     * Applies the projection to a list of RuleDescriptors, extracting only the `id`.
     *
     * @param rules the list of RuleDescriptors to project
     * @return a list of `id` values from the RuleDescriptors
     */
    @Override
    public List<String> apply(List<RuleDescriptor> rules) {
        return rules.stream()
                .map(RuleDescriptor::getVaccine)  // Extract the `id` from each RuleDescriptor
                .collect(Collectors.toList());  // Collect and return as a list
    }
}
