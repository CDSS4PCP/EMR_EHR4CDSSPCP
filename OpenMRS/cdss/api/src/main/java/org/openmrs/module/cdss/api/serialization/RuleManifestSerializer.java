package org.openmrs.module.cdss.api.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.apache.log4j.Logger;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleManifest;

import java.io.IOException;
import java.util.Map;

public class RuleManifestSerializer extends StdSerializer<RuleManifest> {
    Logger log = Logger.getLogger(getClass());

    public RuleManifestSerializer(Class<RuleManifest> t) {
        super(t);
    }

    public RuleManifestSerializer() {
        this(null);
    }

    /**
     * Serializes a RuleManifest object into JSON format using the provided JsonGenerator.
     * The serialized JSON includes an array of rules, each represented by a RuleDescriptor.
     *
     * @param value the RuleManifest object to serialize
     * @param jsonGenerator the JsonGenerator used to write the JSON output
     * @param provider the SerializerProvider that can be used to get serializers for serializing
     *                 the object's properties
     * @throws IOException if an I/O error occurs during serialization
     */
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

    /**
     * Serializes a RuleDescriptor object into JSON format using the provided JsonGenerator.
     * The JSON output includes fields such as id, libraryName, version, cqlFilePath, elmFilePath,
     * description, role, derivedFrom, enabled, and params. If params are present, each parameter
     * is serialized with its type, value, default value, and allowed values.
     *
     * @param jsonGenerator the JsonGenerator used to write the JSON output
     * @param ruleDescriptor the RuleDescriptor object to serialize
     * @throws IOException if an I/O error occurs during serialization
     */
    private void writeRuleDescriptor(JsonGenerator jsonGenerator, RuleDescriptor ruleDescriptor) throws IOException {

        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("id", ruleDescriptor.getId());
        jsonGenerator.writeStringField("libraryName", ruleDescriptor.getLibraryName());
        jsonGenerator.writeStringField("version", ruleDescriptor.getVersion());
        jsonGenerator.writeStringField("cqlFilePath", ruleDescriptor.getCqlFilePath());
        jsonGenerator.writeStringField("elmFilePath", ruleDescriptor.getElmFilePath());
        jsonGenerator.writeStringField("description", ruleDescriptor.getDescription());
        jsonGenerator.writeStringField("role", ruleDescriptor.getRole().toString());
        if (ruleDescriptor.getDerivedFrom() != null)
            jsonGenerator.writeStringField("derivedFrom", ruleDescriptor.getDerivedFrom());
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

                if (param.getValue().getAllowedValues() != null) {
                    jsonGenerator.writeFieldName("allowedValues");
                    jsonGenerator.writeStartArray();
                    for (Object allowedValue : param.getValue().getAllowedValues()) {
                        jsonGenerator.writeObject(allowedValue);
                    }
                    jsonGenerator.writeEndArray();
                }


                jsonGenerator.writeEndObject();

            }
            jsonGenerator.writeEndObject();
        }
        jsonGenerator.writeEndObject();

    }
}
