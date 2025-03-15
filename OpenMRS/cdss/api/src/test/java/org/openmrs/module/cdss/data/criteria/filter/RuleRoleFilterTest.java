package org.openmrs.module.cdss.data.criteria.filter;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.RuleRoleFilter;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class RuleRoleFilterTest {

    @Test
    public void test_filter_matches_specified_role() {
        RuleRoleFilter filter = new RuleRoleFilter(RuleRole.RULE);

        List<RuleDescriptor> rules = Arrays.asList(
                new RuleDescriptor("1", "lib1", "1.0", "path1.cql", "path1.elm", RuleRole.RULE),
                new RuleDescriptor("2", "lib2", "1.0", "path2.cql", "path2.elm", RuleRole.SUPPORT),
                new RuleDescriptor("3", "lib3", "1.0", "path3.cql", "path3.elm", RuleRole.RULE)
        );

        List<RuleDescriptor> result = filter.apply(rules);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(r -> r.getRole().equals(RuleRole.RULE)));
    }

    @Test
    public void test_return_empty_list_when_no_matches() {
        RuleRoleFilter filter = new RuleRoleFilter(RuleRole.RULE);

        List<RuleDescriptor> rules = Arrays.asList(
                new RuleDescriptor("1", "lib1", "1.0", "path1.cql", "path1.elm", RuleRole.SUPPORT),
                new RuleDescriptor("2", "lib2", "1.0", "path2.cql", "path2.elm", RuleRole.SUPPORT)
        );

        List<RuleDescriptor> result = filter.apply(rules);

        assertTrue(result.isEmpty());
    }

    @Test
    public void test_handle_null_input_list() {
        RuleRoleFilter filter = new RuleRoleFilter(RuleRole.RULE);

        assertThrows(NullPointerException.class, () -> {
            filter.apply(null);
        });
    }
}
