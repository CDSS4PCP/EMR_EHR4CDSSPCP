package org.openmrs.module.cdss.api.serialization;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import org.apache.log4j.Logger;
import org.openmrs.module.cdss.api.data.ParamDescriptor;
import org.openmrs.module.cdss.api.data.RuleDescriptor;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.openmrs.module.cdss.api.data.RuleRole;

import java.io.IOException;
import java.util.*;

public class RuleManifestDeserializer extends StdDeserializer<RuleManifest> {
    private final Logger log = Logger.getLogger(getClass());

    protected RuleManifestDeserializer(Class<?> vc) {
        super(vc);
    }

    public RuleManifestDeserializer() {
        this(null);
    }


    /**
     * Deserializes a JSON object into a RuleManifest instance.
     *
     * @param jsonParser the JSON parser used to read the JSON content
     * @param ctxt the deserialization context
     * @return a RuleManifest object containing a list of RuleDescriptor objects
     *         if the "rules" field is present and non-null; otherwise, returns null
     * @throws IOException if the JSON object is empty or an error occurs during deserialization
     */
    @Override
    public RuleManifest deserialize(JsonParser jsonParser, DeserializationContext ctxt) throws IOException {
        JsonNode rootNode = jsonParser.getCodec().readTree(jsonParser);

        if (rootNode.isEmpty()) {
            throw new IOException("Empty object when deserializing \"RuleManifest\"");
        }

        if (rootNode.hasNonNull("rules")) {

            List<RuleDescriptor> rules = new ArrayList<>();
            for (Iterator<JsonNode> it = rootNode.get("rules").elements(); it.hasNext(); ) {

                JsonNode node = it.next();
                RuleDescriptor descriptor = parseRuleDescriptor(node);
                rules.add(descriptor);
            }
            return new RuleManifest(rules);
        }
        return null;
    }

    /**
     * Parses a JSON node to create a RuleDescriptor object.
     *
     * @param node the JSON node containing rule details
     * @return a RuleDescriptor object initialized with the id, library name, version,
     *         file paths, description, role, enabled status, derived information,
     *         and parameters extracted from the JSON node
     */
    private RuleDescriptor parseRuleDescriptor(JsonNode node) {
        String id = node.get("id").asText();
        String libraryName = node.get("libraryName").asText();

        String version = node.get("version").asText();
        String cqlFilePath = node.get("cqlFilePath").asText();
        String elmFilePath = node.get("elmFilePath").asText();
        String description = node.get("description").asText();
        RuleRole role = node.get("role").asText().equalsIgnoreCase("support") ? RuleRole.SUPPORT : RuleRole.RULE;
        Boolean enabled = node.get("enabled").asBoolean();
        String derivedFrom = node.get("derivedFrom").asText();

        RuleDescriptor descriptor = new RuleDescriptor(id, libraryName, version, cqlFilePath, elmFilePath, role);
        descriptor.setDescription(description);
        descriptor.setEnabled(enabled);
        descriptor.setDerivedFrom(derivedFrom);

        Map<String, ParamDescriptor> paramDescriptors = new HashMap<>();

        if (node.has("params"))
            for (Iterator<Map.Entry<String, JsonNode>> it = node.get("params").fields(); it.hasNext(); ) {

                Map.Entry<String, JsonNode> entry = it.next();
                JsonNode paramNode = entry.getValue();

                ParamDescriptor paramDescriptor = parseParam(paramNode);
                paramDescriptors.put(entry.getKey(), paramDescriptor);
            }

        descriptor.setParams(paramDescriptors);
        return descriptor;

    }

    /**
     * Parses a JSON node to create a ParamDescriptor object.
     *
     * @param node the JSON node containing parameter details
     * @return a ParamDescriptor object initialized with the type, value, default value,
     *         and allowed values extracted from the JSON node
     * @throws NullPointerException if the node is null
     */
    private ParamDescriptor parseParam(JsonNode node) {
        String type = node.get("type").asText();
        String value = node.get("value").asText();
        String defaultValue = node.has("default") ? node.get("default").asText() : null;

        ParamDescriptor paramDescriptor = new ParamDescriptor(type, defaultValue);
        paramDescriptor.setValue(value);
        if (node.has("allowedValues")) {
            JsonNodeType t = node.getNodeType();

            if (t.equals(JsonNodeType.ARRAY)) {
                ArrayList<Object> allowedValuesList = new ArrayList<>();

                if (node.has("allowedValues")) {
                    ArrayNode allowedValuesNode = (ArrayNode) node.get("allowedValues");

                    allowedValuesNode.forEach(allowedValue -> {
                        allowedValuesList.add(allowedValue.asText());
                    });
                    paramDescriptor.setAllowedValues(allowedValuesList.toArray());
                }
            }
        }
        return paramDescriptor;

    }
}
