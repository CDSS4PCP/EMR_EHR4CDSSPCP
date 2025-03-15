package org.openmrs.module.cdss.data.criteria.filter;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.LibraryVersionFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;

public class LibraryVersionFilterTest {


    // Filter returns rules matching exact library version
    @Test
    public void test_filter_matches_exact_version() {
        String version = "1.0";
        LibraryVersionFilter filter = new LibraryVersionFilter(version);

        RuleDescriptor rule = new RuleDescriptor("id1", "lib1", "1.0", "path1.cql", "path1.elm", RuleRole.RULE);
        List<RuleDescriptor> rules = Arrays.asList(rule);

        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertEquals(version, result.get(0).getVersion());
    }

    @Test
    public void test_filter_with_multiple_rules_same_version() {
        List<RuleDescriptor> rules = Arrays.asList(
                new RuleDescriptor("1", "LibraryA", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE),
                new RuleDescriptor("2", "LibraryB", "1.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE),
                new RuleDescriptor("3", "LibraryC", "2.0", "path/to/cql3", "path/to/elm3", RuleRole.RULE)
        );

        LibraryVersionFilter filter = new LibraryVersionFilter("1.0");
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(2, filteredRules.size());
        assertTrue(filteredRules.stream().allMatch(rule -> rule.getVersion().equals("1.0")));
    }

    @Test
    public void test_empty_result_when_no_rules_match_version() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "LibraryA", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "LibraryB", "2.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE));
        LibraryVersionFilter filter = new LibraryVersionFilter("3.0");
        List<RuleDescriptor> result = filter.apply(rules);
        assertEquals(result.size(), 0);

    }

    @Test
    public void test_filter_single_rule_by_version() {
        // Arrange
        RuleDescriptor rule = new RuleDescriptor("1", "TestLibrary", "1.0", "path/to/cql", "path/to/elm", RuleRole.RULE);
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(rule);
        LibraryVersionFilter filter = new LibraryVersionFilter("1.0");

        // Act
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        // Assert
        assertEquals(1, filteredRules.size());
        assertEquals("1.0", filteredRules.get(0).getVersion());
    }

    @Test
    public void test_preserves_order_of_matching_rules() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "LibraryA", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "LibraryB", "2.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE));
        rules.add(new RuleDescriptor("3", "LibraryA", "1.0", "path/to/cql3", "path/to/elm3", RuleRole.RULE));

        LibraryVersionFilter filter = new LibraryVersionFilter("1.0");
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(2, filteredRules.size());
        assertEquals("1", filteredRules.get(0).getId());
        assertEquals("3", filteredRules.get(1).getId());
    }

    @Test
    public void test_apply_with_null_version() {
        LibraryVersionFilter filter = new LibraryVersionFilter(null);
        List<RuleDescriptor> rules = new ArrayList<>();

        rules.add(new RuleDescriptor("1", "LibraryA", "1.0", "path/to/cql", "path/to/elm", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "LibraryB", null, "path/to/cql", "path/to/elm", RuleRole.RULE));
        assertThrows(NullPointerException.class, () -> {
            filter.apply(null);
        });
    }

    @Test
    public void test_apply_with_empty_rules_list() {
        LibraryVersionFilter filter = new LibraryVersionFilter("1.0");
        List<RuleDescriptor> rules = Collections.emptyList();
        List<RuleDescriptor> result = filter.apply(rules);
        assertEquals(result.size(), 0);

    }

    @Test
    public void test_apply_with_null_rules_list() {
        LibraryVersionFilter filter = new LibraryVersionFilter("1.0");

        assertThrows(NullPointerException.class, () -> {
            filter.apply(null);
        });
    }

    @Test
    public void test_filter_with_null_version() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "LibraryA", null, "path/to/cql", "path/to/elm", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "LibraryB", "1.0", "path/to/cql", "path/to/elm", RuleRole.RULE));

        LibraryVersionFilter filter = new LibraryVersionFilter(null);

        assertThrows(NullPointerException.class, () -> {
            filter.apply(null);
        });
    }

    @Test
    public void test_case_sensitive_version_comparison() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "LibraryA", "1.0.0", "path/to/cql", "path/to/elm", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "LibraryB", "1.0.0", "path/to/cql", "path/to/elm", RuleRole.RULE));
        rules.add(new RuleDescriptor("3", "LibraryC", "1.0.1", "path/to/cql", "path/to/elm", RuleRole.RULE));
        rules.add(new RuleDescriptor("4", "LibraryD", "1.0.0-alpha", "path/to/cql", "path/to/elm", RuleRole.RULE));

        LibraryVersionFilter filter = new LibraryVersionFilter("1.0.0");
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(2, filteredRules.size());
        assertTrue(filteredRules.stream().allMatch(rule -> rule.getVersion().equals("1.0.0")));
    }

    @Test
    public void test_apply_with_duplicate_rules() {
        RuleDescriptor rule1 = new RuleDescriptor("1", "LibraryA", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE);
        RuleDescriptor rule2 = new RuleDescriptor("2", "LibraryA", "1.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE);
        RuleDescriptor rule3 = new RuleDescriptor("3", "LibraryB", "2.0", "path/to/cql3", "path/to/elm3", RuleRole.RULE);
        List<RuleDescriptor> rules = Arrays.asList(rule1, rule2, rule3, rule1);

        LibraryVersionFilter filter = new LibraryVersionFilter("1.0");
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(3, filteredRules.size());
        assertTrue(filteredRules.contains(rule1));
        assertTrue(filteredRules.contains(rule2));
        assertFalse(filteredRules.contains(rule3));
    }

}
