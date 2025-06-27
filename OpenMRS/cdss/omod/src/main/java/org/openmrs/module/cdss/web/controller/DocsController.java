package org.openmrs.module.cdss.web.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DocsController extends CdssRestController {


    @GetMapping(value = {"/cdss/docs.form"}, produces = {MediaType.TEXT_HTML_VALUE})
    public String index() {
        return "module/cdss/docs/index";
    }


    @GetMapping(value = {"/cdss/docs/rule-service.form"}, produces = {MediaType.TEXT_HTML_VALUE})
    public String ruleService() {
        return "module/cdss/docs/rule-service";
    }

    @GetMapping(value = {"/cdss/docs/cdss-service.form"}, produces = {MediaType.TEXT_HTML_VALUE})
    public String cdssService() {
        return "module/cdss/docs/cdss-service";
    }

    @GetMapping(value = "/cdss/docs/rule-service-openapi.form", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String ruleApi() {

        return "openapi: \"3.1.0\"\n" +
                "info:\n" +
                "  title: \"cdss API\"\n" +
                "  description: \"cdss API\"\n" +
                "  version: \"1.0.0\"\n" +
                "servers:\n" +
                "  - url: \"https://cdss\"\n" +
                "paths:\n" +
                "  /openmrs/cdss/cql-rule/id/{ruleId}.form:\n" +
                "    get:\n" +
                "      summary: \"GET openmrs/cdss/cql-rule/id/{ruleId}.form\"\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"\n" +
                "  /openmrs/cdss/disable-rule/id/{ruleId}.form:\n" +
                "    post:\n" +
                "      summary: \"POST openmrs/cdss/disable-rule/id/{ruleId}.form\"\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"\n" +
                "  /openmrs/cdss/elm-rule/id/{ruleId}.form:\n" +
                "    get:\n" +
                "      summary: \"GET openmrs/cdss/elm-rule/id/{ruleId}.form\"\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"\n" +
                "  /openmrs/cdss/elm-rule/idOrName/{ruleId}.form:\n" +
                "    get:\n" +
                "      summary: \"GET openmrs/cdss/elm-rule/idOrName/{ruleId}.form\"\n" +
                "      parameters:\n" +
                "        - name: \"version\"\n" +
                "          in: \"query\"\n" +
                "          required: false\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"\n" +
                "  /openmrs/cdss/enable-rule/id/{ruleId}.form:\n" +
                "    post:\n" +
                "      summary: \"POST openmrs/cdss/enable-rule/id/{ruleId}.form\"\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"\n" +
                "  /openmrs/cdss/modify-rule.form:\n" +
                "    post:\n" +
                "      summary: \"POST openmrs/cdss/modify-rule.form\"\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"\n" +
                "  /openmrs/cdss/rule-manifest.form:\n" +
                "    get:\n" +
                "      summary: \"GET openmrs/cdss/rule-manifest.form\"\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"\n" +
                "  /openmrs/cdss/rule.form:\n" +
                "    get:\n" +
                "      summary: \"GET openmrs/cdss/rule.form\"\n" +
                "      parameters:\n" +
                "        - name: \"allRules\"\n" +
                "          in: \"query\"\n" +
                "          required: false\n" +
                "        - name: \"role\"\n" +
                "          in: \"query\"\n" +
                "          required: false\n" +
                "        - name: \"showNames\"\n" +
                "          in: \"query\"\n" +
                "          required: false\n" +
                "        - name: \"showVersions\"\n" +
                "          in: \"query\"\n" +
                "          required: false\n" +
                "      responses:\n" +
                "        \"200\":\n" +
                "          description: \"OK\"";
    }

    @GetMapping(value = "/cdss/docs/cdss-service-openapi.form", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String cdssApi() {

        return "openapi: 3.0.3\n" +
                "info:\n" +
                "  title: CDSS Clientside API\n" +
                "  description: API endpoints for the Clinical Decision Support System (CDSS) for clientside operations.\n" +
                "  version: 1.0.0\n" +
                "paths:\n" +
                "  /cdss/record-usage.form:\n" +
                "    post:\n" +
                "      summary: Record CDSS usage\n" +
                "      description: Records the usage of a Clinical Decision Support System (CDSS) based on the provided newUsageString.\n" +
                "      requestBody:\n" +
                "        required: true\n" +
                "        content:\n" +
                "          application/json:\n" +
                "            schema:\n" +
                "              type: string\n" +
                "              description: JSON string representing the new CdssUsage to be recorded.\n" +
                "      responses:\n" +
                "        '200':\n" +
                "          description: Successfully recorded CDSS usage.\n" +
                "          content:\n" +
                "            application/json:\n" +
                "              schema:\n" +
                "                type: string\n" +
                "                description: JSON string of the saved CdssUsage.\n" +
                "        '500':\n" +
                "          description: Internal error encountered during processing.\n" +
                "\n" +
                "  /cdss/usages.form:\n" +
                "    get:\n" +
                "      summary: Get CDSS usage records\n" +
                "      description: Retrieves the list of CdssUsage objects and serializes them into a JSON string.\n" +
                "      responses:\n" +
                "        '200':\n" +
                "          description: Successfully retrieved CDSS usage records.\n" +
                "          content:\n" +
                "            application/json:\n" +
                "              schema:\n" +
                "                type: array\n" +
                "                items:\n" +
                "                  type: object\n" +
                "                  description: CdssUsage object.\n" +
                "        '500':\n" +
                "          description: Internal error encountered during processing.\n" +
                "\n" +
                "  /cdss/RetrieveSvsValueSet.form:\n" +
                "    get:\n" +
                "      summary: Retrieve SVS value sets\n" +
                "      description: Retrieves the valuesets based on the provided id and version.\n" +
                "      parameters:\n" +
                "        - name: id\n" +
                "          in: query\n" +
                "          required: true\n" +
                "          schema:\n" +
                "            type: string\n" +
                "          description: The unique identifier of the valueset to retrieve.\n" +
                "        - name: version\n" +
                "          in: query\n" +
                "          required: false\n" +
                "          schema:\n" +
                "            type: string\n" +
                "          description: The version of the valueset (optional).\n" +
                "      responses:\n" +
                "        '200':\n" +
                "          description: Successfully retrieved valueset.\n" +
                "          content:\n" +
                "            application/xml:\n" +
                "              schema:\n" +
                "                type: string\n" +
                "                description: The content of the retrieved valueset.\n" +
                "        '500':\n" +
                "          description: Internal error encountered during processing.\n" +
                "\n" +
                "  /cdss/RetrieveFhirValueSet/{id}.form:\n" +
                "    get:\n" +
                "      summary: Retrieve FHIR value sets\n" +
                "      description: Retrieves FHIR value sets based on the provided id, version, and offset.\n" +
                "      parameters:\n" +
                "        - name: id\n" +
                "          in: path\n" +
                "          required: true\n" +
                "          schema:\n" +
                "            type: string\n" +
                "          description: The unique identifier of the value set to retrieve.\n" +
                "        - name: version\n" +
                "          in: query\n" +
                "          required: false\n" +
                "          schema:\n" +
                "            type: string\n" +
                "          description: The version of the value set (optional).\n" +
                "        - name: offset\n" +
                "          in: query\n" +
                "          required: false\n" +
                "          schema:\n" +
                "            type: integer\n" +
                "          description: The offset for pagination (optional).\n" +
                "      responses:\n" +
                "        '200':\n" +
                "          description: Successfully retrieved FHIR value set.\n" +
                "          content:\n" +
                "            application/json:\n" +
                "              schema:\n" +
                "                type: string\n" +
                "                description: The content of the retrieved value set.\n" +
                "        '500':\n" +
                "          description: Internal error encountered during processing.";
    }

}
