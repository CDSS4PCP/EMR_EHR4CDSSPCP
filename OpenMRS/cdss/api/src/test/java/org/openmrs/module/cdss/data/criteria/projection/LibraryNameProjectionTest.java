package org.openmrs.module.cdss.data.criteria.projection;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.projection.LibraryNameProjection;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LibraryNameProjectionTest {

    private LibraryNameProjection libraryNameProjection;

    @BeforeEach
    void setUp() {
        libraryNameProjection = new LibraryNameProjection();
    }

    @Test
    void apply_ShouldReturnLibraryNames_WhenRulesAreProvided() {
        RuleDescriptor rule1 = new RuleDescriptor("rule1-id", "Rule 1", "1", "cqlPath", "elmPath", RuleRole.RULE);
        RuleDescriptor rule2 = new RuleDescriptor("rule2-id", "Rule 2", "2", "cqlPath", "elmPath", RuleRole.RULE);

        List<RuleDescriptor> rules = Arrays.asList(rule1, rule2);

        List<String> result = libraryNameProjection.apply(rules);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Rule 1", result.get(0));
        assertEquals("Rule 2", result.get(1));
    }

    @Test
    void apply_ShouldReturnEmptyList_WhenNoRulesAreProvided() {
        List<RuleDescriptor> rules = Collections.emptyList();

        List<String> result = libraryNameProjection.apply(rules);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void apply_ShouldThrowNullPointerException_WhenNullIsProvided() {
        assertThrows(NullPointerException.class, () -> libraryNameProjection.apply(null));
    }
}
