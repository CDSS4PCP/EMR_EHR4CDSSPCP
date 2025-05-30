package org.openmrs.module.cdss.api.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.openmrs.module.cdss.api.data.criteria.RuleCriteria;
import org.openmrs.module.cdss.api.data.criteria.projection.IdProjection;
import org.openmrs.module.cdss.api.exception.MultipleRulesFoundException;
import org.openmrs.module.cdss.api.exception.RuleNotEnabledException;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;
import org.semver4j.Semver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

import static org.openmrs.module.cdss.CDSSUtil.encodeCql;


public class RuleManagerServiceImpl extends BaseOpenmrsService implements RuleManagerService {

    // The directory where ELM rules are stored
    private static final String RULE_DIRECTORY_PATH = "rules/";
    private static final String ARCHIVE_DIRECTORY_PATH = "rules/archive/";
    // The path to rule manifest file
    private static final String RULE_MANIFEST_PATH = "rules/rule-manifest.json";
    private final Logger log = Logger.getLogger(getClass());

    @Autowired
    @Qualifier("adminService")
    protected AdministrationService administrationService;

    @Getter
    private RuleManifest ruleManifest;

    @Autowired
    @Qualifier("objectMapper")
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
//        objectMapper = new ObjectMapper();
//        SimpleModule simpleModule = new SimpleModule();
//        simpleModule.addDeserializer(RuleManifest.class, new RuleManifestDeserializer());
//        objectMapper.registerModule(simpleModule);

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
        RuleCriteria ruleCriteria = new RuleCriteria();
        ruleCriteria.setEnabled(true);
        List<RuleDescriptor> rules = getAllRules(ruleCriteria);

