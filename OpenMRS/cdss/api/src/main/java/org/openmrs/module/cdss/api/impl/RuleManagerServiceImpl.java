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
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.*;
import org.openmrs.module.cdss.api.exception.RuleNotEnabledException;
import org.openmrs.module.cdss.api.exception.RuleNotFoundException;
import org.openmrs.module.cdss.api.serialization.RuleManifestDeserializer;

import java.io.*;
import java.net.URL;
import java.nio.file.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.openmrs.module.cdss.CDSSUtil.encodeCql;

class JsonFilenameFilter implements FilenameFilter {

    // Allow only alphanumeric,period, hyphen, underscore
    private static final String INVALID_REGX = "[^-_.A-Za-z0-9]";

    @Override
    public boolean accept(File dir, String name) {

        Pattern p = Pattern.compile(INVALID_REGX);
        boolean found = p.matcher(name).find();// If true, then it is invalid
        return name.endsWith(".json") && !found;
    }
}

public class RuleManagerServiceImpl extends BaseOpenmrsService implements RuleManagerService {

    private final Logger log = Logger.getLogger(getClass());

    // The directory in the resources folder where ELM rules are stored
    private static final String RULE_DIRECTORY_PATH = "rules/";
    private static final String RULE_MANIFEST_PATH = "rules/rule-manifest.json";

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

//        if (checkRuleManifestFileExists()) {
//            log.info("Found rule manifest file: " + RULE_MANIFEST_PATH);
//            readManifest();
//        } else {
//            try {
//                setUpDirectoryHierarchy();
//            } catch (IOException e) {
//                throw new RuntimeException(e);
//            }
//        }
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
     * Retrieves an array of strings representing the rules available for the CDSS (Clinical
     * Decision Support System). These rules are identified by their file names.
     *
     * @return An array of strings containing the names of the rule files.
     * @throws APIAuthenticationException if there is an issue with authentication while retrieving
     *                                    the rules.
     */
    @Override
    public String[] getEnabledRules() throws APIAuthenticationException {
        String[] rules = new String[ruleManifest.getRules().size()];
        int i = 0;
        for (RuleDescriptor descriptor : ruleManifest.getRules()) {
            if (descriptor.isEnabled()) {
                rules[i] = descriptor.getId();
                i++;
            }
        }
        return rules;
    }

    @Override
    public String[] getRules() throws APIAuthenticationException {
        String[] rules = new String[ruleManifest.getRules().size()];
        int i = 0;
        for (RuleDescriptor descriptor : ruleManifest.getRules()) {
            rules[i] = descriptor.getId();
            i++;
        }
        return rules;
    }


    /**
     * Retrieves the content of a specific rule file based on the provided rule ID. If the rule ID
     * does not end with '.json', it appends '.json' to the ID. Uses the current thread's context
     * class loader to load the file as an input stream.
     *
     * @param ruleId the identifier of the rule file to retrieve
     * @return the content of the rule file as a single string
     * @throws APIAuthenticationException if there is an issue with authentication while retrieving
     *                                    the rule
     * @throws NullPointerException       if the provided rule ID is null
     */
    @Override
    public String getElmRule(String ruleId) throws RuleNotEnabledException, APIAuthenticationException, RuleNotFoundException, FileNotFoundException {
        for (RuleDescriptor descriptor : ruleManifest.getRules()) {
            if (descriptor.getId().equals(ruleId)) {
                String path = RULE_DIRECTORY_PATH + descriptor.getElmFilePath();
                if (!descriptor.isEnabled()) {
                    throw new RuleNotEnabledException(ruleId);
                }
//                ClassLoader classloader = Thread.currentThread().getContextClassLoader();
//                InputStream is = classloader.getResourceAsStream(path);
//                String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
//                return result;

                File f = new File(path);
                if (!f.exists()) {
                    throw new RuleNotFoundException(ruleId, path);
                }
                String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
                return result;
            }
        }
        return null;
    }


    /**
     * Retrieves the content of a specific rule file based on the provided rule ID. If the rule ID
     * does not end with '.json', it appends '.json' to the ID. Uses the current thread's context
     * class loader to load the file as an input stream.
     *
     * @param ruleId the identifier of the rule file to retrieve
     * @return the content of the rule file as a single string
     * @throws APIAuthenticationException if there is an issue with authentication while retrieving
     *                                    the rule
     * @throws NullPointerException       if the provided rule ID is null
     */
    @Override
    public String getCqlRule(String ruleId) throws RuleNotEnabledException, APIAuthenticationException, NullPointerException, RuleNotFoundException, FileNotFoundException {
        for (RuleDescriptor descriptor : ruleManifest.getRules()) {
            if (descriptor.getId().equals(ruleId)) {
                if (!descriptor.isEnabled()) {
                    throw new RuleNotEnabledException(ruleId);
                }
                String path = RULE_DIRECTORY_PATH + descriptor.getCqlFilePath();
                File f = new File(path);
                if (!f.exists()) {
                    throw new RuleNotFoundException(ruleId, path);
                }
                String result = new BufferedReader(new FileReader(f)).lines().collect(Collectors.joining("\n"));
                return result;


            }
        }
        return null;
    }


    private boolean doesRuleExist(String ruleId) {
        for (RuleDescriptor descriptor : ruleManifest.getRules()) {
            if (descriptor.getId().equals(ruleId)) {
                return true;
            }
        }
        return false;
    }

    private boolean isRuleIdValid(String ruleId) {

        return new JsonFilenameFilter().accept(null, ruleId);
    }


    private boolean checkRuleManifestFileExists() {

        File f = new File(RULE_MANIFEST_PATH);
        log.debug("RULE_MANIFEST_PATH: " + f.getAbsolutePath());
        if (f.exists()) {
            log.info("CDSS Found Rule Manifest file: " + RULE_MANIFEST_PATH);
        } else {
            log.info("CDSS Did not find Rule Manifest file: " + RULE_MANIFEST_PATH);
        }

        return f.exists();
    }

