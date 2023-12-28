import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';
import vsac from 'cql-exec-vsac';

let endpoints = {
    "metadata": {
        "systemName": "OpenMRS", "remoteAddress": "http://localhost:8081/openmrs-standalone/",
    },
    "general": {
        address: "http://localhost:8081/openmrs-standalone/ws/fhir2/R4/{{extend}}",
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {Accept: "application/json", Cookie: "JSESSIONID=F71AF8B41B0E913A2BE0A870450F9F73"}
    },
    "patientList": {
        address: "http://localhost:8081/openmrs-standalone/ws/fhir2/R4/Patient",
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {Accept: "application/json", Cookie: "JSESSIONID=F71AF8B41B0E913A2BE0A870450F9F73"}
    },
    "patientEngineRun": {
        address: "http://localhost:8081/openmrs-standalone/ws/fhir2/R4/Patient/{{patientId}}",
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {Accept: "application/json", Cookie: "JSESSIONID=F71AF8B41B0E913A2BE0A870450F9F73"}
    },
    "medicationRequestList": {
        address: "http://localhost:8081/openmrs-standalone/ws/fhir2/R4/MedicationRequest",
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {Accept: "application/json", Cookie: "JSESSIONID=F71AF8B41B0E913A2BE0A870450F9F73"}
    },
    "medicationRequestByPatient": {
        address: "http://localhost:8081/openmrs-standalone/ws/fhir2/R4/MedicationRequest?patient.identifier={{patientId}}",
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {Accept: "application/json", Cookie: "JSESSIONID=F71AF8B41B0E913A2BE0A870450F9F73"}
    },
    medicationList: {
        address: "http://localhost:8081/openmrs-standalone/ws/fhir2/R4/Medication/{{medicationId}}",
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {Accept: "application/json", Cookie: "JSESSIONID=F71AF8B41B0E913A2BE0A870450F9F73"}
    }
};

/**
 * Retrieves a list of expected parameters required buy the rule.
 *
 * @param {Object} rule - The rule object.
 * @returns {Array} An array of objects representing expected parameters with name and type.
 */
function getListOfExpectedParameters(rule) {

    if (rule?.library?.parameters?.def === undefined) return undefined;

    if (!Array.isArray(rule.library.parameters.def)) return undefined;

    let result = [];
    rule.library.parameters.def.forEach(p => {
        result.push({name: p.name, type: p.parameterTypeSpecifier.name});
    });
    return result;
}

/**
 * Retrieves a list of expected libraries based on the given rule.
 *
 * @param {Object} rule - The rule object.
 * @returns {Array} An array of objects representing expected libraries with name and path.
 */
function getListOfExpectedLibraries(rule) {

    if (rule?.library?.parameters?.def === undefined) return undefined;
    if (!Array.isArray(rule.library.parameters.def)) return undefined;

    let result = [];
    rule.library.includes.def.forEach(l => {
        result.push({name: l.localIdentifier, path: l.path});
    });

    return result;
}

/**
 * Creates a FHIR (Fast Healthcare Interoperability Resources) Bundle based on the given resource and URL.
 *
 * @param {Object} resource - The resource object to be included in the Bundle.
 * @param {string|null} url - The URL associated with the resource. Can be null.
 * @returns {Object} A FHIR Bundle object.
 */
function createBundle(resource, url) {
    if (resource.resourceType !== "Bundle") {
        if (url === null) return {resourceType: "Bundle", entry: [{resource: resource}]}
        return {resourceType: "Bundle", entry: [{resource: resource, fullUrl: url}]}
    }
    return resource
}

/**
 * Executes a Clinical Quality Language (CQL) rule on a FHIR (Fast Healthcare Interoperability Resources) patient.
 *
 * @param {Object} patient - The FHIR patient resource on which the CQL rule will be executed.
 * @param {Object} rule - The CQL rule to be executed.
 * @param {Array|null} libraries - An array of additional CQL libraries to be used in the execution. Default is null.
 * @param {Object|null} parameters - Additional parameters to be used in the CQL execution. Default is null.
 * @returns {Object} The result of the CQL execution on the patient, including patient-specific results.
 */
async function executeCql(patient, rule, libraries = null, parameters = null) {

    const fhirWrapper = cqlfhir.FHIRWrapper.FHIRv401(); // or .FHIRv102() or .FHIRv300() or .FHIRv401()


    const codeService = new vsac.CodeService('cache', false);

    const patientBundle = createBundle(patient);

    const psource = new cqlfhir.PatientSource.FHIRv401({
        requireProfileTagging: true
    });

    psource.loadBundles([patientBundle]);

    let lib;
    if (libraries === null || libraries === undefined || libraries.length === 0) {
        lib = new cql.Library(rule);

    } else {
        lib = new cql.Library(rule, new cql.Repository(libraries));
    }

    // let success = await codeService.ensureValueSetsInLibraryWithAPIKey(lib, true, endpoints.uml.key);
    let executor = new cql.Executor(lib, codeService);

    let paramObject = {};

    if (parameters) {
        for (const key of Object.keys(parameters)) {

            let res = parameters[key];
            paramObject[key] = fhirWrapper.wrap(res);
        }
    }

    executor = executor.withParameters(paramObject);


    const result = await executor.exec(psource); // Await the execution result

    return result.patientResults;
}


global.cdss = {
    endpoints: endpoints,
    createBundle: createBundle,
    executeCql: executeCql,
    getListOfExpectedParameters: getListOfExpectedParameters,
    getListOfExpectedLibraries: getListOfExpectedLibraries
};


