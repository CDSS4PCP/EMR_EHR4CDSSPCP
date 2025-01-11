package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A filter that filters rules based on their associated role.
 */
public class RuleRoleFilter extends RuleFilter {
    private RuleRole role;

    /**
     * Constructs a RuleRoleFilter with the specified role.
     *
     * @param role the role to filter rules by
     */
    public RuleRoleFilter(RuleRole role) {
        this.role = role;
    }

    /**
     * Filters a list of RuleDescriptor objects based on the specified role.
     *
     * @param rules the list of rules to filter
     * @return a list of rules that match the specified role
     */
    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return rules.stream().filter(e -> {
            if (e != null) {
                return e.getRole().equals(role);
            }
            return false;
        }).collect(Collectors.toList());
    }
}
