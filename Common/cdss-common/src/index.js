import {
    createBundle,
    getCurrentTimestamp,
    executeCql,
    getListOfExpectedParameters,
    getListOfExpectedLibraries,
    FhirTypes,
    UsageStatus,
    ContainerTypes
} from './cdss-module';
import vsac from 'browserfy-cql-exec-vsac';

const DEBUG_MODE = false;


/**
 * Defines various endpoints for making API calls related to patient data, rules, usages, and VSAC services.
 * Each endpoint includes an address and an HTTP method for communication.
 */
let endpoints = {
    'metadata': {
        'systemName': null, 'remoteAddress': null,
        vsacApiKey: null

    },
    'patientById': {
        address: null,
        method: 'GET',
    },
    'medicationRequestByPatientId': {
        address: null,
        method: 'GET',
    },
    'medicationStatementByPatientId': {
        address: null,
        method: 'GET',
    },
    'medicationByMedicationRequestId': {
        address: null,
        method: 'GET'
    },
    'medicationById': {
        address: null,
        method: 'GET'
    },
    'immunizationByPatientId': {
        address: null,
        method: 'GET',
    },
    'observationByPatientId': {
        address: null,
        method: 'GET',
    },
    'conditionByPatientId': {
        address: null,
        method: 'GET',
    },
    'ruleById': {
        address: null,
        method: 'GET',
    },
    'getRules': {
        address: null,
        method: 'GET'
    },
    'getUsages': {
        address: null,
        method: 'GET'
    },
    'recordUsage': {
        address: null,
        method: 'POST'
    },
    'vsacSvs': {
        address: null

    },
    'vsacFhir': {
        address: null
    }
};


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
            timestamp: getCurrentTimestamp(),
            rule: ruleId,
            recommendations: recommendations,
            status: UsageStatus.ROUTINE
        };

        // console.log("Sending...", options.body);
        let response = await fetch(url, options);
        if (response.status !== 200) {
            throw new Error('Rule responded with HTTP ' + response.status);
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
            timestamp: getCurrentTimestamp(),
            rule: ruleId,
            recommendation: recommendation,
            status: UsageStatus.ACTED
        };
        let response = await fetch(url, options);
        if (response.status !== 200) {
            throw new Error('Rule responded with HTTP ' + response.status);
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
            timestamp: getCurrentTimestamp(),
            rule: ruleId,
            recommendation: recommendation,
            status: UsageStatus.DECLINED
        };
        let response = await fetch(url, options);
        if (response.status !== 200) {
            throw new Error('Rule responded with HTTP ' + response.status);
        }
    }
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
        let url = global.cdss.endpoints.patientById.address.replace('{{patientId}}', patientId);
        let response = await fetch(url, global.cdss.endpoints.patientById);
        if (response.status !== 200) {
            throw new Error('Patient responded with HTTP ' + response.status);
        }

        patient = await response.json();

    }
    if (patient.resourceType !== 'Patient') {
        throw new Error('Requested Patient was not a Patient, rather it is ' + patient.type);
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
                response = await fetch(global.cdss.endpoints.immunizationByPatientId.address.replace('{{patientId}}', patientId), endpoints.immunizationByPatientId);
            else if (typeof global.cdss.endpoints.immunizationByPatientId.address == 'function')
                res = await global.cdss.endpoints.immunizationByPatientId.address(patientId);
            break;

        case ContainerTypes.LIST(FhirTypes.OBSERVATION):
            if (typeof global.cdss.endpoints.observationByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.observationByPatientId.address.replace('{{patientId}}', patientId), endpoints.observationByPatientId);
            else if (typeof global.cdss.endpoints.observationByPatientId.address == 'function')
                res = await global.cdss.endpoints.observationByPatientId.address(patientId);
            break;
        case ContainerTypes.LIST(FhirTypes.MEDICATION_REQUEST):
            if (typeof global.cdss.endpoints.medicationRequestByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.medicationRequestByPatientId.address.replace('{{patientId}}', patientId), endpoints.medicationRequestByPatientId);
            else if (typeof global.cdss.endpoints.medicationRequestByPatientId.address == 'function')
                res = await global.cdss.endpoints.medicationRequestByPatientId.address(patientId);
            break;
        case ContainerTypes.LIST(FhirTypes.MEDICATION_STATEMENT):
            if (typeof global.cdss.endpoints.medicationStatementByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.medicationStatementByPatientId.address.replace('{{patientId}}', patientId), endpoints.medicationStatementByPatientId);
            else if (typeof global.cdss.endpoints.medicationStatementByPatientId.address == 'function')
                res = await global.cdss.endpoints.medicationStatementByPatientId.address(patientId);
            break;
        case ContainerTypes.LIST(FhirTypes.CONDITION):
            if (typeof global.cdss.endpoints.conditionByPatientId.address == 'string')
                response = await fetch(global.cdss.endpoints.conditionByPatientId.address.replace('{{patientId}}', patientId), endpoints.medicationRequestByPatientId);
            else if (typeof global.cdss.endpoints.conditionByPatientId.address == 'function')
                res = await global.cdss.endpoints.conditionByPatientId.address(patientId);
            break;

    }


    if (res == null) {
        if (response == null && res == null) {
            throw new Error('Could not find proper endpoint type for ' + resourceType);
        }
        if (response?.status !== 200 && res == null) {
            throw new Error(resourceType + ' responded with HTTP ' + response.status);
        }
        if (res == null && response != null)
            res = await response.json();
    }


    // if (res.resourceType !== resourceType.replace("{http://hl7.org/fhir}", "")) {
    //     throw new Error("Requested Patient was not a Patient, rather it is " + res.type);
    // }

    // TODO Need to validate res for reference links
    // Idea:
    const referenceMappings = {};
    referenceMappings[FhirTypes.MEDICATION_REQUEST] = {medicationReference: "medication", patientReference: "patient"};
    // etc

    if (resourceType == ContainerTypes.LIST(FhirTypes.MEDICATION_REQUEST)) {

    }


    if (res != null) {
        return res;
    }
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
        let url = global.cdss.endpoints.ruleById.address.replace('{{ruleId}}', ruleId);
        let response = await fetch(url, global.cdss.endpoints.ruleById);
        if (response.status !== 200) {
            throw new Error('Rule responded with HTTP ' + response.status);
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
 * @param {boolean} shouldRecordUsage - Flag to determine if the rule usage should be recorded. Default is true.
 * @returns {Object} The result of the CQL execution on the patient, including patient-specific results.
 */
async function executeRuleWithPatient(patientId, ruleId, shouldRecordUsage = true) {
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

    const codeService = new vsac.CodeService(false, true, global.cdss.endpoints.vsacSvs.address, global.cdss.endpoints.vsacFhir.address);

    // console.log("Executing CQL with ...")
    // console.log("Patient", patient)
    // console.log("rule", rule)
    // console.log("libraries", libraries)
    // console.log("parameters", JSON.stringify(parameters, null, 2))
    // console.log("codeService", codeService)

    let results = await executeCql(patient, rule, libraries, parameters, codeService, global.cdss.endpoints.metadata.vsacApiKey);
    if (shouldRecordUsage)
        await recordRoutineUsage(rule.library.identifier.id, patient.id, results[patient.id].VaccineName, results[patient.id].Recommendations);

    return results;
}

/**
 * Executes a CQL rule on a FHIR patient with specified libraries and parameters.
 * Records the routine usage of the rule for the patient if shouldRecordUsage is true.
 *
 * @param {Object} patient - The FHIR patient resource on which the CQL rule will be executed.
 * @param {Object} rule - The CQL rule to be executed.
 * @param {Array} libraries - An array of additional CQL libraries to be used in the execution.
 * @param {Object} parameters - Additional parameters to be used in the CQL execution.
 * @param {boolean} shouldRecordUsage - Flag to determine if the rule usage should be recorded. Default is true.
 * @returns {Object} The result of the CQL execution on the patient, including patient-specific results.
 */
async function executeRuleWithPatientLibsParams(patient, rule, libraries, parameters, shouldRecordUsage = true, shouldUseDefaultVsacAddress = true) {

    const codeService = new vsac.CodeService(shouldUseDefaultVsacAddress, true, global.cdss.endpoints.vsacSvs.address, global.cdss.endpoints.vsacFhir.address);
    let results = await executeCql(patient, rule, libraries, parameters, codeService, global.cdss.endpoints.metadata.vsacApiKey);
    if (shouldRecordUsage)
        await recordRoutineUsage(rule.library.identifier.id, patient.id, results[patient.id].VaccineName, results[patient.id].Recommendations);

    return results;
}

// Exporting global variables
global.cdss = {
    endpoints: endpoints,
    createBundle: createBundle,
    executeCql: executeCql,
    getListOfExpectedParameters: getListOfExpectedParameters,
    getListOfExpectedLibraries: getListOfExpectedLibraries,
    executeRuleWithPatient: executeRuleWithPatient,
    executeRuleWithPatientLibsParams: executeRuleWithPatientLibsParams,
    DEBUG_MODE: DEBUG_MODE
};

export {
    endpoints,
    createBundle,
    executeCql,
    getListOfExpectedParameters,
    getListOfExpectedLibraries,
    executeRuleWithPatient,
    executeRuleWithPatientLibsParams
};

