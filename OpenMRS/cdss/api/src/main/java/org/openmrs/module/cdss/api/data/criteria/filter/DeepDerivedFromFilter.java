package org.openmrs.module.cdss.api.data.criteria.filter;

import org.openmrs.module.cdss.api.data.RuleDescriptor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DeepDerivedFromFilter extends RuleFilter {
    String derivedId;


    public DeepDerivedFromFilter(String derivedId) {
        this.derivedId = derivedId;
    }

    private List<RuleDescriptor> deepSearch(List<RuleDescriptor> rules) {
        List<RuleDescriptor> outList = new ArrayList<RuleDescriptor>();
        for (RuleDescriptor rule : rules) {
            List<RuleDescriptor> collected = deepSearch(rule, rules);
            outList.addAll(collected);

        }
        return outList;
    }

    private List<RuleDescriptor> deepSearch(RuleDescriptor current, List<RuleDescriptor> rules) {
        RuleDescriptor originalCurrent = current;

        List<RuleDescriptor> outList = new ArrayList<RuleDescriptor>();


        while (current != null && current.getDerivedFrom() != null && !current.getDerivedFrom().isEmpty()) {
            if (current.getDerivedFrom().equals(derivedId)) {
                outList.add(originalCurrent);
            }
            RuleDescriptor finalCurrent = current;
            Optional<RuleDescriptor> found = rules.stream().filter(e -> e.getId().equals(finalCurrent.getDerivedFrom())).findAny();
            if (found.isPresent()) {
                current = found.get();
            } else {
                break;
            }
        }


        return outList;
    }

    @Override
    public List<RuleDescriptor> apply(List<RuleDescriptor> rules) {
        return deepSearch(rules);
    }
}
