package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that selects RuleDescriptor objects associated with a specific vaccine.
 */

public class VaccineFilter extends RuleFilter {
    private String vaccine;

    /**
     * Constructs a VaccineFilter for the specified vaccine.
     *
     * @param vaccine the name of the vaccine to filter by
     */
    public VaccineFilter(String vaccine) {
        if (vaccine == null)
            throw new IllegalArgumentException("Vaccine cannot be null in VaccineFilter. Use NoVaccineFilter instead.");
        this.vaccine = vaccine;
    }

    /**
     * Filters the provided list of RuleDescriptor objects, returning only those
     * associated with the vaccine specified for this VaccineFilter.
     *
     * @param rules the list of RuleDescriptor objects to filter
     * @return a list of RuleDescriptor objects matching the specified vaccine
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {

        return rules.stream().filter(e -> {

            if (e != null && e.getVaccine() != null) {
                return e.getVaccine().equals(vaccine);
            }
            return false;
        }).collect(Collectors.toList());
    }
}
