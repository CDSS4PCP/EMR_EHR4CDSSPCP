package org.openmrs.module.cdss.api.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.apache.log4j.Logger;
import org.openmrs.api.APIAuthenticationException;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.cdss.CDSSConfig;
import org.openmrs.module.cdss.api.RuleManagerService;
import org.openmrs.module.cdss.api.data.RuleManifest;
import org.openmrs.module.cdss.api.serialization.RuleManifestDeserializer;

import java.io.*;
import java.net.URL;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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
    private static final String RULE_DIRECTORY_PATH = "rules/elm/";
    private static final String RULE_MANIFEST_PATH = "rules/rule-manifest.json";

    private RuleManifest ruleManifest;
    private ObjectMapper objectMapper;

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

    }

    /**
     * Logic that is run when this service is stopped. At the moment, this method is not used.
     */
    @Override
    public void onShutdown() {
        log.info("CDSS Vaccine Manager service stopped...");
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
    public String[] getRules() throws APIAuthenticationException {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();

        URL url = classloader.getResource(RULE_DIRECTORY_PATH);

        String directoryPath = url.getPath();
        File directoryFile = new File(directoryPath);
        File[] files = directoryFile.listFiles(new JsonFilenameFilter());
        String[] filenames = new String[files.length];

        for (int i = 0; i < files.length; i++) {
            filenames[i] = files[i].getName();
        }
        return filenames;

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
    public String getRule(String ruleId) throws APIAuthenticationException, NullPointerException {
        if (!isRuleIdValid(ruleId)) {
            return null;
        }

        String path = RULE_DIRECTORY_PATH + ruleId;

        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        InputStream is = classloader.getResourceAsStream(path);
        String result = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
        return result;
    }

    public RuleManifest getRuleManifest() {
        return ruleManifest;
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
}
