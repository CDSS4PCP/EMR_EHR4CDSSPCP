package org.openmrs.module.cdss.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.junit.Test;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.openmrs.module.cdss.api.serialization.CdssUsageDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class CdssUsageDeserializerTest {


    @Test
    public void test_valid_deserialization() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        mapper.registerModule(simpleModule);

        String json = "{\"vaccine\":\"Measles, Mumps, and Rubella Virus Vaccine\",\"patientId\":\"1\",\"timestamp\":[2024,4,1,1,1,1],\"rule\":\"MMR4regular12months_4yrs_OneMMRRecommendation\",\"recommendations\":[{\"priority\":1,\"recommendation\":\"Recommendation 1\"}],\"status\":\"ACTED\",\"uuid\":\"29080fbe-f38a-11ee-a25e-0242ac130002\"}";
        CdssUsage cdssUsage = mapper.readValue(json, CdssUsage.class);

        assertEquals("Measles, Mumps, and Rubella Virus Vaccine", cdssUsage.getVaccine());
        assertEquals("1", cdssUsage.getPatientId());
        assertEquals("MMR4regular12months_4yrs_OneMMRRecommendation", cdssUsage.getRule());
        assertEquals("Recommendation 1", cdssUsage.getRecommendation1());
        assertEquals(LocalDateTime.of(2024, 4, 1, 1, 1, 1), cdssUsage.getTimestamp());
        assertEquals("ACTED", cdssUsage.getStatus());
        assertEquals("29080fbe-f38a-11ee-a25e-0242ac130002", cdssUsage.getUuid());

    }

    @Test
    public void test_empty_deserialization() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        mapper.registerModule(simpleModule);

        String json = "{}";
        try {
            CdssUsage cdssUsage = mapper.readValue(json, CdssUsage.class);

        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Empty object when deserializing \"CdssUsage\""));
        }
    }

    @Test
    public void test_throw_error_if_status_is_null() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        mapper.registerModule(simpleModule);

        String json = "{\"vaccine\":\"Measles, Mumps, and Rubella Virus Vaccine\",\"patientId\":\"1\",\"timestamp\":[2024,4,1,1,1,1],\"rule\":\"MMR4regular12months_4yrs_OneMMRRecommendation\",\"recommendations\":[{\"priority\":1,\"recommendation\":\"Recommendation 1\"}],\"uuid\":\"29080fbe-f38a-11ee-a25e-0242ac130002\"}";
        try {
            CdssUsage cdssUsage = mapper.readValue(json, CdssUsage.class);

        } catch (IOException ioException) {
            assertTrue(ioException.getMessage().contains("Required field \"status\" was null when deserializing \"CdssUsage\""));
        }
    }

}
