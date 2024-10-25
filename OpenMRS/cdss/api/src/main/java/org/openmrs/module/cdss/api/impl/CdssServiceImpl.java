package org.openmrs.module.cdss.api.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.openmrs.module.cdss.api.CDSSService;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.openmrs.module.cdss.api.serialization.CdssUsageDeserializer;
import org.openmrs.module.cdss.api.serialization.CdssUsageSerializer;
import org.openmrs.module.cdss.api.serialization.RuleManifestDeserializer;
import org.openmrs.module.cdss.api.serialization.RuleManifestSerializer;

/**
 * CdssServiceImpl class implements the CDSSService interface and provides methods to manage
 * Clinical Decision Support System (CDSS) functionality. It initializes an ObjectMapper and a
 * SimpleModule to handle serialization and deserialization of CdssUsage objects. The
 * CdssServiceImpl class is responsible for setting up the ObjectMapper with custom serializers and
 * deserializers for CdssUsage objects.
 */
public class CdssServiceImpl implements CDSSService {

    private ObjectMapper objectMapper;

    private SimpleModule simpleModule;

    @Override
    public ObjectMapper getCdssObjectMapper() {
        return objectMapper;
    }

    @Override
    public void onStartup() {
        objectMapper = new ObjectMapper();
        simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        simpleModule.addSerializer(RuleManifest.class, new RuleManifestSerializer());
        simpleModule.addDeserializer(RuleManifest.class, new RuleManifestDeserializer());
        objectMapper.registerModule(simpleModule);

    }

    @Override
    public void onShutdown() {

    }
}
