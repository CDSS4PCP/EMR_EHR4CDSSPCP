package org.openmrs.module.cdss.api.serialization;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.openmrs.module.cdss.api.data.CdssUsage;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.openmrs.module.cdss.api.data.WebJsonView;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfiguration {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        simpleModule.addSerializer(RuleManifest.class, new RuleManifestSerializer());
        simpleModule.addDeserializer(RuleManifest.class, new RuleManifestDeserializer());
        mapper.registerModule(simpleModule);


        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(MapperFeature.DEFAULT_VIEW_INCLUSION, true);

        return mapper;
    }


    @Bean
    public ObjectMapper webObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(CdssUsage.class, new CdssUsageSerializer());
        simpleModule.addDeserializer(CdssUsage.class, new CdssUsageDeserializer());
        simpleModule.addSerializer(RuleManifest.class, new RuleManifestSerializer());
        simpleModule.addDeserializer(RuleManifest.class, new RuleManifestDeserializer());
        mapper.registerModule(simpleModule);


        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(MapperFeature.DEFAULT_VIEW_INCLUSION, false);
        mapper.setConfig(mapper.getSerializationConfig().withView(WebJsonView.class));

        return mapper;
    }
}
