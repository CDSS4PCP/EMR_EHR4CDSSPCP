/**
 * Test the endpoints of the CDSS module on the clientside.
 * Checks if the required properties are present for each endpoint.
 * Requires Webpack to be run before testing clientside features.
 * Uses unit.js for testing.
 */

/* eslint no-console: 0 */
var test = require('unit.js');

/*
NOTE: Run Webpack before testing the clientside features
 */
var cdss = require('../../dist/cdss.js');

console.log('**** Testing Clientside components ****');

function testEndpoints() {

    function endpoints_metadata() {
        test.object(global.cdss.endpoints).hasProperty('metadata');
        test.object(global.cdss.endpoints['metadata']).hasProperty('systemName');
        test.object(global.cdss.endpoints['metadata']).hasProperty('remoteAddress');
    }

    function endpoints_patientById() {
        test.object(global.cdss.endpoints).hasProperty('patientById');
        test.object(global.cdss.endpoints['patientById']).hasProperty('address');
        test.object(global.cdss.endpoints['patientById']).hasProperty('method');
    }

    function endpoints_medicationRequestByPatientId() {
        test.object(global.cdss.endpoints).hasProperty('medicationRequestByPatientId');
        test.object(global.cdss.endpoints['patientById']).hasProperty('address');
        test.object(global.cdss.endpoints['patientById']).hasProperty('method');
    }

    function endpoints_medicationByMedicationRequestId() {
        test.object(global.cdss.endpoints).hasProperty('medicationByMedicationRequestId');
        test.object(global.cdss.endpoints['patientById']).hasProperty('address');
        test.object(global.cdss.endpoints['patientById']).hasProperty('method');
    }

    function endpoints_immunizationByPatientId() {
        test.object(global.cdss.endpoints).hasProperty('immunizationByPatientId');
        test.object(global.cdss.endpoints['patientById']).hasProperty('address');
        test.object(global.cdss.endpoints['patientById']).hasProperty('method');
    }

    function endpoints_conditionByPatientId() {
        test.object(global.cdss.endpoints).hasProperty('conditionByPatientId');
        test.object(global.cdss.endpoints['conditionByPatientId']).hasProperty('address');
        test.object(global.cdss.endpoints['conditionByPatientId']).hasProperty('method');
    }

    function endpoints_ruleById() {
        test.object(global.cdss.endpoints).hasProperty('ruleById');
        test.object(global.cdss.endpoints['patientById']).hasProperty('address');
        test.object(global.cdss.endpoints['patientById']).hasProperty('method');
    }


    endpoints_metadata();
    endpoints_patientById();
    endpoints_medicationRequestByPatientId();
    endpoints_medicationByMedicationRequestId();
    endpoints_immunizationByPatientId();
    endpoints_conditionByPatientId();
    endpoints_ruleById();
}

testEndpoints();

setTimeout(() => {
    console.log('**** All clientside tests passed ****');
}, 500);

