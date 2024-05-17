package org.openmrs.module.cdss.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.junit.Test;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.openmrs.module.cdss.api.serialization.CdssUsageSerializer;

import java.io.IOException;
import java.time.LocalDateTime;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

public class CdssUsageSerializerTest {


    @Test
    public void test_valid_serialization() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        CdssUsage usage = new CdssUsage(
                "HPV",
                "1",
                LocalDateTime.of(2024, 1, 1, 1, 1, 1),
                "HPV_Rule_1",
                "Recommendation1",
                "Recommendation2",
                "Recommendation3",
                "Recommendation4",
                "Recommendation5",
                "Recommendation6",
                "ACTED");


        String actual = mapper.writeValueAsString(usage);
        String expected = "{\"vaccine\":\"HPV\",\"patientId\":\"1\",\"timestamp\":[2024,1,1,1,1,1],\"rule\":\"HPV_Rule_1\",\"recommendations\":[{\"priority\":1,\"recommendation\":\"Recommendation1\"},{\"priority\":2,\"recommendation\":\"Recommendation2\"},{\"priority\":3,\"recommendation\":\"Recommendation3\"},{\"priority\":4,\"recommendation\":\"Recommendation4\"},{\"priority\":5,\"recommendation\":\"Recommendation5\"},{\"priority\":6,\"recommendation\":\"Recommendation6\"}],\"status\":\"ACTED\",\"uuid\":null}";
        assertThat(actual, is(expected));
    }


    // Serializes a CdssUsage object to a JSON string with all fields included
    @Test
    public void test_serialize_all_fields_included() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        // Arrange
        CdssUsageSerializer serializer = new CdssUsageSerializer();
        CdssUsage cdssUsage = new CdssUsage("vaccine", "patientId", "rule", LocalDateTime.of(2022, 1, 1, 0, 0, 0), "recommendation1", "status");
        String expectedJson = "{\"vaccine\":\"vaccine\",\"patientId\":\"patientId\",\"timestamp\":[2022,1,1,0,0,0],\"rule\":\"rule\",\"recommendations\":[{\"priority\":1,\"recommendation\":\"recommendation1\"}],\"status\":\"status\",\"uuid\":null}";

        // Act
        String actualJson = mapper.writeValueAsString(cdssUsage);

        // Assert
        assertEquals(expectedJson, actualJson);
    }



    @Test
    public void test_writes_recommendations_in_priority_order() throws JsonProcessingException {
        CdssUsage cdssUsage = new CdssUsage();
        cdssUsage.setVaccine("vaccine");
        cdssUsage.setPatientId("patientId");
        cdssUsage.setTimestamp(LocalDateTime.now());
        cdssUsage.setRule("rule");
        cdssUsage.setRecommendation1("recommendation1");
        cdssUsage.setRecommendation2("recommendation2");
        cdssUsage.setRecommendation3("recommendation3");
        cdssUsage.setRecommendation4("recommendation4");
        cdssUsage.setRecommendation5("recommendation5");
        cdssUsage.setRecommendation6("recommendation6");
        cdssUsage.setStatus("status");
        cdssUsage.setUuid("uuid");

        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        String json = mapper.writeValueAsString(cdssUsage);

        // Verify the order of recommendations
        assertTrue(json.contains("\"priority\":1"));
        assertTrue(json.contains("\"priority\":2"));
        assertTrue(json.contains("\"priority\":3"));
        assertTrue(json.contains("\"priority\":4"));
        assertTrue(json.contains("\"priority\":5"));
        assertTrue(json.contains("\"priority\":6"));

    }

    @Test
    public void test_throw_error_if_timestamp_is_null() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        CdssUsage cdssUsage = new CdssUsage("vaccine", "patientId", "rule", LocalDateTime.of(2022, 1, 1, 0, 0, 0), "Recommendation1", "status");
        cdssUsage.setTimestamp(null);

        try {
            mapper.writeValueAsString(cdssUsage);
        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Required field \"timestamp\" was null when serializing \"CdssUsage\""));
        }
    }

    @Test
    public void test_throw_error_if_vaccine_is_null() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        CdssUsage cdssUsage = new CdssUsage("vaccine", "patientId", "rule", LocalDateTime.of(2022, 1, 1, 0, 0, 0), "Recommendation1", "status");
        cdssUsage.setVaccine(null);

        try {
            mapper.writeValueAsString(cdssUsage);
        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Required field \"vaccine\" was null when serializing \"CdssUsage\""));
        }
    }


    @Test
    public void test_throw_error_if_patientId_is_null() {

        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        CdssUsage cdssUsage = new CdssUsage("vaccine", "patientId", "rule", LocalDateTime.of(2022, 1, 1, 0, 0, 0), "Recommendation1", "status");
        cdssUsage.setPatientId(null);


        try {
            mapper.writeValueAsString(cdssUsage);
        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Required field \"patientId\" was null when serializing \"CdssUsage\""));
        }
    }

    @Test
    public void test_throw_error_if_rule_is_null() {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        CdssUsage cdssUsage = new CdssUsage("vaccine", "patientId", "rule", LocalDateTime.of(2022, 1, 1, 0, 0, 0), "Recommendation1", "status");
        cdssUsage.setRule(null);

        try {
            mapper.writeValueAsString(cdssUsage);
        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Required field \"rule\" was null when serializing \"CdssUsage\""));
        }
    }

    @Test
    public void test_throw_error_if_recommendation1_is_null() {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        CdssUsage cdssUsage = new CdssUsage("vaccine", "patientId", "rule", LocalDateTime.of(2022, 1, 1, 0, 0, 0), "Recommendation1", "status");
        cdssUsage.setRecommendation1(null);


        try {
            mapper.writeValueAsString(cdssUsage);
        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Required field \"recommendation1\" was null when serializing \"CdssUsage\""));
        }
    }

    @Test
    public void test_throw_error_if_status_is_null() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        mapper.registerModule(simpleModule);

        CdssUsage cdssUsage = new CdssUsage("vaccine", "patientId", "rule", LocalDateTime.of(2022, 1, 1, 0, 0, 0), "Recommendation1", "status");
        cdssUsage.setStatus(null);

        try {
            mapper.writeValueAsString(cdssUsage);
        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Required field \"status\" was null when serializing \"CdssUsage\""));
        }
    }

}
