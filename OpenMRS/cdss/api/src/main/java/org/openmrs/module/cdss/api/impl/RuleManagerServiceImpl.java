package org.openmrs.module.cdss.api.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import lombok.Getter;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.AdministrationService;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.*;
import org.openmrs.module.cdss.api.exception.RuleNotEnabledException;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;
import org.openmrs.module.cdss.api.serialization.RuleManifestDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.openmrs.module.cdss.CDSSUtil.encodeCql;


public class RuleManagerServiceImpl extends BaseOpenmrsService implements RuleManagerService {

    // The directory where ELM rules are stored
    private static final String RULE_DIRECTORY_PATH = "rules/";
    // The path to rule manifest file
    private static final String RULE_MANIFEST_PATH = "rules/rule-manifest.json";
    private final Logger log = Logger.getLogger(getClass());
    @Autowired
    @Qualifier("adminService")
    protected AdministrationService administrationService;
    @Getter
    private RuleManifest ruleManifest;
    private ObjectMapper objectMapper;
    private OkHttpClient client;

    /**
     * Logic that is run when this service is started. At the moment, this method is not used.
     */
    @Override
    public void onStartup() {
        log.info("CDSS Vaccine Manager service started...");
        if (client == null) {
            client = new OkHttpClient();
        }
        objectMapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addDeserializer(RuleManifest.class, new RuleManifestDeserializer());
        objectMapper.registerModule(simpleModule);

        try {
            setUpDirectoryHierarchy();
            readManifest();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Logic that is run when this service is stopped. At the moment, this method is not used.
     */
    @Override
    public void onShutdown() {
        log.info("CDSS Vaccine Manager service stopped...");
        client = null;
        writeManifest();
    }


    @Override
    public List<String> getLoadedVaccineRulesets() {
        return CDSSConfig.VACCINE_CODES;
    }


    /**
     * Retrieves an array of IDs for all enabled rules from the rule manifest.
     *
     * @return An array of strings containing the IDs of enabled rules.
     * @throws APIAuthenticationException If there is an authentication issue.
     */
    @Override
    public List<String> getEnabledRules() throws APIAuthenticationException {
        return ruleManifest.getRules().stream().filter(e -> e.isEnabled()).map(e -> e.getId()).collect(Collectors.toList());
    }

//    @Override
//    public List<String> getEnabledRules(RuleRole role) throws APIAuthenticationException {
//        return ruleManifest.getRules().stream().filter(e -> e.isEnabled()).filter(e -> e.getRole() == role).map(e -> e.getId()).collect(Collectors.toList());
//    }

    public List<String> getEnabledRules(RuleRole role, RuleIdentifierType identifierType) throws APIAuthenticationException {

        if (role == null && identifierType == null) {
            return ruleManifest.getRules().stream().filter(e -> e.isEnabled()).map(e -> e.getId()).collect(Collectors.toList());
        } else if (role != null && identifierType == null) {
            return ruleManifest.getRules().stream().filter(e -> e.isEnabled()).filter(e -> e.getRole() == role).map(e -> e.getId()).collect(Collectors.toList());
        } else if (role == null && identifierType != null) {
            if (identifierType == RuleIdentifierType.RULE_ID)
                return ruleManifest.getRules().stream().filter(e -> e.isEnabled()).map(e -> e.getId()).collect(Collectors.toList());
            else if (identifierType == RuleIdentifierType.LIBRARY_NAME)
                return ruleManifest.getRules().stream().filter(e -> e.isEnabled()).map(e -> e.getLibraryName()).collect(Collectors.toList());
        }

        return ruleManifest.getRules().stream().filter(e -> e.isEnabled()).filter(e -> e.getRole().equals(role)).map(e -> e.getId()).collect(Collectors.toList());


    }


    /**
     * Retrieves an array of all rule IDs from the rule manifest.
     *
     * @return An array of strings containing the IDs of all rules.
     * @throws APIAuthenticationException If there is an authentication issue.
     */
    @Override
    public List<String> getAllRules() throws APIAuthenticationException {
        return ruleManifest.getRules().stream().map(e -> e.getId()).collect(Collectors.toList());
    }


    /**
     * Retrieves a list of rule IDs that match the specified role from the rule manifest.
     *
     * @param role The role to filter rules by.
     * @return A list of strings containing the IDs of rules with the specified role.
     * @throws APIAuthenticationException If there is an authentication issue.
     */
//    public List<String> getAllRules(RuleRole role) throws APIAuthenticationException {
//        if (role == null)
//            return getAllRules();
//        return ruleManifest.getRules().stream().filter(e -> e.getRole().equals(role)).map(e -> e.getId()).collect(Collectors.toList());
//    }
    public List<String> getAllRules(RuleRole role, RuleIdentifierType identifierType) throws APIAuthenticationException {

        if (role == null && identifierType == null) {
            return ruleManifest.getRules().stream().map(e -> e.getId()).collect(Collectors.toList());
        } else if (role != null && identifierType == null) {
            return ruleManifest.getRules().stream().filter(e -> e.getRole() == role).map(e -> e.getId()).collect(Collectors.toList());
        } else if (role == null && identifierType != null) {
            if (identifierType == RuleIdentifierType.RULE_ID)
                return ruleManifest.getRules().stream().map(e -> e.getId()).collect(Collectors.toList());
            else if (identifierType == RuleIdentifierType.LIBRARY_NAME)
                return ruleManifest.getRules().stream().map(e -> e.getLibraryName()).collect(Collectors.toList());
        }

        return ruleManifest.getRules().stream().filter(e -> e.getRole().equals(role)).map(e -> e.getId()).collect(Collectors.toList());


    }

    @Override
    public Boolean enableRule(String ruleId, RuleIdentifierType identifierType) throws APIAuthenticationException, RuleNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptor(ruleId, identifierType);

        descriptor.setEnabled(true);
        return true;
    }

    @Override
    public Boolean disableRule(String ruleId, RuleIdentifierType identifierType) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptor(ruleId, identifierType);

        descriptor.setEnabled(false);
        return true;
    }


