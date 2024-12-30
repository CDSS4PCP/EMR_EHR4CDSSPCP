package org.openmrs.module.cdss.api.data.criteria;

import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.*;
import org.openmrs.module.cdss.api.data.criteria.projection.RuleProjection;

import java.util.ArrayList;
import java.util.List;


public class RuleCriteria {
    protected String libraryName;
    protected String libraryVersion;
    protected String id;
    protected RuleRole role;
    protected Boolean enabled;


    public RuleCriteria() {
    }

    public RuleCriteria(String libraryName, String libraryVersion, String id, RuleRole role, Boolean enabled) {
        this.libraryName = libraryName;
        this.libraryVersion = libraryVersion;
        this.id = id;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public RuleCriteria setEnabled(Boolean enabled) {
        this.enabled = enabled;
        return this;

    }

    public RuleRole getRole() {
        return role;
    }

    public RuleCriteria setRole(RuleRole role) {
        this.role = role;
        return this;

    }

    public String getId() {
        return id;
    }

    public RuleCriteria setId(String id) {
        this.id = id;
        return this;

    }

    public String getLibraryVersion() {
        return libraryVersion;
    }

    public RuleCriteria setLibraryVersion(String libraryVersion) {
        this.libraryVersion = libraryVersion;
        return this;
    }

    public String getLibraryName() {
        return libraryName;
    }

    public RuleCriteria setLibraryName(String libraryName) {
        this.libraryName = libraryName;
        return this;

    }

    private List<RuleFilter> getFilters() {
        ArrayList<RuleFilter> filters = new ArrayList<RuleFilter>();

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
        return filters;
    }


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
