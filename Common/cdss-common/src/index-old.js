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


async function medRequestToImm(resource) {
    let imm = {};
    imm["resourceType"] = "Immunization";
    imm["id"] = resource.id;
    imm["meta"] = resource.meta;
    imm["text"] = resource.text;
    imm["status"] = resource.status;
    imm["patient"] = resource.subject;
    imm["encounter"] = resource.encounter;
    imm["authoredOn"] = resource.authoredOn;
    let medicationReference = resource["medicationReference"]

    let url = medicationReference.reference;
    url = endpoints.general.address.replace("{{extend}}", url);

    let newResource = await fetch(url, endpoints.general);
    let medication = await newResource.json();

    imm["vaccineCode"] = medication.code;

    return imm;
}

async function buildResource(resource) {
    const referenceKeys = ["medicationReference"];

    const resourceKeys = Object.keys(resource);


    for (const referenceKey of referenceKeys) {
        let url = resource[referenceKey].reference;
        url = endpoints.general.address.replace("{{extend}}", url);

        let newResource = await fetch(url, endpoints.general);
        let newJson = await newResource.json();

        resource[referenceKey]["reference"] = newJson;

    }
    return resource;
}

async function checkRulesForPatient(patientId, rule, libraries = null) {


    let patientUrl = window.cdss.endpoints.patientEngineRun.address.replace("{{patientId}}", patientId)
    let patientUrlOptions = window.cdss.endpoints.patientEngineRun;

    const patientResponse = await fetch(patientUrl, patientUrlOptions);
    if (patientResponse.status !== 200) {
        throw {
            status: patientResponse.status,
            statusText: patientResponse.statusText,
            url: patientResponse.url,
            headers: patientResponse.headers
        };
    }

    const patientData = await patientResponse.json();


    let medRequestUrl = window.cdss.endpoints.medicationRequestList.address.replace("{{patientId}}", patientId);
    console.log(medRequestUrl);
    let medRequestUrlOptions = window.cdss.endpoints.medicationRequestList;

    const medRequestResponse = await fetch(medRequestUrl, medRequestUrlOptions);
    if (medRequestResponse.status !== 200) {
        throw {
            status: medRequestResponse.status,
            statusText: medRequestResponse.statusText,
            url: medRequestResponse.url,
            headers: medRequestResponse.headers
        };
    }

    const medRequestData = await medRequestResponse.json();

    let medicationUrl = window.cdss.endpoints.medicationList.address.replace("{{medicationId}}", "182295e3-3a1d-4f6e-a1c4-3addb9618638");
    let medicationUrlOptions = window.cdss.endpoints.medicationList;

    const medicationResponse = await fetch(medicationUrl, medicationUrlOptions);
    if (medicationResponse.status !== 200) {
        throw {
            status: medicationResponse.status,
            statusText: medicationResponse.statusText,
            url: medicationResponse.url,
            headers: medicationResponse.headers
        };
    }

    const medicationData = await medicationResponse.json();


    const codeService = new vsac.CodeService('cache', false);

    const patient = createBundle(patientData, patientUrl);
    const medRequest = createBundle(medRequestData, medRequestUrl);
    const medication = createBundle(medicationData, medicationUrl);

    patient.entry.push(medRequest);
    patient.total = 2;

    const psource = new cqlfhir.PatientSource.FHIRv401();

    psource.loadBundles([patient]);

    let lib;
    if (libraries === null || libraries === undefined || libraries.length === 0) {
        lib = new cql.Library(rule);

    } else {
        lib = new cql.Library(rule, new cql.Repository(libraries));
    }

    // let success = await codeService.ensureValueSetsInLibraryWithAPIKey(lib, true, endpoints.uml.key);


    const executor = new cql.Executor(lib, codeService, params);


    const result = await executor.exec(psource); // Await the execution result

    return result.patientResults;


}

async function checkRules(patient, rule, libraries = null, parameters = null,) {

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

async function getListOfPatients() {
    return await fetch(window.cdss.endpoints.patientList.address, window.cdss.endpoints.patientList);
}

async function getListOfMedicationRequests() {
    return await fetch(window.cdss.endpoints.medicationRequestList.address, window.cdss.endpoints.medicationRequestList);
}


function createBundle(resource, url) {
    if (resource.resourceType !== "Bundle") {
        if (url === null) return {resourceType: "Bundle", entry: [{resource: resource}]}
        return {resourceType: "Bundle", entry: [{resource: resource, fullUrl: url}]}
    }
    return resource
}

function test1() {
    return 1;
}

global.cdss = {
    endpoints: endpoints,
    checkRulesForPatient: checkRulesForPatient,
    getListOfPatients: getListOfPatients,
    getListOfMedicationRequests: getListOfMedicationRequests,
    checkRules: checkRules,
    buildResource: buildResource,
    medRequestToImm: medRequestToImm,
    test1: test1
};