        return ruleCriteria.applyProjection(rules, new IdProjection());
    }

    public List<String> getEnabledRules(RuleRole role) throws APIAuthenticationException {
        RuleCriteria ruleCriteria = new RuleCriteria();
        ruleCriteria.setEnabled(true);
        ruleCriteria.setRole(role);
        List<RuleDescriptor> rules = getAllRules(ruleCriteria);

        return ruleCriteria.applyProjection(rules, new IdProjection());

    }

    @Override
    public Optional<String> getElmRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {

        RuleDescriptor rule = getRuleDescriptorById(ruleId);
        String path = RULE_DIRECTORY_PATH + rule.getElmFilePath();
        if (!rule.isEnabled()) {
            throw new RuleNotEnabledException(ruleId);
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(ruleId, path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return Optional.of(result);
    }

    @Override
    public Optional<String> getCqlRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {

        RuleDescriptor rule = getRuleDescriptorById(ruleId);

        String path = RULE_DIRECTORY_PATH + rule.getCqlFilePath();
        if (!rule.isEnabled()) {
            throw new RuleNotEnabledException(ruleId);
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(ruleId, path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return Optional.of(result);
    }

    @Override
    public Optional<String> getElmRuleByName(String ruleName) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {

        RuleDescriptor rule = getRuleDescriptorByName(ruleName);

        String path = RULE_DIRECTORY_PATH + rule.getElmFilePath();
        if (!rule.isEnabled()) {
            throw new RuleNotEnabledException(rule.getId());
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(rule.getId(), path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return Optional.of(result);
    }

    @Override
    public Optional<String> getCqlRuleByName(String ruleName) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        RuleDescriptor rule = getRuleDescriptorByName(ruleName);

        String path = RULE_DIRECTORY_PATH + rule.getCqlFilePath();
        if (!rule.isEnabled()) {
            throw new RuleNotEnabledException(rule.getId());
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(rule.getId(), path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return Optional.of(result);
    }

    @Override
    public Optional<String> getElmRuleByNameVersion(String ruleName, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        RuleDescriptor rule = getRuleDescriptorByName(ruleName, version);

        String path = RULE_DIRECTORY_PATH + rule.getElmFilePath();
        if (!rule.isEnabled()) {
            throw new RuleNotEnabledException(rule.getId());
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(rule.getId(), path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return Optional.of(result);
    }

    @Override
    public Optional<String> getCqlRuleByNameVersion(String ruleName, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        RuleDescriptor rule = getRuleDescriptorByName(ruleName, version);

        String path = RULE_DIRECTORY_PATH + rule.getCqlFilePath();
        if (!rule.isEnabled()) {
            throw new RuleNotEnabledException(rule.getId());
        }
        File f = new File(path);
        if (!f.exists()) {
            throw new RuleNotFoundException(rule.getId(), path);
        }
        String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
        return Optional.of(result);
    }


    /**
     * Retrieves an array of all rule IDs from the rule manifest.
     *
     * @return An array of strings containing the IDs of all rules.
     * @throws APIAuthenticationException If there is an authentication issue.
     */
    @Override
    public List<String> getAllRules() throws APIAuthenticationException {
        RuleCriteria criteria = new RuleCriteria();
        List<RuleDescriptor> rules = getAllRules(criteria);
        return criteria.applyProjection(rules, new IdProjection());
    }

    @Override
    public List<RuleDescriptor> getAllRules(RuleCriteria ruleCriteria) throws APIAuthenticationException {
        List<RuleDescriptor> rules = ruleManifest.getRules();

        return ruleCriteria.applyFilters(rules);
    }
//    @Override
    public List<RuleDescriptor> getAllArchivedRules(RuleCriteria ruleCriteria) throws APIAuthenticationException {
        List<RuleDescriptor> rules = ruleManifest.getArchivedRules();

        return ruleCriteria.applyFilters(rules);
    }


    @Override
    public Optional<String> enableRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptorById(ruleId);


        if (descriptor != null) {
            descriptor.setEnabled(true);
            return Optional.of(descriptor.getId());
        }
        return Optional.empty();
    }

    @Override
    public Optional<String> enableRuleByName(String name) throws APIAuthenticationException, RuleNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptorByName(name);


        if (descriptor != null) {
            descriptor.setEnabled(true);
            return Optional.of(descriptor.getId());
        }
        return Optional.empty();
    }


    @Override
    public Optional<String> enableRuleByNameVersion(String name, String version) throws APIAuthenticationException, RuleNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptorByName(name, version);

        if (descriptor != null) {
            descriptor.setEnabled(true);
            return Optional.of(descriptor.getId());
        }
        return Optional.empty();
    }

    @Override
    public Optional<String> disableRuleById(String ruleId) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptorById(ruleId);


        if (descriptor != null) {
            descriptor.setEnabled(false);
            return Optional.of(descriptor.getId());
        }
        return Optional.empty();
    }


    @Override
    public Optional<String> disableRuleByName(String name) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptorByName(name);


        if (descriptor != null) {
            descriptor.setEnabled(false);
            return Optional.of(descriptor.getId());
        }
        return Optional.empty();
    }


    @Override
    public Optional<String> disableRuleByNameVersion(String name, String version) throws APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        RuleDescriptor descriptor = getRuleDescriptorByName(name, version);

        if (descriptor != null) {
            descriptor.setEnabled(false);
            return Optional.of(descriptor.getId());
        }
        return Optional.empty();
    }


    /**
     * Checks if a rule with the specified ID exists in the rule manifest.
     *
     * @param ruleId The identifier of the rule to check for existence.
     * @return true if the rule exists, false otherwise.
     */
    private boolean doesRuleExistById(String ruleId) {

        RuleCriteria criteria = new RuleCriteria();
        criteria.setId(ruleId);
        List<RuleDescriptor> rules = getAllRules(criteria);

        return !rules.isEmpty();
    }

    private boolean doesRuleExistByName(String name) {

        RuleCriteria criteria = new RuleCriteria();
        criteria.setLibraryName(name);
        List<RuleDescriptor> rules = getAllRules(criteria);

        return !rules.isEmpty();
    }

    private boolean doesRuleExistByNameVersion(String name, String version) {

        RuleCriteria criteria = new RuleCriteria();
        criteria.setLibraryName(name);
        criteria.setLibraryVersion(version);
        List<RuleDescriptor> rules = getAllRules(criteria);

        return !rules.isEmpty();
    }


    private RuleDescriptor getRuleDescriptorById(String ruleId) throws RuleNotFoundException {

        RuleCriteria ruleCriteria = new RuleCriteria();
        ruleCriteria.setId(ruleId);

        List<RuleDescriptor> rules = getAllRules(ruleCriteria);
        if (rules.size() <= 0) {
            throw new RuleNotFoundException(ruleId);
        }
        if (rules.size() > 1) {
            throw new MultipleRulesFoundException(rules);
        }
        RuleDescriptor rule = rules.get(0);
        return rule;

    }


    private RuleDescriptor getRuleDescriptorByName(String name) throws RuleNotFoundException {

        RuleCriteria ruleCriteria = new RuleCriteria();
        ruleCriteria.setLibraryName(name);

        List<RuleDescriptor> rules = getAllRules(ruleCriteria);
        if (rules.size() <= 0) {
            throw new RuleNotFoundException(name);
        }
        if (rules.size() > 1) {
            throw new MultipleRulesFoundException(rules);
        }
        RuleDescriptor rule = rules.get(0);
        return rule;

    }

    private RuleDescriptor getRuleDescriptorByName(String name, String version) throws RuleNotFoundException {

        RuleCriteria ruleCriteria = new RuleCriteria();
        ruleCriteria.setLibraryName(name);
        ruleCriteria.setLibraryVersion(version);

        List<RuleDescriptor> rules = getAllRules(ruleCriteria);
        if (rules.size() <= 0) {
            throw new RuleNotFoundException(name);
        }
        if (rules.size() > 1) {
            throw new MultipleRulesFoundException(rules);
        }
        RuleDescriptor rule = rules.get(0);
        return rule;

    }


    private RuleDescriptor getArchivedRuleDescriptorById(String ruleId) throws RuleNotFoundException {

        RuleCriteria ruleCriteria = new RuleCriteria();
        ruleCriteria.setId(ruleId);

        List<RuleDescriptor> rules = getAllArchivedRules(ruleCriteria);
        if (rules.size() <= 0) {
            throw new RuleNotFoundException(ruleId);
        }
        if (rules.size() > 1) {
            throw new MultipleRulesFoundException(rules);
        }
        RuleDescriptor rule = rules.get(0);
        return rule;

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
     * Modifies an existing rule by updating its parameters and creating a new version.
     *
     * @param originalRuleId    The ID of the rule to modify.
     * @param changedParameters A map of parameters to update in the rule.
     * @return The unique ID of the newly created modified rule.
     * @throws IOException           If an I/O error occurs during the modification process.
     * @throws RuleNotFoundException If the original rule is not found.
     */
    public Optional<String> modifyRule(String originalRuleId, Map<String, ParamDescriptor> changedParameters) throws IOException {

        log.debug("CDSS Attempting to modify rule " + originalRuleId);
        String modificationServiceUrl = getRuleModificationServiceUrl();

        RuleDescriptor originalRule = getRuleDescriptorById(originalRuleId);

        if (originalRule == null) {
            throw new RuleNotFoundException(originalRuleId);
        }
        Optional<String> cqlContentOptional = getCqlRuleById(originalRuleId);
        if (!cqlContentOptional.isPresent()) {
            throw new RuleNotFoundException(originalRuleId);
        }
        String cqlContent = cqlContentOptional.get();

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

        Semver semver = new Semver(originalRule.getVersion());
        semver = semver.withIncMajor(1);
        String newVersion = semver.getVersion();

        modifyRuleRequest.setParams(changedParameters);
        modifyRuleRequest.setNewLibraryVersion(newVersion);
        String stringBody = objectMapper.writeValueAsString(modifyRuleRequest);
        String resultString = callModificationService(modificationServiceUrl + "api/inject", stringBody);
        ModifyRuleRequest result = objectMapper.readValue(resultString, ModifyRuleRequest.class);
        String cql = result.getRule().getCqlContent();

        String elm = translate(originalRuleId, cql);


        return createRule(originalRule.getLibraryName(), newVersion, originalRule.getDescription(), changedParameters, RuleRole.RULE, originalRuleId, cql, elm);
    }

    /**
     * Creates a new rule with the specified parameters, saving its CQL and ELM content to files.
     * If a rule with the same ID already exists, a new unique ID is generated.
     *
     * @param libraryName    The library name for the new rule.
     * @param libraryVersion The  version for the new rule.
     * @param description    A description of the rule.
     * @param params         A map of parameters associated with the rule.
     * @param role           The role of the rule, either SUPPORT or RULE.
     * @param cql            The CQL content of the rule.
     * @param elm            The ELM content of the rule.
     * @return The unique ID of the newly created rule, or null if creation fails.
     * @throws IOException      If an I/O error occurs during file operations.
     * @throws RuntimeException If any of the required parameters (ruleId, cql, elm) are null.
     */
    public Optional<String> createRule(String libraryName, String libraryVersion, String description, Map<String, ParamDescriptor> params, RuleRole role, String derivedFrom, String cql, String elm) throws IOException {

        if (libraryName == null) {
            throw new RuntimeException("Rule id is null");
        }
        if (cql == null) {
            throw new RuntimeException("CQL is null");
        }

        String cqlFilePath = String.format("cql/%s-%s.cql", libraryName, libraryVersion);
        String elmFilePath = String.format("elm/%s-%s.json", libraryName, libraryVersion);

        String newRuleId = UUID.randomUUID().toString();
        RuleDescriptor descriptor = new RuleDescriptor(newRuleId, libraryName, libraryVersion, cqlFilePath, elmFilePath, role);
        descriptor.setEnabled(true);
        descriptor.setParams(params);
        descriptor.setDescription(description);
        descriptor.setDerivedFrom(derivedFrom);


        File cqlFile = new File(RULE_DIRECTORY_PATH + cqlFilePath);

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

        if (elm == null) {
            elm = translate(newRuleId, libraryName, libraryVersion, cql);
        }


        File elmFile = new File(RULE_DIRECTORY_PATH + elmFilePath);

        if (elmFile.exists()) {
            boolean success = elmFile.delete();
            log.debug("Success in deleting " + elmFile.getAbsoluteFile() + " : " + success);
        }
        if (!elmFile.exists()) {
            log.debug("Creating new" + elmFile.getAbsoluteFile());

            Files.createDirectories(elmFile.getParentFile().toPath());
            boolean success = elmFile.createNewFile();
            log.debug("Success in creating " + elmFile.getAbsoluteFile() + " : " + success);
        }


        FileWriter elmFileWriter = new FileWriter(elmFile);

        elmFileWriter.write(elm);
        elmFileWriter.close();

        Boolean addSuccess = ruleManifest.addRule(descriptor);
        if (addSuccess) {
            log.debug("Saving rule " + newRuleId + " --> " + descriptor.getLibraryName() + " to " + RULE_DIRECTORY_PATH);

            writeManifest();
        } else {
            log.error("Did not save rule " + newRuleId + " --> " + descriptor.getLibraryName() + " to " + RULE_DIRECTORY_PATH);
        }

        if (addSuccess) {
            return Optional.of(newRuleId);
        } else {
            return Optional.empty();
        }


    }


    public Optional<String> archiveRule(String ruleId) throws IOException {
        RuleManifest manifest = getRuleManifest();
        RuleDescriptor descriptor = getRuleDescriptorById(ruleId);
        Boolean success = manifest.archiveRule(descriptor);
        writeManifest();


        if (!success) {
            return Optional.empty();
        } else {
            return Optional.of(ruleId);
        }
    }


    public Optional<String> restoreRule(String ruleId) throws IOException {
        log.info("Restoring rule " + ruleId);
        RuleManifest manifest = getRuleManifest();
        RuleDescriptor descriptor = getArchivedRuleDescriptorById(ruleId);
        Boolean success = manifest.restoreRule(descriptor);
        writeManifest();


        if (!success) {
            return Optional.empty();
        } else {
            return Optional.of(ruleId);
        }
    }

    /**
     * Translates a given CQL rule into its corresponding ELM representation by calling an external service.
     *
     * @param ruleId The identifier of the rule to be translated.
     * @param cql    The CQL content of the rule.
     * @return The translated ELM content as a string.
     * @throws JsonProcessingException If there is an error processing JSON content.
     * @throws FileNotFoundException   If the CQL rule file is not found.
     * @throws RuleNotFoundException   If the specified rule is not found.
     */
    private String translate(String ruleId, String cql) throws IOException {
        RuleDescriptor originalRuleDescriptor = getRuleDescriptorById(ruleId);

        String modificationServiceUrl = getRuleModificationServiceUrl();
        HashMap<String, ModifyRuleRequestRuleDescriptor> libraries = new HashMap<>();
        // TODO how to manage dependency libraries?

        RuleDescriptor mmrCommon = getRuleDescriptorByName("MMR_Common_Library");
        Optional<String> mmrCommonStringOptional = getCqlRuleByName("MMR_Common_Library");
        if (!mmrCommonStringOptional.isPresent()) {
            throw new RuntimeException("MMR_Common_Library not found");
        }
        String mmrCommonString = mmrCommonStringOptional.get();
        String mmrCommonEncoded = encodeCql(mmrCommonString);
//        log.debug("mmrCommonEncoded -->\n" + mmrCommonEncoded);
//        log.debug("mmrCommonDecoded -->\n" + decodeCql(mmrCommonEncoded));

        libraries.put("MMR_Common_Library", new ModifyRuleRequestRuleDescriptor(mmrCommon.getId(), mmrCommon.getLibraryName(), mmrCommon.getVersion(), mmrCommonEncoded));

        ModifyRuleRequest translateRuleRequest = new ModifyRuleRequest();
        ModifyRuleRequestRuleDescriptor modifyRuleRequestRuleDescriptor = new ModifyRuleRequestRuleDescriptor(ruleId, originalRuleDescriptor.getLibraryName(), originalRuleDescriptor.getVersion());
        modifyRuleRequestRuleDescriptor.setCqlContent(mmrCommonString);
        translateRuleRequest.setRule(modifyRuleRequestRuleDescriptor);
        translateRuleRequest.setLibraries(libraries);


        String stringBody = objectMapper.writeValueAsString(translateRuleRequest);


//        log.debug("Sending this to translation ---> \n\n" + stringBody);

        String resultString = callModificationService(modificationServiceUrl + "api/translate", stringBody);
        return resultString;
    }


    /**
     * Translates a given CQL rule into its corresponding ELM representation by calling an external service.
     *
     * @param ruleId The identifier of the rule to be translated.
     * @param cql    The CQL content of the rule.
     * @return The translated ELM content as a string.
     * @throws JsonProcessingException If there is an error processing JSON content.
     * @throws FileNotFoundException   If the CQL rule file is not found.
     * @throws RuleNotFoundException   If the specified rule is not found.
     */
    private String translate(String ruleId, String libraryName, String libraryVersion, String cql) throws IOException {

        String modificationServiceUrl = getRuleModificationServiceUrl();
        HashMap<String, ModifyRuleRequestRuleDescriptor> libraries = new HashMap<>();
        // TODO how to manage dependency libraries?

        RuleDescriptor mmrCommon = getRuleDescriptorByName("MMR_Common_Library");
        Optional<String> mmrCommonStringOptional = getCqlRuleByName("MMR_Common_Library");
        if (!mmrCommonStringOptional.isPresent()) {
            throw new RuntimeException("MMR_Common_Library not found");
        }
        String mmrCommonString = mmrCommonStringOptional.get();

        String mmrCommonEncoded = encodeCql(mmrCommonString);
//        log.debug("mmrCommonEncoded -->\n" + mmrCommonEncoded);
//        log.debug("mmrCommonDecoded -->\n" + decodeCql(mmrCommonEncoded));

        libraries.put("MMR_Common_Library", new ModifyRuleRequestRuleDescriptor(mmrCommon.getId(), mmrCommon.getLibraryName(), mmrCommon.getVersion(), mmrCommonEncoded));

        ModifyRuleRequest translateRuleRequest = new ModifyRuleRequest();
        ModifyRuleRequestRuleDescriptor modifyRuleRequestRuleDescriptor = new ModifyRuleRequestRuleDescriptor(ruleId, libraryName, libraryVersion);
        modifyRuleRequestRuleDescriptor.setCqlContent(mmrCommonString);
        translateRuleRequest.setRule(modifyRuleRequestRuleDescriptor);
        translateRuleRequest.setLibraries(libraries);


        String stringBody = objectMapper.writeValueAsString(translateRuleRequest);


//        log.debug("Sending this to translation ---> \n\n" + stringBody);

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
