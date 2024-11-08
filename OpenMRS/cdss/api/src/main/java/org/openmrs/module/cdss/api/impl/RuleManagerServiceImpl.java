package org.openmrs.module.cdss.api.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
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
import org.openmrs.module.cdss.api.serialization.RuleManifestDeserializer;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
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

        objectMapper = new ObjectMapper();
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addDeserializer(RuleManifest.class, new RuleManifestDeserializer());
        objectMapper.registerModule(simpleModule);

        ClassLoader classloader = Thread.currentThread().getContextClassLoader();

        if (!checkRuleManifestFileExists()) {
            return;
        }
        InputStream is = classloader.getResourceAsStream(RULE_MANIFEST_PATH);

        String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));

        try {
            ruleManifest = objectMapper.readValue(result, RuleManifest.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        if (client == null) {
            client = new OkHttpClient();
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
    public String getElmRule(String ruleId) throws RuleNotEnabledException, APIAuthenticationException, NullPointerException {
        for (RuleDescriptor descriptor : ruleManifest.getRules()) {
            if (descriptor.getId().equals(ruleId)) {
                String path = RULE_DIRECTORY_PATH + descriptor.getElmFilePath();
                if (!descriptor.isEnabled()) {
                    throw new RuleNotEnabledException(ruleId);
                }
                ClassLoader classloader = Thread.currentThread().getContextClassLoader();
                InputStream is = classloader.getResourceAsStream(path);
                String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
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
    public String getCqlRule(String ruleId) throws RuleNotEnabledException, APIAuthenticationException, NullPointerException {
        for (RuleDescriptor descriptor : ruleManifest.getRules()) {
            if (descriptor.getId().equals(ruleId)) {
                if (!descriptor.isEnabled()) {
                    throw new RuleNotEnabledException(ruleId);
                }
                String path = RULE_DIRECTORY_PATH + descriptor.getCqlFilePath();
                ClassLoader classloader = Thread.currentThread().getContextClassLoader();
                URL url = classloader.getResource(path);
                File f = new File(url.getPath());
                InputStream is = null;
                try {
                    is = new FileInputStream(f);
                    log.debug("Path is :   " + path);
                    String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
                    return result;
                } catch (FileNotFoundException e) {
                    throw new RuntimeException(e);
                }


            }
        }
        return null;
    }

    private boolean isRuleIdValid(String ruleId) {

        return new JsonFilenameFilter().accept(null, ruleId);
    }


    private boolean checkRuleManifestFileExists() {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();

        URL url = classloader.getResource(RULE_MANIFEST_PATH);
        if (url == null) {
            throw new RuntimeException("Could not find rule manifest file");
        }
        File f = new File(url.getPath());

        if (!f.exists() || !(f.canRead() && f.canWrite())) {
            throw new RuntimeException("Could not read rule manifest file");

        }

        log.info("CDSS Found Rule Manifest file: " + url);
        return true;
    }

    private void writeManifest() {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        URL url = classloader.getResource(RULE_MANIFEST_PATH);

        try {
            OutputStream outputStream = new FileOutputStream(url.getPath());
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
    }


    public Boolean modifyRule(String ruleId, String version, Map<String, ParamDescriptor> changedParameters) throws JsonProcessingException {
        if (client == null) {
            client = new OkHttpClient();
        }
        HashMap<String, Object> newRequestBody = new HashMap<>();
        newRequestBody.put("params", new HashMap<>());


        newRequestBody.put("rule", new ModifyRuleRequestRuleDescriptor(ruleId, version, encodeCql(getCqlRule(ruleId))));

        newRequestBody.put("params", changedParameters);

        String stringBody = objectMapper.writeValueAsString(newRequestBody);

        okhttp3.RequestBody body1 = okhttp3.RequestBody.create(
                MediaType.parse("application/json"), stringBody);
        Request rq = new Request.Builder().post(body1).url("http://host.docker.internal:9090/api/inject").build();

        try {
            Response rs = client.newCall(rq).execute();

            if (rs.code() == 200) {
                String resultString = rs.body().string();
                rs.body().close();

                ModifyRuleRequest result = objectMapper.readValue(resultString, ModifyRuleRequest.class);
                String cql = result.getRule().getCqlContent();
                String elm = translate(ruleId, version, cql);
                return createRule(ruleId, version, changedParameters, RuleRole.RULE, cql, elm);
            }

            return false;


        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Boolean createRule(String ruleId, String version, Map<String, ParamDescriptor> params, RuleRole role, String cql, String elm) throws IOException {
        if (ruleId == null) {
            throw new RuntimeException("Rule id is null");
        }
        if (cql == null) {
            throw new RuntimeException("CQL is null");
        }
        if (elm == null) {
            throw new RuntimeException("Elm is null");
        }
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();

        String newId = "gshdf";
        String newVersion = "1";

        String cqlFilePath = String.format("cql/%s.cql", newId);
        String elmFilePath = String.format("elm/%s.json", newId);

        RuleDescriptor descriptor = new RuleDescriptor(newId, newVersion, cqlFilePath, elmFilePath, role);
        descriptor.setEnabled(true);
        descriptor.setParams(params);


        URL ruleDirectoryUrl = classloader.getResource(RULE_DIRECTORY_PATH);
        log.debug("Rule dir: " + ruleDirectoryUrl.getPath());

        File cqlFile = new File(ruleDirectoryUrl.getPath() + cqlFilePath);
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

        File elmFile = new File(ruleDirectoryUrl.getPath() + elmFilePath);
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
            log.debug("Saving rule " + descriptor.getId() + " to " + ruleDirectoryUrl.getPath());

            writeManifest();
        }
        return addSuccess;


    }

    private String translate(String ruleId, String version, String cql) throws JsonProcessingException {
        HashMap<String, Object> newRequestBody = new HashMap<>();
        newRequestBody.put("params", new HashMap<>());


        newRequestBody.put("rule", new ModifyRuleRequestRuleDescriptor(ruleId, version, encodeCql(cql)));
        newRequestBody.put("libraries", new HashMap<>());
        ((HashMap<String, ModifyRuleRequestRuleDescriptor>) newRequestBody.get("libraries")).put("MMR_Common_Library", new ModifyRuleRequestRuleDescriptor("MMR_Common_Library", "1", encodeCql(getCqlRule("MMR_Common_Library"))));
        String stringBody = objectMapper.writeValueAsString(newRequestBody);

        okhttp3.RequestBody body1 = okhttp3.RequestBody.create(
                MediaType.parse("application/json"), stringBody);
        Request rq = new Request.Builder().post(body1).url("http://host.docker.internal:9090/api/translate").build();
        try {
            Response rs = client.newCall(rq).execute();
            if (rs.code() == 200) {
                String result = rs.body().string();
                rs.body().close();
                return result;
            }
            log.error("Could not translate Error code" + rs.code() + " : " + rs.body().string());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        log.error("Translation returning null!!!!");
        return null;
    }


}
