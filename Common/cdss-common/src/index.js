import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';
import vsac from 'cql-exec-vsac';

const DEBUG_MODE = false;


const UsageStatus = Object.freeze({
    ACTED: "ACTED",
    DECLINED: "DECLINED",
    ROUTINE: "ROUTINE"
})

const FhirTypes = Object.freeze({
    PATIENT: "{http://hl7.org/fhir}Patient",
    IMMUNIZATION: "{http://hl7.org/fhir}Immunization",
    MEDICATION_REQUEST: "{http://hl7.org/fhir}MedicationRequest",
    MEDICATION: "{http://hl7.org/fhir}Medication",
    OBSERVATION: "{http://hl7.org/fhir}Observation",
    CONDITION: "{http://hl7.org/fhir}Condition"
})

const ContainerTypes = Object.freeze({
    LIST: (t) => {
        if (t == null) return "ListTypeSpecifier"
        return "ListTypeSpecifier<" + t + ">"
    }
})

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
        method: "GET"
    },
    "immunizationByPatientId": {
        address: null,
        method: "GET",
    },
    "observationByPatientId": {
        address: null,
        method: "GET",
    },
    "conditionByPatientId": {
        address: null,
        method: "GET",
    },
    "ruleById": {
        address: null,
        method: "GET",
    },
    "getUsages": {
        address: null,
        method: "GET"
    },
    "recordUsage": {
        address: null,
        method: "POST"
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
        let type = "";
        if (p.parameterTypeSpecifier.name != undefined) {
            type = p.parameterTypeSpecifier.name
        } else {
            type = p.parameterTypeSpecifier.type + "<" + p.parameterTypeSpecifier.elementType.name + ">";
        }
        result.push({name: p.name, type: type});
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
 * Records routine usage of a rule for a patient.
 * The status is will be "ROUTINE"
 *
 * @param {string} ruleId - The ID of the rule being used.
 * @param {string} patientId - The ID of the patient.
 * @param {string} vaccine - The name of the vaccine.
 * @param {string} recommendations - The recommendations for the patient.
 * @returns {Promise} - A promise that resolves when the usage is recorded successfully.
 * @throws {Error} - If the rule responds with an HTTP status other than 200.
 */
async function recordRoutineUsage(ruleId, patientId, vaccine, recommendations) {
    if (typeof global.cdss.endpoints.recordUsage.address == 'function') {

        await global.cdss.endpoints.recordUsage.address(ruleId, patientId, vaccine, recommendations, UsageStatus.ROUTINE);

    } else {
        let url = global.cdss.endpoints.recordUsage.address;

        let options = {...global.cdss.endpoints.recordUsage};
        options.body = {
            vaccine: vaccine,
            patientId: patientId,
            timestamp: new Date(),
            rule: ruleId,
            recommendations: recommendations,
            status: UsageStatus.ROUTINE
        };

        console.log("Sending...", options.body);
        let response = await fetch(url, options);
        if (response.status !== 200) {
            throw new Error("Rule responded with HTTP " + response.status);
        }
    }
}


/**
 * Records the usage of a rule when it is acted upon.
 * The status is will be "ACTED"
 *
 * @param {string} ruleId - The ID of the rule being acted upon.
 * @param {string} patientId - The ID of the patient for whom the rule is being acted upon.
 * @param {string} vaccine - The name of the vaccine being recommended.
 * @param {string} recommendation - The recommendation being made.
 * @returns {Promise} - A promise that resolves when the usage is recorded.
 * @throws {Error} - If the rule does not respond with HTTP 200.
 */
async function recordActedUsage(ruleId, patientId, vaccine, recommendation) {
    if (typeof global.cdss.endpoints.recordUsage.address == 'function') {
        await global.cdss.endpoints.recordUsage.address(ruleId, patientId, vaccine, recommendation, UsageStatus.ACTED);

    } else {
        let url = global.cdss.endpoints.recordUsage.address;

        let options = {...global.cdss.endpoints.recordUsage};
        options.body = {
            vaccine: vaccine,
            patientId: patientId,
            timestamp: new Date(),
            rule: ruleId,
            recommendation: recommendation,
            status: UsageStatus.ACTED
        };
        let response = await fetch(url, options);
        if (response.status !== 200) {
            throw new Error("Rule responded with HTTP " + response.status);
        }
    }
}


/**
 * Records the declined usage of a rule for a specific patient.
 * The status is will be "DECLINED"
 *
 * @param {string} ruleId - The ID of the rule.
 * @param {string} patientId - The ID of the patient.
 * @param {string} vaccine - The name of the vaccine.
 * @param {string} recommendation - The recommendation for the vaccine.
 * @returns {Promise<void>} - A promise that resolves when the usage is recorded.
 * @throws {Error} - If there is an error recording the usage.
 */
async function recordDeclinedUsage(ruleId, patientId, vaccine, recommendation) {
    if (typeof global.cdss.endpoints.recordUsage.address == 'function') {
        await global.cdss.endpoints.recordUsage.address(ruleId, patientId, vaccine, recommendation, UsageStatus.DECLINED);

    } else {
        let url = global.cdss.endpoints.recordUsage.address;

        let options = {...global.cdss.endpoints.recordUsage};
        options.body = {
            vaccine: vaccine,
            patientId: patientId,
            timestamp: new Date(),
            rule: ruleId,
            recommendation: recommendation,
            status: UsageStatus.DECLINED
        };
        let response = await fetch(url, options);
        if (response.status !== 200) {
            throw new Error("Rule responded with HTTP " + response.status);
        }
    }
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


    const codeService = new vsac.CodeService('vsac_cache', false);

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

    let success = await codeService.ensureValueSetsInLibraryWithAPIKey(rule, true, '5d7d49f3-4c14-4442-9b1d-a6895ca5a715');
    let executor = new cql.Executor(ruleWithLibraries, codeService);
    // let executor = new cql.Executor(ruleWithLibraries);

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

            if (expectedParameter.type.startsWith(ContainerTypes.LIST(null))) {

                paramObject[expectedParameter.name] = [];

                if (res.entry != null) {

                    for (const entry of res.entry) {
                        let wrapped = fhirWrapper.wrap(entry.resource);
                        paramObject[expectedParameter.name].push(wrapped);
                    }
                }
            } else {
                paramObject[expectedParameter.name] = fhirWrapper.wrap(res);
            }

        }
    }


    // Load parameters into executor
    executor = executor.withParameters(paramObject);

    // Execute the rule
    const result = await executor.exec(psource); // Await the execution result

    let patientResults = result.patientResults;
    patientResults.library = {name: rule.library.identifier.id, version: rule.library.identifier.version};
    let recommendations = [];
    recommendations.push({
        "id": 17,
        "recommendation": patientResults[patient.id].Recommendation,
        "priority": 1,
        "uuid": "testing"
    })
    await recordRoutineUsage(rule.library.identifier.id, patient.id, patientResults[patient.id].VaccineName, recommendations);

    // Return the results
    return patientResults;
}

