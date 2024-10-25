package org.openmrs.module.cdss.api.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleManifest;

import java.io.IOException;
import java.util.Map;

public class RuleManifestSerializer extends StdSerializer<RuleManifest> {
    public RuleManifestSerializer(Class<RuleManifest> t) {
        super(t);
    }

    public RuleManifestSerializer() {
        this(null);
    }

    @Override
    public void serialize(RuleManifest value, JsonGenerator jsonGenerator, SerializerProvider provider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeFieldName("rules");
        jsonGenerator.writeStartArray();
        for (RuleDescriptor rule : value.getRules()) {
            writeRuleDescriptor(jsonGenerator, rule);
        }
        jsonGenerator.writeEndArray();
        jsonGenerator.writeEndObject();

    }

    private void writeRuleDescriptor(JsonGenerator jsonGenerator, RuleDescriptor ruleDescriptor) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("id", ruleDescriptor.getId());
        jsonGenerator.writeStringField("version", ruleDescriptor.getVersion());
        jsonGenerator.writeStringField("cqlFilePath", ruleDescriptor.getCqlFilePath());
        jsonGenerator.writeStringField("elmFilePath()", ruleDescriptor.getElmFilePath());
        jsonGenerator.writeStringField("description", ruleDescriptor.getDescription());
        jsonGenerator.writeStringField("role", ruleDescriptor.getRole().name());
        jsonGenerator.writeBooleanField("enabled", ruleDescriptor.isEnabled());
        if (ruleDescriptor.getParams() != null) {
            jsonGenerator.writeFieldName("params");
            jsonGenerator.writeStartObject();
            for (Map.Entry<String, ParamDescriptor> param : ruleDescriptor.getParams().entrySet()) {
                jsonGenerator.writeFieldName(param.getKey());
                jsonGenerator.writeStartObject();
                jsonGenerator.writeStringField("type", param.getValue().getType());
                jsonGenerator.writeFieldName("value");

                jsonGenerator.writeObject(param.getValue().getValue());
                jsonGenerator.writeFieldName("default");

                jsonGenerator.writeObject(param.getValue().getDefaultValue());
                jsonGenerator.writeEndObject();

            }
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndObject();

    }
}
