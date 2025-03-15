package org.openmrs.module.cdss.api.serialization;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.apache.log4j.Logger;
import org.openmrs.module.cdss.api.data.CdssUsage;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

public class CdssUsageDeserializer extends StdDeserializer<CdssUsage> {

    private final Logger log = Logger.getLogger(getClass());

    protected CdssUsageDeserializer(Class<?> vc) {
        super(vc);
    }

    public CdssUsageDeserializer() {
        this(null);
    }

    /**
     * Deserialize a JSON representation of a CdssUsage entity into a CdssUsage object. Validates
     * the presence of required fields such as 'vaccine', 'patientId', 'rule', 'status', and
     * 'timestamp'. Parses the JSON node to extract the necessary information including
     * recommendations and UUID. Constructs a CdssUsage object with the extracted data and returns
     * it.
     *
     * @param jsonParser             the parser for reading JSON content
     * @param deserializationContext the context for deserialization
     * @return the CdssUsage object created from the JSON representation
     * @throws IOException      if there are issues with deserialization
     * @throws JacksonException if there are issues with Jackson library
     */
    @Override
    public CdssUsage deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException,
            JacksonException {
        JsonNode rootNode = jsonParser.getCodec().readTree(jsonParser);
        Integer id = null;
        // Check whether required fields exists
        if (rootNode.isEmpty()) {
            throw new IOException("Empty object when deserializing \"CdssUsage\"");
        }

        if (rootNode.hasNonNull("id")) {
            id = rootNode.get("id").asInt();
        }
        if (!rootNode.hasNonNull("vaccine")) {
            throw new IOException("Required field \"vaccine\" was missing when deserializing \"CdssUsage\"");
        }
        if (!rootNode.hasNonNull("patientId")) {
            throw new IOException("Required field \"patientId\" was missing when deserializing \"CdssUsage\"");
        }
        if (!rootNode.hasNonNull("rule")) {
            throw new IOException("Required field \"rule\" was missing when deserializing \"CdssUsage\"");
        }
        if (!rootNode.hasNonNull("status")) {
            throw new IOException("Required field \"status\" was missing when deserializing \"CdssUsage\"");
        }
        if (!rootNode.hasNonNull("timestamp")) {
            throw new IOException("Required field \"timestamp\" was missing when deserializing \"CdssUsage\"");
        }

        String vaccine = rootNode.get("vaccine").asText();
        String patientId = rootNode.get("patientId").asText();
        String rule = rootNode.get("rule").asText();
        String status = rootNode.get("status").asText();
        String uuid = rootNode.hasNonNull("uuid") ? rootNode.get("uuid").asText() : null;

        LocalDateTime timestamp = parseTimeStamp(rootNode);

        List<String> recommendations = parseRecommendations(rootNode);
        int numRecommendations = recommendations.size();

        CdssUsage usage = new CdssUsage(vaccine, patientId, timestamp, rule,
                numRecommendations >= 1 ? recommendations.get(0) : null, numRecommendations >= 2 ? recommendations.get(1)
                : null, numRecommendations >= 3 ? recommendations.get(2) : null,
                numRecommendations >= 4 ? recommendations.get(3) : null, numRecommendations >= 5 ? recommendations.get(4)
                : null, numRecommendations >= 6 ? recommendations.get(5) : null, status);
        usage.setUuid(uuid);
        usage.setId(id);
        return usage;

    }

    /**
     * Parses the timestamp components from the provided JSON node and constructs a LocalDateTime
     * object.
     *
     * @param rootNode the JSON node containing the timestamp components
     * @return the LocalDateTime object representing the parsed timestamp
     * @throws IOException if there are issues with parsing the timestamp components
     */
    private LocalDateTime parseTimeStamp(JsonNode rootNode) throws IOException {

        List<Integer> a = new ArrayList<Integer>();
        for (Iterator<JsonNode> it = rootNode.get("timestamp").elements(); it.hasNext(); ) {
            JsonNode node = it.next();

            int dateTimeComponent = (Integer) node.numberValue();
            a.add(dateTimeComponent);
        }

        if (a.size() != 6) {
            throw new IOException(
                    "Invalid \"timestamp\" format when deserializing \"CdssUsage\". Expected \"[year,month,day,hour,minute,second]\", where all elements are integers");
        }

        LocalDateTime timestamp = LocalDateTime.of(a.get(0), a.get(1), a.get(2), a.get(3), a.get(4), a.get(5));

        return timestamp;
    }

    /**
     * Parses the "recommendations" field from the provided JSON node, extracting each recommendation
     * along with its priority. The recommendations are stored in a TreeMap to maintain order by priority.
     * Returns a list of recommendations sorted by their priority.
     *
     * @param rootNode the JSON node containing the "recommendations" array
     * @return a list of recommendations sorted by priority
     * @throws RuntimeException if any recommendation or priority is null
     */
    private List<String> parseRecommendations(JsonNode rootNode) {

        TreeMap<Integer, String> recomendations = new TreeMap<>();

        for (Iterator<JsonNode> it = ((ArrayNode) rootNode.get("recommendations")).elements(); it.hasNext(); ) {
            JsonNode node = it.next();

            Integer priority = null;
            String recommendation = null;
            for (Iterator<Map.Entry<String, JsonNode>> fields = node.fields(); fields.hasNext(); ) {
                Map.Entry<String, JsonNode> entry = fields.next();

                if (entry.getKey().equalsIgnoreCase("priority")) {
                    priority = entry.getValue().asInt();
                } else if (entry.getKey().equalsIgnoreCase("recommendation")) {
                    recommendation = entry.getValue().asText();
                }
            }

            if (priority == null || recommendation == null) {
                throw new RuntimeException("Parsing recommendations resulted in null values!");
            }
            recomendations.put(priority, recommendation);
        }

        return new ArrayList<String>(recomendations.values());
    }
}
