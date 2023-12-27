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
 *
 * @param rule
 * @returns {*[]}
 */
function getListOfExpectedParameters(rule) {
    return [];
}

/**
 *
 * @param resource
 * @param url
 * @returns {{entry: [{resource, fullUrl}], resourceType: string}|{entry: [{resource}], resourceType: string}|*}
 */
function createBundle(resource, url) {
    if (resource.resourceType !== "Bundle") {
        if (url === null) return {resourceType: "Bundle", entry: [{resource: resource}]}
        return {resourceType: "Bundle", entry: [{resource: resource, fullUrl: url}]}
    }
    return resource
}

/**
 *
 * @param patient
 * @param rule
 * @param libraries
 * @param parameters
 * @returns {Promise<any>}
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
    endpoints: endpoints
};