    /**
     * Retrieves the ELM content of a rule specified by its ID.
     *
     * @param ruleId The identifier of the rule to retrieve.
     * @return The ELM content of the rule as a string.
     * @throws RuleNotEnabledException    If the rule is not enabled.
     * @throws APIAuthenticationException If there is an authentication issue.
     * @throws RuleNotFoundException      If the rule or its file is not found.
     * @throws FileNotFoundException      If the ELM file does not exist.
     */
    @Override
    public String getElmRule(String ruleId, RuleIdentifierType identifierType) throws RuleNotEnabledException, APIAuthenticationException, RuleNotFoundException, FileNotFoundException {


        RuleDescriptor descriptor = getRuleDescriptor(ruleId, identifierType);
        String path = RULE_DIRECTORY_PATH + descriptor.getElmFilePath();
        if (!descriptor.isEnabled()) {
            throw new RuleNotEnabledException(ruleId);
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(ruleId, path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return result;


    }


    /**
     * Retrieves the CQL content of a rule specified by its ID.
     *
     * @param ruleId The identifier of the rule to retrieve.
     * @return The CQL content of the rule as a string.
     * @throws RuleNotEnabledException    If the rule is not enabled.
     * @throws APIAuthenticationException If there is an authentication issue.
     * @throws NullPointerException       If the rule ID is null.
     * @throws RuleNotFoundException      If the rule or its file is not found.
     * @throws FileNotFoundException      If the CQL file does not exist.
     */
    @Override
    public String getCqlRule(String ruleId, RuleIdentifierType identifierType) throws RuleNotEnabledException, APIAuthenticationException, NullPointerException, RuleNotFoundException, FileNotFoundException {

        RuleDescriptor descriptor = getRuleDescriptor(ruleId, identifierType);
        String path = RULE_DIRECTORY_PATH + descriptor.getCqlFilePath();
        if (!descriptor.isEnabled()) {
            throw new RuleNotEnabledException(ruleId);
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(ruleId, path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return result;

    }


    /**
     * Checks if a rule with the specified ID exists in the rule manifest.
     *
     * @param ruleId The identifier of the rule to check for existence.
     * @return true if the rule exists, false otherwise.
     */
    private boolean doesRuleExist(String ruleId, RuleIdentifierType identifierType) {
        if (identifierType == RuleIdentifierType.RULE_ID)
            return ruleManifest.getRules().stream().anyMatch(e -> e.getId().equals(ruleId));
        else if (identifierType == RuleIdentifierType.LIBRARY_NAME)
            return ruleManifest.getRules().stream().anyMatch(e -> e.getLibraryName().equals(ruleId));
        return false;
    }


    private RuleDescriptor getRuleDescriptor(String ruleId, RuleIdentifierType identifierType) throws RuleNotFoundException {
        return ruleManifest.getRule(ruleId, identifierType);
    }


    /**
     * Writes the current rule manifest to a file specified by RULE_MANIFEST_PATH.
     * Logs the process of writing the file and handles exceptions by throwing a RuntimeException.
     *
     * @throws RuntimeException If a FileNotFoundException, StreamWriteException,
     *                          DatabindException, or IOException occurs during the write operation.
     */
    private void writeManifest() {

        File f = new File(RULE_MANIFEST_PATH);
        OutputStream outputStream = null;

        log.debug("CDSS Writing rule manifest file: " + f.getAbsolutePath());

        try {
            outputStream = new FileOutputStream(f);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(outputStream, ruleManifest);

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (StreamWriteException e) {
            throw new RuntimeException(e);
        } catch (DatabindException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        log.debug("CDSS Successfully wrote manifest file: " + f.getAbsolutePath());
    }


    /**
     * Reads the rule manifest file from the specified path and deserializes its content
     * into a RuleManifest object. Logs the process of reading the file and handles
     * exceptions by throwing a RuntimeException.
     */
    private void readManifest() {
        File f = new File(RULE_MANIFEST_PATH);

        log.debug("CDSS Reading rule manifest file: " + f.getAbsolutePath());

        try {
            String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
            ruleManifest = objectMapper.readValue(result, RuleManifest.class);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        log.debug("CDSS Successfully read manifest file: " + f.getAbsolutePath());

    }


    /**
     * Sets up the directory hierarchy for rule files by creating necessary directories
     * and copying the rule manifest and associated ELM and CQL files from resources.
     * If the manifest file already exists, it skips copying.
     *
     * @throws IOException If an I/O error occurs during directory creation or file copying.
     */
    private void setUpDirectoryHierarchy() throws IOException {

        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        URL ruleManifestUrl = classloader.getResource(RULE_MANIFEST_PATH);
        File ruleManifestFile = new File(RULE_MANIFEST_PATH);

        if (ruleManifestFile.exists()) {
            return;
        }
        Files.createDirectories(Paths.get(ruleManifestFile.getParent()));
        try {
            Path result = Files.copy(Paths.get(ruleManifestUrl.getPath()), Paths.get(ruleManifestFile.getAbsolutePath()), StandardCopyOption.REPLACE_EXISTING);

        } catch (FileAlreadyExistsException e) {
            // Manifest file already exists, nothing to do more
            return;
        }

        readManifest();
        for (RuleDescriptor ruleDescriptor : ruleManifest.getRules()) {
            log.debug("CDSS Attempting to copy " + ruleDescriptor.getId() + "-" + ruleDescriptor.getVersion());

            URL elmUrl = classloader.getResource(RULE_DIRECTORY_PATH + ruleDescriptor.getElmFilePath());
            URL cqlUrl = classloader.getResource(RULE_DIRECTORY_PATH + ruleDescriptor.getCqlFilePath());
            File elmFile = new File(RULE_DIRECTORY_PATH + ruleDescriptor.getElmFilePath());
            File cqlFile = new File(RULE_DIRECTORY_PATH + ruleDescriptor.getCqlFilePath());

            Files.createDirectories(Paths.get(elmFile.getParent()));
            Files.createDirectories(Paths.get(cqlFile.getParent()));

            Files.copy(Paths.get(elmUrl.getPath()), Paths.get(elmFile.getAbsolutePath()), StandardCopyOption.REPLACE_EXISTING);
            Files.copy(Paths.get(cqlUrl.getPath()), Paths.get(cqlFile.getAbsolutePath()), StandardCopyOption.REPLACE_EXISTING);

        }
    }


    /**
     * Creates a new rule with the specified parameters, saving its CQL and ELM content to files.
     * If a rule with the same ID already exists, a new unique ID is generated.
     *
     * @param ruleId      The identifier for the new rule.
     * @param version     The version of the rule.
     * @param description A description of the rule.
     * @param params      A map of parameters associated with the rule.
     * @param role        The role of the rule, either SUPPORT or RULE.
     * @param cql         The CQL content of the rule.
     * @param elm         The ELM content of the rule.
     * @return True if the rule is successfully created and added to the manifest, false otherwise.
     * @throws IOException      If an I/O error occurs during file operations.
     * @throws RuntimeException If any of the required parameters (ruleId, cql, elm) are null.
     */
    private Boolean createRule(String ruleId, String description, Map<String, ParamDescriptor> params, RuleRole role, String cql, String elm) throws IOException {

        if (ruleId == null) {
            throw new RuntimeException("Rule id is null");
        }
        if (cql == null) {
            throw new RuntimeException("CQL is null");
        }
        if (elm == null) {
            throw new RuntimeException("Elm is null");
        }
        RuleDescriptor originalRule = getRuleDescriptor(ruleId, RuleIdentifierType.RULE_ID);
        if (originalRule == null) {
            throw new RuleNotFoundException(ruleId);
        }


        // TODO Change to timestamp
        int count = 1;
        String newLibraryName = originalRule.getLibraryName() + "_" + count;
        while (doesRuleExist(newLibraryName, RuleIdentifierType.LIBRARY_NAME)) {
            newLibraryName = newLibraryName + "_" + count;
            count++;
        }

        String newVersion = originalRule.getVersion();

        String cqlFilePath = String.format("cql/%s.cql", newLibraryName);
        String elmFilePath = String.format("elm/%s.json", newLibraryName);

        String newRuleId = UUID.randomUUID().toString();
        RuleDescriptor descriptor = new RuleDescriptor(newRuleId, newLibraryName, newVersion, cqlFilePath, elmFilePath, role);
        descriptor.setEnabled(true);
        descriptor.setParams(params);
        descriptor.setDescription(description);
        descriptor.setDerivedFrom(ruleId);

        disableRule(ruleId, RuleIdentifierType.RULE_ID);


        File cqlFile = new File(RULE_DIRECTORY_PATH + cqlFilePath);
        log.debug("cqlFilePath: " + cqlFile.getPath());

        if (cqlFile.exists()) {
            cqlFile.delete();
        }
        if (!cqlFile.exists()) {
            Files.createDirectories(cqlFile.getParentFile().toPath());
            cqlFile.createNewFile();
        }

        FileWriter cqlFileWriter = new FileWriter(cqlFile);

        cqlFileWriter.write(cql);
        cqlFileWriter.close();

        File elmFile = new File(RULE_DIRECTORY_PATH + elmFilePath);
        log.debug("elmFilePath: " + elmFile.getPath());
        log.debug("elmFile.exists(): " + elmFile.exists());

        if (elmFile.exists()) {
            Boolean success = elmFile.delete();
            log.debug("Success in deleting " + elmFile.getAbsoluteFile() + " : " + success);
        }
        if (!elmFile.exists()) {
            log.debug("Creating new" + elmFile.getAbsoluteFile());

            Files.createDirectories(elmFile.getParentFile().toPath());
            Boolean success = elmFile.createNewFile();
            log.debug("Success in creating " + elmFile.getAbsoluteFile() + " : " + success);
        }


        FileWriter elmFileWriter = new FileWriter(elmFile);

        elmFileWriter.write(elm);
        elmFileWriter.close();

        Boolean addSuccess = ruleManifest.addRule(descriptor);
        if (addSuccess) {
            log.debug("Saving rule " + newRuleId + " --> " + descriptor.getLibraryName() + " to " + RULE_DIRECTORY_PATH);

            writeManifest();
        }
        else {
            log.error("Did not save rule " + newRuleId + " --> " + descriptor.getLibraryName() + " to " + RULE_DIRECTORY_PATH);
        }
        return addSuccess;


    }


    /**
     * Modifies an existing rule by updating its parameters and translating its CQL content to ELM.
     *
     * @param originalRuleId    The identifier of the rule to be modified.
     * @param version           The version of the rule.
     * @param changedParameters A map of parameters to be updated in the rule.
     * @return True if the rule is successfully modified and saved, false otherwise.
     * @throws JsonProcessingException If there is an error processing JSON content.
     * @throws FileNotFoundException   If the CQL rule file is not found.
     * @throws RuleNotFoundException   If the specified rule is not found.
     */
    public Boolean modifyRule(String originalRuleId, Map<String, ParamDescriptor> changedParameters) throws IOException {

        log.debug("CDSS Attempting to modify rule " + originalRuleId);
        String modificationServiceUrl = getRuleModificationServiceUrl();


        RuleDescriptor originalRule = getRuleDescriptor(originalRuleId, RuleIdentifierType.RULE_ID);


        if (originalRule == null) {
            throw new RuleNotFoundException(originalRuleId);
        }
        String cqlContent = getCqlRule(originalRuleId, RuleIdentifierType.RULE_ID);

        ModifyRuleRequest modifyRuleRequest = new ModifyRuleRequest();
        modifyRuleRequest.setRule(new ModifyRuleRequestRuleDescriptor(originalRuleId, originalRule.getLibraryName(), originalRule.getVersion(), encodeCql(cqlContent)));

        // Copy params from original rule
        for (Map.Entry<String, ParamDescriptor> pair : originalRule.getParams().entrySet()) {
            String name = pair.getKey();
            ParamDescriptor paramDescriptor = pair.getValue();
            if (!changedParameters.containsKey(name)) {
                log.debug(paramDescriptor);
                changedParameters.put(name, paramDescriptor);
            }
        }

        modifyRuleRequest.setParams(changedParameters);


        String stringBody = objectMapper.writeValueAsString(modifyRuleRequest);

        log.debug("Created body for injection\n " + stringBody);
        String resultString = callModificationService(modificationServiceUrl + "api/inject", stringBody);
        log.debug("Got result from injection: " + resultString);

        ModifyRuleRequest result = objectMapper.readValue(resultString, ModifyRuleRequest.class);
        String cql = result.getRule().getCqlContent();
        log.debug("new cql: " + cql);


        log.debug("Translating");
        String elm = translate(originalRuleId, cql);
        log.debug("Got result from translation: " + elm);


        return createRule(originalRuleId, originalRule.getDescription(), changedParameters, RuleRole.RULE, cql, elm);


    }


    /**
     * Translates a given CQL rule into its corresponding ELM representation by calling an external service.
     *
     * @param ruleId  The identifier of the rule to be translated.
     * @param version The version of the rule.
     * @param cql     The CQL content of the rule.
     * @return The translated ELM content as a string.
     * @throws JsonProcessingException If there is an error processing JSON content.
     * @throws FileNotFoundException   If the CQL rule file is not found.
     * @throws RuleNotFoundException   If the specified rule is not found.
     */
    private String translate(String ruleId, String cql) throws IOException {
        RuleDescriptor originalRuleDescriptor = getRuleDescriptor(ruleId, RuleIdentifierType.RULE_ID);

        String modificationServiceUrl = getRuleModificationServiceUrl();
        HashMap<String, ModifyRuleRequestRuleDescriptor> libraries = new HashMap<>();
        // TODO how to manage dependency libraries?
//        libraries.put("MMR_Common_Library", new ModifyRuleRequestRuleDescriptor("MMR_Common_Library", "1", encodeCql(getCqlRule("MMR_Common_Library"))));

        ModifyRuleRequest translateRuleRequest = new ModifyRuleRequest();
        translateRuleRequest.setRule(new ModifyRuleRequestRuleDescriptor(ruleId, originalRuleDescriptor.getLibraryName(), originalRuleDescriptor.getVersion(), encodeCql(cql)));
        translateRuleRequest.setLibraries(libraries);


        String stringBody = objectMapper.writeValueAsString(translateRuleRequest);

        String resultString = callModificationService(modificationServiceUrl + "api/translate", stringBody);
        return resultString;
    }


    /**
     * Calls an external modification service using a POST request with the specified URL and JSON body.
     *
     * @param url  The URL of the modification service to be called.
     * @param body The JSON body to be sent in the POST request.
     * @return The response body as a string if the request is successful (HTTP status code 200).
     * @throws RuntimeException If the service returns a non-200 status code or if an IOException occurs.
     */
    private String callModificationService(String url, String body) throws IOException {
        if (client == null) {
            client = new OkHttpClient();
        }

        okhttp3.RequestBody body1 = okhttp3.RequestBody.create(MediaType.parse("application/json"), body);
        Request rq = new Request.Builder().post(body1).url(url).build();

        Response rs = client.newCall(rq).execute();

        if (rs.code() == 200) {
            String resultString = rs.body().string();
            rs.body().close();
            return resultString;
        }

        log.error("RuleModification Service returned " + rs.code() + " " + rs.body().string());
        throw new RuntimeException("RuleModification Service returned " + rs.code() + " " + rs.body().string());


    }

    private String getRuleModificationServiceUrl() throws IOException {
        String modificationServiceUrl = administrationService.getGlobalProperty("cdss.ruleModificationServiceUrl");
        if (modificationServiceUrl == null || modificationServiceUrl.isEmpty()) {
            throw new IOException("Rule modification service url is null! Check the 'ruleModificationServiceUrl' global property");
        }
        try {
            URL url = new URL(modificationServiceUrl);
        } catch (MalformedURLException e) {
            throw new IOException("URL for the rule modification service is invalid! Check the 'ruleModificationServiceUrl' global property");
        }
        if (!modificationServiceUrl.endsWith("/")) {
            modificationServiceUrl = modificationServiceUrl + "/";
        }
        return modificationServiceUrl;
    }

}
