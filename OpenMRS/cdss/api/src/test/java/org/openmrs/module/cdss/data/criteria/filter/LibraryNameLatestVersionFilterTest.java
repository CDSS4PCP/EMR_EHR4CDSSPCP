package org.openmrs.module.cdss.data.criteria.filter;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.LibraryNameLatestVersionFilter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

public class LibraryNameLatestVersionFilterTest {
    // Filter returns single rule with highest version when multiple rules exist for same library
    @Test
    public void test_filter_returns_highest_version_rule() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "TestLibrary", "1.0.0", "path1", "path1", null));
        rules.add(new RuleDescriptor("2", "TestLibrary", "2.0.0", "path2", "path2", null));
        rules.add(new RuleDescriptor("3", "TestLibrary", "1.5.0", "path3", "path3", null));

        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("TestLibrary");
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertEquals("2.0.0", result.get(0).getVersion());
    }

    // Filter correctly delegates library name filtering to LibraryNameFilter
    @Test
    public void test_library_name_filter_delegation() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "LibraryA", "1.0", "path1", "path2", null));
        rules.add(new RuleDescriptor("2", "LibraryB", "1.0", "path3", "path4", null));
        rules.add(new RuleDescriptor("3", "LibraryA", "2.0", "path5", "path6", null));

        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("LibraryA");
        List<RuleDescriptor> filteredRules = filter.apply(rules);

        assertEquals(1, filteredRules.size());
        assertEquals("2.0", filteredRules.get(0).getVersion());
    }

    // Version comparison works correctly for semantic version strings
    @Test
    public void test_latest_version_selection() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "TestLibrary", "1.0.0", "path1", "path1", null));
        rules.add(new RuleDescriptor("2", "TestLibrary", "1.2.0", "path2", "path2", null));
        rules.add(new RuleDescriptor("3", "TestLibrary", "1.1.0", "path3", "path3", null));

        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("TestLibrary");
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertEquals("1.2.0", result.get(0).getVersion());
    }

    // Returns empty list when no rules match library name
    @Test
    public void test_returns_empty_list_when_no_rules_match_library_name() {
        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("NonExistentLibrary");
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "SomeLibrary", "1.0", "path/to/cql", "path/to/elm", null));
        rules.add(new RuleDescriptor("2", "AnotherLibrary", "2.0", "path/to/cql", "path/to/elm", null));

        List<RuleDescriptor> result = filter.apply(rules);

        assertTrue(result.isEmpty());
    }

    // Returns single rule when only one rule exists for library name
    @Test
    public void test_single_rule_for_library_name() {
        List<RuleDescriptor> rules = new ArrayList<>();
        RuleDescriptor rule = new RuleDescriptor("1", "TestLibrary", "1.0", "path/to/cql", "path/to/elm", RuleRole.RULE);
        rules.add(rule);

        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("TestLibrary");
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertEquals(rule, result.get(0));
    }

    // Handle null version strings in RuleDescriptor objects
    @Test
    public void test_handle_null_version_strings() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "TestLibrary", null, "path1", "path2", null));
        rules.add(new RuleDescriptor("2", "TestLibrary", "1.0.0", "path3", "path4", null));
        rules.add(new RuleDescriptor("3", "TestLibrary", "2.0.0", "path5", "path6", null));

        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("TestLibrary");
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertEquals("2.0.0", result.get(0).getVersion());
    }

    // Handle null or empty input rules list
    @Test
    public void test_apply_with_null_or_empty_rules_list() {
        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("TestLibrary");

        // Test with null input
        assertThrows(NullPointerException.class, () -> filter.apply(null));

        // Test with empty list input
        List<RuleDescriptor> resultWithEmpty = filter.apply(Collections.emptyList());
        assertNotNull(resultWithEmpty);
        assertTrue(resultWithEmpty.isEmpty());
    }

    // Handle rules with identical version strings
    @Test
    public void test_identical_version_strings() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "TestLibrary", "1.0.0", "path/to/cql1", "path/to/elm1", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "TestLibrary", "1.0.0", "path/to/cql2", "path/to/elm2", RuleRole.RULE));

        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("TestLibrary");
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(1, result.size());
        assertTrue(result.get(0).getId().equals("1") || result.get(0).getId().equals("2"));
    }



    // Handle case where all rules have empty version strings
    @Test
    public void test_empty_version_strings() {
        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "TestLibrary", "", "path1", "path2", null));
        rules.add(new RuleDescriptor("2", "TestLibrary", "", "path3", "path4", null));

        LibraryNameLatestVersionFilter filter = new LibraryNameLatestVersionFilter("TestLibrary");
        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(0, result.size());
//        assertTrue(result.isEmpty(), "Expected no rules to be returned when all versions are empty");
    }

}
