package org.openmrs.module.cdss.data.criteria.projection;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.projection.IdProjection;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class IdProjectionTest {

    private IdProjection idProjection;

    @BeforeEach
    void setUp() {
        idProjection = new IdProjection();
    }

    @Test
    void apply_ShouldReturnIds_WhenRulesAreProvided() {
        RuleDescriptor rule1 = new RuleDescriptor("rule1-id", "Rule 1", "1", "cqlPath", "elmPath", RuleRole.RULE);
        RuleDescriptor rule2 = new RuleDescriptor("rule2-id", "Rule 2", "1", "cqlPath", "elmPath", RuleRole.RULE);

        List<RuleDescriptor> rules = Arrays.asList(rule1, rule2);

        List<String> result = idProjection.apply(rules);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("rule1-id", result.get(0));
        assertEquals("rule2-id", result.get(1));
    }

    @Test
    void apply_ShouldReturnEmptyList_WhenNoRulesAreProvided() {
        List<RuleDescriptor> rules = Collections.emptyList();

        List<String> result = idProjection.apply(rules);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void apply_ShouldThrowNullPointerException_WhenNullIsProvided() {
        assertThrows(NullPointerException.class, () -> idProjection.apply(null));
    }
}