    private void writeManifest() {

        File f = new File(RULE_MANIFEST_PATH);
        OutputStream outputStream = null;

        log.debug("CDSS Writing rule manifest file: " + f.getAbsolutePath());

        try {
            outputStream = new FileOutputStream(f);
            objectMapper.writeValue(outputStream, ruleManifest);

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


    private void setUpDirectoryHierarchy() throws IOException {

        log.info("Did not find rule manifest file, will create one instead");


        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        URL ruleManifestUrl = classloader.getResource(RULE_MANIFEST_PATH);
        File ruleManifestFile = new File(RULE_MANIFEST_PATH);
        log.debug("DEBUG:::::" + Paths.get(ruleManifestUrl.getPath()) + "     " + Paths.get(ruleManifestFile.getAbsolutePath()));

        Files.createDirectories(Paths.get(ruleManifestFile.getParent()));
        try {
            Path result = Files.copy(Paths.get(ruleManifestUrl.getPath()), Paths.get(ruleManifestFile.getAbsolutePath()), StandardCopyOption.REPLACE_EXISTING);
            log.debug("RESULT:::" + result.toString());

        } catch (FileAlreadyExistsException e) {
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

    private Boolean createRule(String ruleId, String version, String description, Map<String, ParamDescriptor> params, RuleRole role, String cql, String elm) throws IOException {
        if (ruleId == null) {
            throw new RuntimeException("Rule id is null");
        }
        if (cql == null) {
            throw new RuntimeException("CQL is null");
        }
        if (elm == null) {
            throw new RuntimeException("Elm is null");
        }

        int count = 1;
        String newId = ruleId + "_" + count;
        while (doesRuleExist(newId)) {
            newId = newId + "_" + count;
            count++;
        }

        String newVersion = version;

        String cqlFilePath = String.format("cql/%s.cql", newId);
        String elmFilePath = String.format("elm/%s.json", newId);

        RuleDescriptor descriptor = new RuleDescriptor(newId, newVersion, cqlFilePath, elmFilePath, role);
        descriptor.setEnabled(true);
        descriptor.setParams(params);
        descriptor.setDescription(description);


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
            log.debug("Saving rule " + descriptor.getId() + " to " + RULE_DIRECTORY_PATH);

            writeManifest();
        }
        return addSuccess;


    }

    public Boolean modifyRule(String ruleId, String version, Map<String, ParamDescriptor> changedParameters) throws JsonProcessingException, FileNotFoundException, RuleNotFoundException {
        log.debug("CDSS Attempting to modify rule " + ruleId);
        RuleDescriptor originalRule = ruleManifest.getRule(ruleId);

        if (originalRule == null) {
            throw new RuleNotFoundException(ruleId);
        }
        String cqlContent = getCqlRule(ruleId);

        ModifyRuleRequest modifyRuleRequest = new ModifyRuleRequest();
        modifyRuleRequest.setRule(new ModifyRuleRequestRuleDescriptor(ruleId, version, encodeCql(cqlContent)));

        for (Map.Entry<String, ParamDescriptor> pair : originalRule.getParams().entrySet()) {
            String name = pair.getKey();
            ParamDescriptor paramDescriptor = pair.getValue();
            if (!changedParameters.containsKey(name)) {
                log.debug(paramDescriptor);
                changedParameters.put(name, paramDescriptor);
            }
        }
        log.debug(changedParameters);

        modifyRuleRequest.setParams(changedParameters);

        log.debug(modifyRuleRequest.toString());
        String stringBody = objectMapper.writeValueAsString(modifyRuleRequest);
        log.debug(stringBody);
        String resultString = callModificationService("http://host.docker.internal:9090/api/inject", stringBody);
        log.debug("resultString: \n" + resultString);
        ModifyRuleRequest result = objectMapper.readValue(resultString, ModifyRuleRequest.class);
        String cql = result.getRule().getCqlContent();
        log.debug("INJECTED CQL: " + cql);
        log.debug("Translating");
        String elm = translate(ruleId, version, cql);
        try {
            return createRule(ruleId, version, originalRule.getDescription(), changedParameters, RuleRole.RULE, cql, elm);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }


    private String translate(String ruleId, String version, String cql) throws JsonProcessingException, FileNotFoundException, RuleNotFoundException {

        HashMap<String, ModifyRuleRequestRuleDescriptor> libraries = new HashMap<>();
        libraries.put("MMR_Common_Library", new ModifyRuleRequestRuleDescriptor("MMR_Common_Library", "1", encodeCql(getCqlRule("MMR_Common_Library"))));

        ModifyRuleRequest translateRuleRequest = new ModifyRuleRequest();
        translateRuleRequest.setRule(new ModifyRuleRequestRuleDescriptor(ruleId, version, encodeCql(cql)));
        translateRuleRequest.setLibraries(libraries);


        log.debug("CDSS translate rule " + ruleId);

        String stringBody = objectMapper.writeValueAsString(translateRuleRequest);

        String resultString = callModificationService("http://host.docker.internal:9090/api/translate", stringBody);
        return resultString;
    }


    private String callModificationService(String url, String body) {
        if (client == null) {
            client = new OkHttpClient();
        }

        okhttp3.RequestBody body1 = okhttp3.RequestBody.create(MediaType.parse("application/json"), body);
        Request rq = new Request.Builder().post(body1).url(url).build();
        try {
            Response rs = client.newCall(rq).execute();

            if (rs.code() == 200) {
                String resultString = rs.body().string();
                rs.body().close();
                return resultString;
            }

            return null;


        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
