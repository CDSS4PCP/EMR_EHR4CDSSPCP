package org.openmrs.module.cdss.data.criteria.filter;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.DeepDerivedFromFilter;
import org.openmrs.module.cdss.api.data.criteria.filter.SimpleDerivedFromFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class SimpleDerivedFromFilterTest {

    @Test
    public void test_filter_returns_matching_derived_rules() {
        String derivedId = "1";
        SimpleDerivedFromFilter filter = new SimpleDerivedFromFilter(derivedId);

        List<RuleDescriptor> rules = new ArrayList<>();
        RuleDescriptor rule1 = new RuleDescriptor("1", "lib1", "1.0", "path1", "path1", RuleRole.RULE);
        rule1.setDerivedFrom(null);
        RuleDescriptor rule2 = new RuleDescriptor("2", "lib2", "1.0", "path2", "path2", RuleRole.RULE);
        rule2.setDerivedFrom("1");
        rules.add(rule1);
        rules.add(rule2);

        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertEquals("1", result.get(0).getDerivedFrom());
        assertEquals("2", result.get(0).getId());
    }


    @Test
    public void test_filter_excludes_deep_derivedId() {
        RuleDescriptor rule1 = new RuleDescriptor("1", "lib1", "v1", "cql1", "elm1", RuleRole.RULE);
        rule1.setDerivedFrom(null);
        RuleDescriptor rule2 = new RuleDescriptor("2", "lib2", "v2", "cql2", "elm2", RuleRole.RULE);
        rule2.setDerivedFrom("1");
        RuleDescriptor rule3 = new RuleDescriptor("3", "lib2", "v2", "cql2", "elm2", RuleRole.RULE);
        rule3.setDerivedFrom("2");
        List<RuleDescriptor> rules = Arrays.asList(rule1, rule2, rule3);

        SimpleDerivedFromFilter filter = new SimpleDerivedFromFilter("1");

        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(1, filteredRules.size());
        assertEquals("1", filteredRules.get(0).getDerivedFrom());
        assertEquals("2", filteredRules.get(0).getId());
    }

    @Test
    public void test_null_rules_list() {
        String derivedId = "rule1";
        SimpleDerivedFromFilter filter = new SimpleDerivedFromFilter(derivedId);

        assertThrows(NullPointerException.class, () -> {
            filter.apply(null);
        });
    }

    @Test
    public void test_handle_empty_list() {

        SimpleDerivedFromFilter filter = new SimpleDerivedFromFilter("parent");
        List<RuleDescriptor> result = filter.apply(new ArrayList<>());

        assertEquals(0, result.size());


    }
}
