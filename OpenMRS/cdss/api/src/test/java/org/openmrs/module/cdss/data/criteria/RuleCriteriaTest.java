package org.openmrs.module.cdss.data.criteria;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.RuleCriteria;
import org.openmrs.module.cdss.api.data.criteria.projection.RuleProjection;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class RuleCriteriaTest {

    /*
    Test apply filters
     */

    @Test
    public void test_apply_filters_with_valid_input() {
        RuleCriteria criteria = new RuleCriteria();
        criteria.setLibraryName("TestLib");

        List<RuleDescriptor> rules = new ArrayList<>();
        rules.add(new RuleDescriptor("1", "TestLib", "1.0", "path1", "path1", RuleRole.RULE));
        rules.add(new RuleDescriptor("2", "OtherLib", "1.0", "path2", "path2", RuleRole.RULE));

        List<RuleDescriptor> result = criteria.applyFilters(rules);

        assertEquals(1, result.size());
        assertEquals("TestLib", result.get(0).getLibraryName());
    }


    @Test
    public void test_apply_multiple_filters_sequence() {
        RuleCriteria criteria = new RuleCriteria();
        criteria.setLibraryName("TestLib")
                .setEnabled(true);

        List<RuleDescriptor> rules = new ArrayList<>();
        RuleDescriptor rule1 = new RuleDescriptor("1", "TestLib", "1.0", "path1", "path1", RuleRole.RULE);
        rule1.setEnabled(true);
        RuleDescriptor rule2 = new RuleDescriptor("2", "TestLib", "1.0", "path2", "path2", RuleRole.RULE);
        rule2.setEnabled(false);
        rules.add(rule1);
        rules.add(rule2);

        List<RuleDescriptor> result = criteria.applyFilters(rules);

        assertEquals(1, result.size());
        assertTrue(result.get(0).isEnabled());
    }

    @Test
    public void test_apply_filters_null_input() {
        RuleCriteria criteria = new RuleCriteria();
        criteria.setLibraryName("TestLib");

        List<RuleDescriptor> result = criteria.applyFilters(null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }


    /*
    Test apply projection
     */
    @Test
    public void test_apply_projection_returns_projected_list() {
        RuleCriteria criteria = new RuleCriteria();
        List<RuleDescriptor> rules = Arrays.asList(
                new RuleDescriptor("id1", "lib1", "1.0", "path1.cql", "path1.elm", RuleRole.RULE),
                new RuleDescriptor("id2", "lib2", "2.0", "path2.cql", "path2.elm", RuleRole.RULE)
        );

        RuleProjection<String> projection = new RuleProjection<String>() {
            @Override
            public List<String> apply(List<RuleDescriptor> rules) {
                return rules.stream().map(RuleDescriptor::getId).collect(Collectors.toList());
            }
        };

        List<String> result = criteria.applyProjection(rules, projection);

        assertEquals(Arrays.asList("id1", "id2"), result);
    }

    @Test
    public void test_apply_projection_empty_list_returns_empty() {
        RuleCriteria criteria = new RuleCriteria();
        List<RuleDescriptor> emptyRules = new ArrayList<>();

        RuleProjection<String> projection = new RuleProjection<String>() {
            @Override
            public List<String> apply(List<RuleDescriptor> rules) {
                return rules.stream().map(RuleDescriptor::getId).collect(Collectors.toList());
            }
        };

        List<String> result = criteria.applyProjection(emptyRules, projection);

        assertTrue(result.isEmpty());
    }

    @Test
    public void test_apply_projection_null_list_returns_empty() {
        RuleCriteria criteria = new RuleCriteria();

        RuleProjection<String> projection = new RuleProjection<String>() {
            @Override
            public List<String> apply(List<RuleDescriptor> rules) {
                return rules.stream().map(RuleDescriptor::getId).collect(Collectors.toList());
            }
        };

        List<String> result = criteria.applyProjection(null, projection);

        assertNull(result);
    }

    @Test
    public void test_apply_projection_null_projection_returns_null() {
        RuleCriteria criteria = new RuleCriteria();
        List<RuleDescriptor> rules = Arrays.asList(
                new RuleDescriptor("id1", "lib1", "1.0", "path1.cql", "path1.elm", RuleRole.RULE),
                new RuleDescriptor("id2", "lib2", "2.0", "path2.cql", "path2.elm", RuleRole.RULE)
        );


        List<?> result = criteria.applyProjection(rules, null);

        assertNull(result);
    }

}