/**
 * Retrieves patient resource based on the provided patient ID.
 *
 * @param {string} patientId - The unique identifier of the patient
 * @returns {Object} The patient FHIR resource object
 */
async function getPatientResource(patientId) {

    let patient = null;
    if (typeof global.cdss.endpoints.patientById.address == 'function') {

        patient = await global.cdss.endpoints.patientById.address(patientId);


    } else {
        let url = global.cdss.endpoints.patientById.address.replace("{{patientId}}", patientId);
        let response = await fetch(url, global.cdss.endpoints.patientById);
        if (response.status !== 200) {
            throw new Error("Patient responded with HTTP " + response.status);
        }

        patient = await response.json();

    }
    if (patient.resourceType !== "Patient") {
        throw new Error("Requested Patient was not a Patient, rather it is " + patient.type);
    }
    return patient;

}

/**
 * Retrieves a FHIR resource for a specific patient and resource type from the server.
 *
 * @param {string} patientId - The unique identifier of the patient
 * @param {string} resourceType - The type of FHIR resource to retrieve(must be either a ContainerTypes or FhirTypes enum)
 * @returns {Object} The FHIR resource object
 */
async function getFhirResource(patientId, resourceType) {
    let response = null;
    let res = null;
    switch (resourceType) {
        case ContainerTypes.LIST(FhirTypes.IMMUNIZATION):
            if (typeof global.cdss.endpoints.immunizationByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.immunizationByPatientId.address.replace("{{patientId}}", patientId), endpoints.immunizationByPatientId);
            else if (typeof global.cdss.endpoints.immunizationByPatientId.address == 'function')
                res = await global.cdss.endpoints.immunizationByPatientId.address(patientId)
            break;

        case ContainerTypes.LIST(FhirTypes.OBSERVATION):
            if (typeof global.cdss.endpoints.observationByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.observationByPatientId.address.replace("{{patientId}}", patientId), endpoints.observationByPatientId);
            else if (typeof global.cdss.endpoints.observationByPatientId.address == 'function')
                res = await global.cdss.endpoints.observationByPatientId.address(patientId)
            break;
        case ContainerTypes.LIST(FhirTypes.MEDICATION_REQUEST):
            if (typeof global.cdss.endpoints.medicationRequestByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.medicationRequestByPatientId.address.replace("{{patientId}}", patientId), endpoints.medicationRequestByPatientId);
            else if (typeof global.cdss.endpoints.medicationRequestByPatientId.address == 'function')
                res = await global.cdss.endpoints.medicationRequestByPatientId.address(patientId)
            break;
        case ContainerTypes.LIST(FhirTypes.CONDITION):
            if (typeof global.cdss.endpoints.conditionByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.conditionByPatientId.address.replace("{{patientId}}", patientId), endpoints.medicationRequestByPatientId);
            else if (typeof global.cdss.endpoints.conditionByPatientId.address == 'function')
                res = await global.cdss.endpoints.conditionByPatientId.address(patientId)
            break;

    }

    if (res != null) {
        return res;
    }

    if (response == null && res == null) {
        throw new Error("Could not find proper endpoint type for " + resourceType);
    }
    if (response?.status !== 200 && res == null) {
        throw new Error(resourceType + " responded with HTTP " + response.status);
    }
    if (res == null && response != null)
        res = await response.json();

    // if (res.resourceType !== resourceType.replace("{http://hl7.org/fhir}", "")) {
    //     throw new Error("Requested Patient was not a Patient, rather it is " + res.type);
    // }
    return res;
}

