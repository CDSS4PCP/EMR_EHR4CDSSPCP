package org.openmrs.module.cdss.api.data.criteria;

import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.*;
import org.openmrs.module.cdss.api.data.criteria.projection.RuleProjection;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents criteria for filtering and projecting rules in the CDSS module.
 */
public class RuleCriteria {
    protected String libraryName;
    protected String libraryVersion;
    protected String id;
    protected String vaccine;
    protected Boolean noVaccine;
    protected RuleRole role;
    protected Boolean enabled;


    public RuleCriteria() {
    }

    /**
     * Parameterized constructor to initialize RuleCriteria with specific values.
     *
     * @param libraryName    the name of the rule library
     * @param libraryVersion the version of the rule library
     * @param id             the unique identifier of the rule
     * @param role           the role associated with the rule
     * @param enabled        the enabled status of the rule
     */
    public RuleCriteria(String libraryName, String libraryVersion, String id, RuleRole role, Boolean enabled) {
        this.libraryName = libraryName;
        this.libraryVersion = libraryVersion;
        this.id = id;
        this.role = role;
        this.enabled = enabled;
    }

    /**
     * Gets the enabled status of the rule.
     *
     * @return true if enabled, false otherwise
     */
    public Boolean getEnabled() {
        return enabled;
    }

    /**
     * Sets the enabled status of the rule.
     *
     * @param enabled the enabled status to set
     * @return the current RuleCriteria instance
     */
    public RuleCriteria setEnabled(Boolean enabled) {
        this.enabled = enabled;
        return this;
    }

    /**
     * Gets the role associated with the rule.
     *
     * @return the rule's role
     */
    public RuleRole getRole() {
        return role;
    }

    /**
     * Sets the role associated with the rule.
     *
     * @param role the role to set
     * @return the current RuleCriteria instance
     */
    public RuleCriteria setRole(RuleRole role) {
        this.role = role;
        return this;
    }

    /**
     * Gets the unique identifier of the rule.
     *
     * @return the rule's ID
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the rule.
     *
     * @param id the ID to set
     * @return the current RuleCriteria instance
     */
    public RuleCriteria setId(String id) {
        this.id = id;
        return this;
    }

    /**
     * Gets the version of the rule library.
     *
     * @return the library version
     */
    public String getLibraryVersion() {
        return libraryVersion;
    }

    /**
     * Sets the version of the rule library.
     *
     * @param libraryVersion the library version to set
     * @return the current RuleCriteria instance
     */
    public RuleCriteria setLibraryVersion(String libraryVersion) {
        this.libraryVersion = libraryVersion;
        return this;
    }

    /**
     * Gets the name of the rule library.
     *
     * @return the library name
     */
    public String getLibraryName() {
        return libraryName;
    }

    /**
     * Sets the name of the rule library.
     *
     * @param libraryName the library name to set
     * @return the current RuleCriteria instance
     */
    public RuleCriteria setLibraryName(String libraryName) {
        this.libraryName = libraryName;
        return this;
    }

    public String getVaccine() {
        return vaccine;
    }

    public RuleCriteria setVaccine(String vaccine) {
        this.vaccine = vaccine;
        return this;
    }

    public Boolean getNoVaccine() {
        return noVaccine;
    }

    public RuleCriteria setNoVaccine(Boolean noVaccine) {
        this.noVaccine = noVaccine;
        return this;
    }

    /**
     * Constructs a list of filters based on the criteria.
     *
     * @return a list of RuleFilter objects
     */
    private List<RuleFilter> getFilters() {
        ArrayList<RuleFilter> filters = new ArrayList<>();
        if (id != null) {
            filters.add(new IdFilter(id));
        }
        if (libraryName != null) {
            filters.add(new LibraryNameFilter(libraryName));
        }
        if (libraryVersion != null) {
            filters.add(new LibraryVersionFilter(libraryVersion));
        }
        if (role != null) {
            filters.add(new RuleRoleFilter(role));
        }
        if (enabled != null) {
            filters.add(new EnabledFilter(enabled));
        }

        if (vaccine != null && (
                noVaccine == null || !noVaccine)) {
            filters.add(new VaccineFilter(vaccine));
        } else if (vaccine == null && noVaccine != null && noVaccine) {
            filters.add(new NoVaccineFilter());
        }
        return filters;
    }

    /**
     * Applies the defined filters to a list of RuleDescriptor objects.
     *
     * @param rules the list of rules to filter
     * @return a filtered list of RuleDescriptor objects
     */
    public List<RuleDescriptor> applyFilters(List<RuleDescriptor> rules) {
        if (rules == null) {
            return new ArrayList<>();
        }
        List<RuleFilter> filterList = getFilters();
        List<RuleDescriptor> filtered = new ArrayList<>(rules);
        for (RuleFilter filter : filterList) {
            filtered = filter.apply(filtered);
        }
        return filtered;
    }

    /**
     * Applies a projection to a list of RuleDescriptor objects.
     *
     * @param rules      the list of rules to project
     * @param projection the projection to apply
     * @param <P>        the type of the projected result
     * @return a list of projected results or null if the rules or projection is null
     */
    public <P> List<P> applyProjection(List<RuleDescriptor> rules, RuleProjection<P> projection) {
        if (rules == null) {
            return null;
        }
        if (projection == null) {
            return null;
        }
        return projection.apply(rules);
    }
}
