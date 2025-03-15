package org.openmrs.module.cdss.data.criteria.projection;



import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleRole;
import org.openmrs.module.cdss.api.data.criteria.projection.LibraryVersionProjection;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LibraryVersionProjectionTest {

    private LibraryVersionProjection libraryVersionProjection;

    @BeforeEach
    void setUp() {
        libraryVersionProjection = new LibraryVersionProjection();
    }

    @Test
    void apply_ShouldReturnVersions_WhenRulesAreProvided() {
        // Arrange
        RuleDescriptor rule1 = new RuleDescriptor("rule1-id", "Rule 1", "1", "cqlPath", "elmPath", RuleRole.RULE);
        RuleDescriptor rule2 = new RuleDescriptor("rule2-id", "Rule 2", "2", "cqlPath", "elmPath", RuleRole.RULE);

        List<RuleDescriptor> rules = Arrays.asList(rule1, rule2);

        // Act
        List<String> result = libraryVersionProjection.apply(rules);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("1", result.get(0));
        assertEquals("2", result.get(1));
    }

    @Test
    void apply_ShouldReturnEmptyList_WhenNoRulesAreProvided() {
        // Arrange
        List<RuleDescriptor> rules = Collections.emptyList();

        // Act
        List<String> result = libraryVersionProjection.apply(rules);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void apply_ShouldThrowNullPointerException_WhenNullIsProvided() {
        // Act & Assert
        assertThrows(NullPointerException.class, () -> libraryVersionProjection.apply(null));
    }
}