/**
 * Retrieves a rule based on the specified rule ID.
 *
 * @param {string} ruleId - The unique identifier of the rule
 * @returns {Object} The retrieved rule object (in JSON-ELM format)
 */
async function getRule(ruleId) {

    if (typeof global.cdss.endpoints.ruleById.address == 'function') {
        let rule = await global.cdss.endpoints.ruleById.address(ruleId);
        return rule;

    } else {
        let url = global.cdss.endpoints.ruleById.address.replace("{{ruleId}}", ruleId);

        let response = await fetch(url, global.cdss.endpoints.ruleById);
        if (response.status !== 200) {
            throw new Error("Rule responded with HTTP " + response.status);
        }
        let rule = await response.json();

        return rule;
    }
}


/**
 * Executes a rule for a specific patient based on the provided patient ID and rule ID.
 * Attempts to fetch all expected libraries and parameters for the rule.
 *
 * @param {string} patientId - The unique identifier of the patient
 * @param {string} ruleId - The unique identifier of the rule to execute
 * @returns {Object} The result of the CQL execution on the patient, including patient-specific results.
 */
async function executeRuleWithPatient(patientId, ruleId) {
    let patient = await getPatientResource(patientId);
    let rule = await getRule(ruleId);


    let libraries = {};
    let expectedLibraries = getListOfExpectedLibraries(rule);
    if (expectedLibraries !== undefined)
        for (const lib of expectedLibraries) {
            libraries[lib.name] = await getRule(lib.path);
        }


    let parameters = {};

    let expectedParameters = getListOfExpectedParameters(rule);

    if (expectedParameters !== undefined)
        for (const par of expectedParameters) {
            parameters[par.name] = await getFhirResource(patientId, par.type);

        }


    return await executeCql(patient, rule, libraries, parameters);
}

// Exporting global variables
global.cdss = {
    endpoints: endpoints,
    createBundle: createBundle,
    executeCql: executeCql,
    getListOfExpectedParameters: getListOfExpectedParameters,
    getListOfExpectedLibraries: getListOfExpectedLibraries,
    executeRuleWithPatient: executeRuleWithPatient,
    DEBUG_MODE: DEBUG_MODE
};

export {
    endpoints,
    createBundle,
    executeCql,
    getListOfExpectedParameters,
    getListOfExpectedLibraries,
    executeRuleWithPatient
}

