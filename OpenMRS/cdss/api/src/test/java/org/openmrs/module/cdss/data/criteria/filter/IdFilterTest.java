package org.openmrs.module.cdss.data.criteria.filter;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.IdFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

public class IdFilterTest {
    // Filter returns single rule when input list contains one rule with matching ID
    @Test
    public void test_filter_returns_matching_rule() {
        String testId = "test-123";
        RuleDescriptor rule = new RuleDescriptor(testId, "lib", "1.0", "path.cql", "path.elm", RuleRole.RULE);
        List<RuleDescriptor> rules = Arrays.asList(rule);

        IdFilter filter = new IdFilter(testId);
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertEquals(testId, result.get(0).getId());
    }

    // Filter returns empty list when no rules match the specified ID
    @Test
    public void test_filter_returns_empty_for_no_matches() {
        RuleDescriptor rule = new RuleDescriptor("different-id", "lib", "1.0", "path.cql", "path.elm", RuleRole.RULE);
        List<RuleDescriptor> rules = Arrays.asList(rule);

        IdFilter filter = new IdFilter("test-id");
        List<RuleDescriptor> result = filter.apply(rules);

        assertTrue(result.isEmpty());
    }

    // Multiple rules with same ID should all be returned
    @Test
    public void test_multiple_rules_with_same_id() {
        List<RuleDescriptor> rules = new ArrayList<>();
        RuleDescriptor rule1 = new RuleDescriptor("123", "Library1", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE);
        RuleDescriptor rule2 = new RuleDescriptor("123", "Library2", "1.1", "path/to/cql2", "path/to/elm2", RuleRole.RULE);
        RuleDescriptor rule3 = new RuleDescriptor("456", "Library3", "1.0", "path/to/cql3", "path/to/elm3", RuleRole.RULE);
        rules.add(rule1);
        rules.add(rule2);
        rules.add(rule3);

        IdFilter idFilter = new IdFilter("123");
        List<RuleDescriptor> filteredRules = idFilter.apply(rules);

        assertEquals(2, filteredRules.size());
        assertTrue(filteredRules.contains(rule1));
        assertTrue(filteredRules.contains(rule2));
    }

    // Filter handles case-sensitive ID matching correctly
    @Test
    public void test_id_filter_case_sensitive_matching() {
        List<RuleDescriptor> rules = new ArrayList<>();

        rules.add(new RuleDescriptor("ID1", "Library1", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE));
        rules.add(new RuleDescriptor("id1", "Library2", "1.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE));
        rules.add(new RuleDescriptor("ID2", "Library3", "1.0", "path/to/cql3", "path/to/elm3", RuleRole.RULE));

        IdFilter filter = new IdFilter("ID1");
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(1, filteredRules.size());
        assertEquals("ID1", filteredRules.get(0).getId());
    }

    // Filter handles empty input list of rules
    @Test
    public void test_apply_with_empty_rule_list() {
        IdFilter idFilter = new IdFilter("testId");
        List<RuleDescriptor> emptyRules = Collections.emptyList();
        List<RuleDescriptor> result = idFilter.apply(emptyRules);
        assertEquals(0, result.size());
    }

    // Filter handles null ID in constructor
    @Test
    public void test_filter_handles_null_id() {
        IdFilter idFilter = new IdFilter(null);
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "Library1", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "Library2", "1.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE));

        assertThrows(NullPointerException.class, () -> idFilter.apply(rules));
    }

    // Filter processes list containing null RuleDescriptor objects
    @Test
    public void test_filter_with_null_rule_descriptors() {
        IdFilter idFilter = new IdFilter("testId");
        List<RuleDescriptor> rules = new ArrayList<>();

        rules.add(new RuleDescriptor("testId", "libraryName", "1.0", "cqlPath", "elmPath", RuleRole.RULE));
        rules.add(null);
        rules.add(new RuleDescriptor("anotherId", "libraryName", "1.0", "cqlPath", "elmPath", RuleRole.RULE));

        List<RuleDescriptor> filteredRules = idFilter.apply(rules);

        assertEquals(1, filteredRules.size());
        assertEquals("testId", filteredRules.get(0).getId());
    }

}
