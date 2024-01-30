import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';
import vsac from 'cql-exec-vsac';


let endpoints = {
    "metadata": {
        "systemName": null, "remoteAddress": null,
    },
    "patientById": {
        address: null,
        method: "GET",
    },
    "medicationRequestByPatientId": {
        address: null,
        method: "GET",
    },
    "medicationByMedicationRequestId": {
        address: null,
        method: "GET",
    },
    "immunizationByPatientId": {
        address: null,
        method: "GET",
    },
    "observationByPatientId": {
        address: null,
        method: "GET",
    },
    "conditionByPatientId":{
        address: null,
        method: "GET",
    },
    "ruleById": {
        address: null,
        method: "GET",
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

    if (rule?.library?.includes?.def === undefined) return undefined;
    if (!Array.isArray(rule.library.includes.def)) return undefined;

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
function createBundle(resource, url = null) {
    if (resource === undefined) return undefined;
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
    if (patient === null || patient === undefined) {
        // console.error("Error Executing CDSS: Patient is undefined\nPatient FHIR resource is required to execute a CQL rule.");
        throw new Error("Patient is undefined");
    }
    if (rule === null || rule === undefined) {
        // console.error("Error Executing CDSS: Rule is undefined\nRule object is required to execute a CQL rule.");
        throw new Error("Rule is undefined");
    }


    const fhirWrapper = cqlfhir.FHIRWrapper.FHIRv401(); // or .FHIRv102() or .FHIRv300() or .FHIRv401()


    const codeService = new vsac.CodeService('cache', false);

    // Create a patient bundle if patient is not a bundle
    const patientBundle = createBundle(patient);

    const psource = new cqlfhir.PatientSource.FHIRv401({
        requireProfileTagging: true
    });

    // Load patients
    psource.loadBundles([patientBundle]);


    // Create a library object and make sure all expected libraries are provided
    const expectedLibraries = getListOfExpectedLibraries(rule);
    let libraryObject = {};
    if (expectedLibraries !== undefined && expectedLibraries.length > 0) {
        if (libraries === null || libraries === undefined) {
            throw new Error("Rule expects libraries, but they are undefined");
        }

        for (const expectedLibrary of expectedLibraries) {

            let lib = libraries[expectedLibrary.name];
            if (lib === undefined || lib === null) {
                throw new Error(`Rule expects library "${expectedLibrary.name}", but it is undefined`);
            }
            libraryObject[expectedLibrary.name] = expectedLibrary.path;


        }
    }
    // Create the rule merged with libraries if necessary
    let ruleWithLibraries = libraryObject.length === 0 ? new cql.Library(rule) : new cql.Library(rule, new cql.Repository(libraryObject));

    // let success = await codeService.ensureValueSetsInLibraryWithAPIKey(lib, true, endpoints.uml.key);
    let executor = new cql.Executor(ruleWithLibraries, codeService);

    // Create parameter object and make sure all expected parameters are provided
    let paramObject = {};
    const expectedParameters = getListOfExpectedParameters(rule);

    if (expectedParameters !== undefined && expectedParameters.length > 0) {

        if (parameters === null || parameters === undefined) {
            throw new Error("Rule expects parameters, but they are undefined");
        }

        for (const expectedParameter of expectedParameters) {

            let res = parameters[expectedParameter.name];

            if (res === undefined || res === null) {
                throw new Error(`Rule expects parameter "${expectedParameter.name}", but it is undefined`);
            }
            paramObject[expectedParameter.name] = fhirWrapper.wrap(res);

        }
    }


    // Load parameters into executor
    executor = executor.withParameters(paramObject);


    // Execute the rule
    const result = await executor.exec(psource); // Await the execution result

    // Return the results
    return result.patientResults;
}

async function getPatientResource(patientId) {
    let url = global.cdss.endpoints.patientById.address.replace("{{patientId}}", patientId);
    console.log("Fetching Patient " + url);
    let response = await fetch(url, global.cdss.endpoints.patientById);
    if (response.status !== 200) {
        throw new Error("Patient responded with HTTP " + response.status);
    }

    let patient = await response.json();

    if (patient.resourceType !== "Patient") {
        throw new Error("Requested Patient was not a Patient, rather it is " + patient.type);
    }
    return patient;
}

async function getFhirResource(patientId, resourceType) {
    let response = null;
    switch (resourceType) {
        case "{http://hl7.org/fhir}Immunization":
            response = await fetch(endpoints.immunizationByPatientId.address.replace("{{patientId}}", patientId), endpoints.immunizationByPatientId);
            break;
        case "{http://hl7.org/fhir}Observation":
            response = await fetch(endpoints.observationByPatientId.address.replace("{{patientId}}", patientId), endpoints.observationByPatientId);
            break;
        case "{http://hl7.org/fhir}MedicationRequest":
            response = await fetch(endpoints.medicationRequestByPatientId.address.replace("{{patientId}}", patientId), endpoints.medicationRequestByPatientId);
            break;
    }

    if (response == null) {
        throw new Error("Could not find proper endpoint type for " + resourceType);
    }
    if (response.status !== 200) {
        throw new Error(resourceType + " responded with HTTP " + response.status);
    }
    let res = await response.json();

    if (res.resourceType !== resourceType.replace("{http://hl7.org/fhir}", "")) {
        throw new Error("Requested Patient was not a Patient, rather it is " + res.type);
    }
    return res;
}

async function getRule(ruleId) {
    let url = global.cdss.endpoints.ruleById.address.replace("{{ruleId}}", ruleId);
    console.log("Fetching Rule " + url);

    let response = await fetch(url, global.cdss.endpoints.ruleById);
    if (response.status !== 200) {
        throw new Error("Rule responded with HTTP " + response.status);
    }
    let rule = await response.json();

    return rule;
}


async function executeRuleWithPatient(patientId, ruleId) {
    let patient = await getPatientResource(patientId);
    let rule = await getRule(ruleId);


    let libraries = {};
    let expectedLibraries = getListOfExpectedLibraries(rule);
    console.log("expectedLibraries " + expectedLibraries);
    if (expectedLibraries !== undefined)
        for (const lib of expectedLibraries) {
            libraries[lib.name] = await getRule(lib.path);
        }


    let parameters = {};

    let expectedParameters = getListOfExpectedParameters(rule);
    console.log("expectedParameters " + expectedParameters);
    if (expectedParameters !== undefined)
        for (const par of expectedParameters) {
            parameters[par.name] = await getFhirResource(patientId, par.type);

        }


    return await executeCql(patient, rule, libraries, parameters);
}

global.cdss = {
    endpoints: endpoints,
    createBundle: createBundle,
    executeCql: executeCql,
    getListOfExpectedParameters: getListOfExpectedParameters,
    getListOfExpectedLibraries: getListOfExpectedLibraries,
    executeRuleWithPatient: executeRuleWithPatient
};


