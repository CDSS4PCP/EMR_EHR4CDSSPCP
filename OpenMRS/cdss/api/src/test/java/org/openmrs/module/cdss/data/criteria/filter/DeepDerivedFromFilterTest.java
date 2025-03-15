package org.openmrs.module.cdss.data.criteria.filter;

import org.junit.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.filter.DeepDerivedFromFilter;
import org.openmrs.module.cdss.api.data.criteria.filter.RuleRoleFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class DeepDerivedFromFilterTest {

    @Test
    public void test_direct_descendants_identification() {
        List<RuleDescriptor> searchList = new ArrayList<>();
        RuleDescriptor parent = new RuleDescriptor("parent", "lib1", "1.0", "path1", "path1", RuleRole.RULE);
        RuleDescriptor child = new RuleDescriptor("child", "lib2", "1.0", "path2", "path2", RuleRole.RULE);
        child.setDerivedFrom("parent");
        searchList.add(parent);
        searchList.add(child);

        DeepDerivedFromFilter filter = new DeepDerivedFromFilter("parent");
        List<RuleDescriptor> result = filter.apply(searchList);

        assertEquals(1, result.size());
        assertEquals("child", result.get(0).getId());
    }


    @Test
    public void test_indirect_descendants_identification() {
        List<RuleDescriptor> searchList = new ArrayList<>();
        RuleDescriptor parent = new RuleDescriptor("parent", "lib1", "1.0", "path1", "path1", RuleRole.RULE);
        RuleDescriptor child1 = new RuleDescriptor("child1", "lib2", "1.0", "path2", "path2", RuleRole.RULE);
        child1.setDerivedFrom("parent");

        RuleDescriptor grandchild1 = new RuleDescriptor("grandchild1", "lib2", "1.0", "path2", "path2", RuleRole.RULE);
        grandchild1.setDerivedFrom("child1");

        searchList.add(parent);
        searchList.add(child1);
        searchList.add(grandchild1);

        DeepDerivedFromFilter filter = new DeepDerivedFromFilter("parent");
        List<RuleDescriptor> result = filter.apply(searchList);

        assertEquals(2, result.size());
        assertEquals("child1", result.get(0).getId());
        assertEquals("grandchild1", result.get(1).getId());
    }

    @Test
    public void test_handle_null_input_list() {
        DeepDerivedFromFilter filter = new DeepDerivedFromFilter("parent");

        assertThrows(NullPointerException.class, () -> {
            filter.apply(null);
        });
    }

    @Test
    public void test_handle_empty_search_list() {

        DeepDerivedFromFilter filter = new DeepDerivedFromFilter("parent");
        List<RuleDescriptor> result = filter.apply(new ArrayList<>());

        assertEquals(0, result.size());


    }
}
