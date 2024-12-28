package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public class DeepDerivedFromFilter extends RuleFilter {
    String derivedId;

    Collection<RuleDescriptor> searchList;

    public DeepDerivedFromFilter(String derivedId, Collection<RuleDescriptor> searchList) {
        this.derivedId = derivedId;
        this.searchList = searchList;
    }

    private Collection<RuleDescriptor> deepSearch(Collection<RuleDescriptor> rules) {
        List<RuleDescriptor> outList = new ArrayList<RuleDescriptor>();
        for (RuleDescriptor rule : rules) {
            Collection<RuleDescriptor> collected = deepSearch(rule);
            outList.addAll(collected);

        }
        return outList;
    }

    private Collection<RuleDescriptor> deepSearch(RuleDescriptor current) {
        List<RuleDescriptor> outList = new ArrayList<RuleDescriptor>();


        while (current != null && current.getDerivedFrom() != null && !current.getDerivedFrom().isEmpty()) {
            if (current.getDerivedFrom().equals(derivedId)) {
                outList.add(current);
            }
            RuleDescriptor finalCurrent = current;
            Optional<RuleDescriptor> found = searchList.stream().filter(e -> e.getId().equals(finalCurrent.getDerivedFrom())).findAny();
            if (found.isPresent()) {
                current = found.get();
            } else {
                break;
            }
        }


        return outList;
    }

    @Override
    public Collection<RuleDescriptor> apply(Collection<RuleDescriptor> rules) {
        return deepSearch(rules);
    }
}
