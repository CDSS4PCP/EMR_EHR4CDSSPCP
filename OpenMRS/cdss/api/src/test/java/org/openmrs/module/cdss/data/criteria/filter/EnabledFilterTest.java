package org.openmrs.module.cdss.data.criteria.filter;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.EnabledFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

public class EnabledFilterTest {
    // Filter returns only enabled rules when isEnabled is true
    @Test
    public void test_filter_returns_enabled_rules_when_enabled_true() {
        EnabledFilter filter = new EnabledFilter(true);

        RuleDescriptor enabledRule = new RuleDescriptor("1", "lib1", "1.0", "path1.cql", "path1.elm", RuleRole.RULE);
        enabledRule.setEnabled(true);

        RuleDescriptor disabledRule = new RuleDescriptor("2", "lib2", "1.0", "path2.cql", "path2.elm", RuleRole.RULE);
        disabledRule.setEnabled(false);

        List<RuleDescriptor> rules = Arrays.asList(enabledRule, disabledRule);
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertTrue(result.get(0).isEnabled());
    }

    // Filter returns only disabled rules when isEnabled is false
    @Test
    public void test_filter_returns_only_disabled_rules() {
        List<RuleDescriptor> rules = new ArrayList<>();
        RuleDescriptor rule1 = new RuleDescriptor("1", "Library1", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE);
        rule1.setEnabled(false);
        RuleDescriptor rule2 = new RuleDescriptor("2", "Library2", "1.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE);
        rule2.setEnabled(true);
        RuleDescriptor rule3 = new RuleDescriptor("3", "Library3", "1.0", "path/to/cql3", "path/to/elm3", RuleRole.RULE);
        rule3.setEnabled(false);
        rules.add(rule1);
        rules.add(rule2);
        rules.add(rule3);

        EnabledFilter filter = new EnabledFilter(false);
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(2, filteredRules.size());
        assertTrue(filteredRules.contains(rule1));
        assertTrue(filteredRules.contains(rule3));
    }

    // Filter handles non-empty input lists correctly
    @Test
    public void test_apply_filters_enabled_rules() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "Library1", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "Library2", "1.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE));
        rules.get(0).setEnabled(true);
        rules.get(1).setEnabled(false);

        EnabledFilter filter = new EnabledFilter(true);
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(1, filteredRules.size());
        assertTrue(filteredRules.get(0).isEnabled());
    }

    // Filter handles null input list throwing NullPointerException
    @Test
    public void test_apply_throws_NullPointerException_on_null_input() {
        EnabledFilter enabledFilter = new EnabledFilter();

        assertThrows(NullPointerException.class, () -> enabledFilter.apply(null));
    }

    // Filter handles empty input list returning empty list
    @Test
    public void test_apply_with_empty_list_returns_empty_list() {
        EnabledFilter enabledFilter = new EnabledFilter();
        List<RuleDescriptor> emptyList = Collections.emptyList();
        List<RuleDescriptor> result = enabledFilter.apply(emptyList);
        assertEquals(0, result.size());
    }

    // Filter handles list with mixed enabled/disabled rules
    @Test
    public void test_filter_handles_mixed_enabled_disabled_rules() {
        List<RuleDescriptor> rules = new ArrayList<>();
        RuleDescriptor rule1 = new RuleDescriptor("1", "Library1", "1.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE);
        rule1.setEnabled(true);
        RuleDescriptor rule2 = new RuleDescriptor("2", "Library2", "1.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE);
        rule2.setEnabled(false);
        RuleDescriptor rule3 = new RuleDescriptor("3", "Library3", "1.0", "path/to/cql3", "path/to/elm3", RuleRole.RULE);
        rule3.setEnabled(true);
        rules.add(rule1);
        rules.add(rule2);
        rules.add(rule3);

        EnabledFilter enabledFilter = new EnabledFilter(true);
        List<RuleDescriptor> filteredRules = enabledFilter.apply(rules);

        assertEquals(2, filteredRules.size());
        assertTrue(filteredRules.contains(rule1));
        assertTrue(filteredRules.contains(rule3));
    }

}
