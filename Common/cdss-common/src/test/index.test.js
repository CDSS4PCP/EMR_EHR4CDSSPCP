var test = require('unit.js');
var cdss = require('../../dist/cdss.js');


const fhirHelpers = require('./testResources/fhirHelpers.json');


// Mock data for testing
const mockRule = {
  library: {
    includes: {
      def: [{localIdentifier: 'lib1', path: '/path/to/lib1'}, {localIdentifier: 'lib2', path: '/path/to/lib2'},],
    }, parameters: {
      def: [{
        name: 'par1', accessLevel: 'Public', parameterTypeSpecifier: {
          name: 'Number', type: 'NamedTypeSpecifier'
        }
      }]
    }
  }
};


// Real rule
const r1 = require('./testResources/r1.json');

// Patient
const p1 = require('./testResources/p1.json');

// Immunization
const imm1 = require('./testResources/imm1.json');


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



//
// function testGetListOfExpectedParameters() {
//
//     function testListOfExpectedParameters_mockRule() {
//         let result = global.cdss.getListOfExpectedParameters(mockRule);
//         test.array(result).hasLength(1);
//         test.array(result).contains([{name: 'par1', type: 'Number'}]);
//     }
//
//
//     function testListOfExpectedParameters_libraryParametersDefEmpty() {
//         const result = global.cdss.getListOfExpectedParameters({library: {parameters: {def: []}}});
//
//         test.array(result).is([]);
//     }
//
//     function testListOfExpectedParameters_libraryParametersDefUndefined() {
//         const result = global.cdss.getListOfExpectedParameters({library: {parameters: {}}});
//
//         test.undefined(result);
//     }
//
//     function testListOfExpectedParameters_libraryParametersUndefined() {
//         const result = global.cdss.getListOfExpectedParameters({library: {}});
//
//         test.undefined(result);
//     }
//
//
//     function testListOfExpectedParameters_libraryUndefined() {
//         const result = global.cdss.getListOfExpectedParameters({});
//
//         test.undefined(result);
//     }
//
//     function testListOfExpectedParameters_undefined() {
//         const result = global.cdss.getListOfExpectedParameters(undefined);
//
//         test.undefined(result);
//     }
//
//     function testListOfExpectedParameters_validRule1() {
//         let expected = [{"name": "Imm", "type": "{http://hl7.org/fhir}Immunization"}];
//
//         let result = global.cdss.getListOfExpectedParameters(r1);
//         test.array(result).hasLength(1);
//         test.array(result).contains(expected);
//     }
//
//     function testListOfExpectedParameters_validRule2() {
//         let expected = [{"name": "Imm", "type": "{http://hl7.org/fhir}Immunization"}];
//
//         let result = global.cdss.getListOfExpectedParameters(r1);
//         test.array(result).hasLength(1);
//         test.array(result).contains(expected);
//     }
//
//     testListOfExpectedParameters_mockRule();
//
//     testListOfExpectedParameters_libraryParametersDefEmpty();
//     testListOfExpectedParameters_libraryParametersDefUndefined();
//     testListOfExpectedParameters_libraryParametersUndefined();
//     testListOfExpectedParameters_libraryUndefined();
//     testListOfExpectedParameters_undefined();
//
//     testListOfExpectedParameters_validRule1();
//     testListOfExpectedParameters_validRule2();
// }
//
// function testGetListOfExpectedLibraries() {
//
//     function getListOfExpectedLibraries_mockRule() {
//
//         // Test case 1: Test with a valid rule
//         const result = global.cdss.getListOfExpectedLibraries(mockRule);
//
//         // Assert that the result is an array
//         test.array(result);
//
//         // Assert the length of the result array
//         test.array(result).hasLength(2);
//
//         // Assert the structure of the first element in the array
//         test.array(result).contains([{name: 'lib1', path: '/path/to/lib1'}]);
//
//         // Assert the structure of the second element in the array
//         test.array(result).contains([{name: 'lib2', path: '/path/to/lib2'}]);
//     }
//
//     function getListOfExpectedLibraries_libraryIncludesDefEmpty() {
//
//         // Test case 2: Test with a rule where library.includes.def is empty
//         const result = global.cdss.getListOfExpectedLibraries({library: {includes: {def: []}}});
//
//         // Assert that the result is an empty array
//         test.array(result).hasLength(0)
//
//     }
//
//     function getListOfExpectedLibraries_libraryIncludesDefUndefined() {
//
//         // Test case 3: Test with a rule where library.includes.def is undefined
//         const result = global.cdss.getListOfExpectedLibraries({library: {includes: {}}});
//
//         // Assert that the result is an empty array
//         test.undefined(result);
//     }
//
//     function getListOfExpectedLibraries_libraryIncludesUndefined() {
//
//         const result = global.cdss.getListOfExpectedLibraries({library: {}});
//
//         // Assert that the result is an empty array
//         test.undefined(result);
//     }
//
//     function getListOfExpectedLibraries_libraryUndefined() {
//
//         const result = global.cdss.getListOfExpectedLibraries({});
//
//         test.undefined(result);
//     }
//
//     function getListOfExpectedLibraries_validRule() {
//         const result4 = global.cdss.getListOfExpectedLibraries(r1);
//         test.array(result4).hasLength(1);
//         test.array(result4).contains([{name: 'FHIRHelpers', path: 'FHIRHelpers'}]);
//
//     }
//
//     getListOfExpectedLibraries_mockRule();
//     getListOfExpectedLibraries_libraryIncludesDefEmpty();
//     getListOfExpectedLibraries_libraryIncludesDefUndefined();
//     getListOfExpectedLibraries_libraryUndefined();
//     getListOfExpectedLibraries_libraryIncludesUndefined();
//     getListOfExpectedLibraries_validRule();
// }
//
//
// function testCreateBundle() {
//
//     function createBundle_nullUrl() {
//         // Test case 1: Non-Bundle resource with null URL
//         const nonBundleResourceNullUrl = {resourceType: "Patient", name: "John Doe"};
//         const result1 = global.cdss.createBundle(nonBundleResourceNullUrl, null);
//         test.object(result1).is({
//             resourceType: "Bundle", entry: [{resource: nonBundleResourceNullUrl}]
//         });
//     }
//
//     function createBundle_withUrl() {
//         // Test case 2: Non-Bundle resource with a specified URL
//         const nonBundleResourceWithUrl = {resourceType: "Patient", name: "Jane Doe"};
//         const specifiedUrl = 'http://example.com/patients/123';
//         const result2 = global.cdss.createBundle(nonBundleResourceWithUrl, specifiedUrl);
//         test.object(result2).is({
//             resourceType: "Bundle", entry: [{resource: nonBundleResourceWithUrl, fullUrl: specifiedUrl}]
//         });
//     }
//
//     function createBundle_bundleValid() {
//         // Test case 3: Bundle resource
//         const bundleResource = {resourceType: "Bundle", entry: [{resource: {resourceType: "Patient", name: "Bob"}}]};
//         const result3 = global.cdss.createBundle(bundleResource);
//         test.object(result3).is(bundleResource); // Should be the same as the input
//
//     }
//
//     function createBundle_bundleUndefined() {
//         const result = global.cdss.createBundle(undefined);
//         test.undefined(result);
//
//     }
//
//     createBundle_nullUrl();
//     createBundle_withUrl();
//     createBundle_bundleValid();
//     createBundle_bundleUndefined();
// }
//
// function testExecuteCql() {
//
//     function executeCql_nullPatient() {
//
//         let expectedError = new Error("Patient is undefined");
//
//         var trigger = function () {
//
//             global.cdss.executeCql(null, mockRule, null, null).then(result => {
//                 test.fail(`Test should have passed with error "${expectedError.message}"  but did not!`);
//             })
//                 .catch(e => {
//                     if (e.message !== expectedError.message) {
//                         test.fail(`Test should have passed with error "${expectedError.message}"  but the error was "${e.message}!"`);
//                     }
//                 });
//         };
//
//         test.given(trigger);
//
//     }
//
//     function executeCql_nullRule() {
//
//
//         let expectedError = new Error("Rule is undefined");
//
//         var trigger = function () {
//
//             global.cdss.executeCql(p1, null, null, null).then(result => {
//                 test.fail(`Test should have passed with error "${expectedError.message}"  but did not!`);
//             })
//                 .catch(e => {
//                     if (e.message !== expectedError.message) {
//                         test.fail(`Test should have passed with error "${expectedError.message}"  but the error was "${e.message}!"`);
//                     }
//                 });
//         };
//
//         test.given(trigger);
//
//     }
//
//
//     function executeCql_valid() {
//         var trigger = function () {
//
//             global.cdss.executeCql(p1, r1, {"FHIRHelpers": fhirHelpers}, {"Imm": imm1})
//                 .catch(e => {
//                     test.fail(`Test should have passed without error but got error "${e.message}!"`);
//
//                 });
//         };
//
//         test.given(trigger);
//     }
//
//     function executeCql_nullParameters() {
//         let expectedError = new Error("Rule expects parameters, but they are undefined");
//
//         var trigger = function () {
//
//             global.cdss.executeCql(p1, r1, {"FHIRHelpers": fhirHelpers}, null)
//             //     .then(result => {
//             //     test.fail(`Test should have passed with error "${expectedError.message}" but did not!`);
//             // })
//                 .catch(e => {
//                     console.log(e.message);
//                     if (e.message !== expectedError.message) {
//                         test.fail(`Test should have passed with error "${expectedError.message}"  but the error was "${e.message}!"`);
//                     }
//                 });
//         };
//
//         test.given(trigger);
//     }
//
//     function executeCql_nullParameter() {
//         let expectedError = new Error("Rule expects parameter \"Imm\", but it is undefined");
//
//         var trigger = function () {
//
//             global.cdss.executeCql(p1, r1, {"FHIRHelpers": fhirHelpers}, null)
//                 .then(result => {
//
//                     console.log("This should not print")
//                 // test.fail(`Test should have passed with error "${expectedError.message}" but did not!`);
//             })
//                 .catch(e => {
//                     console.log(e.message);
//                     if (e.message !== expectedError.message) {
//                         test.fail(`Test should have passed with error "${expectedError.message}"  but the error was "${e.message}!"`);
//                     }
//                 });
//         };
//
//         test.given(trigger);
//     }
//
//     function executeCql_nullLibraries() {
//         let expectedError = new Error("Rule expects libraries, but they are undefined");
//
//         var trigger = function () {
//
//             global.cdss.executeCql(p1, r1, null, {"Imm": imm1})
//                 .then(result => {
//                     test.fail(`Test should have passed with error "${expectedError.message}" but did not!`);
//                 })
//                 .catch(e => {
//                     if (e.message !== expectedError.message) {
//                         test.fail(`Test should have passed with error "${expectedError.message}"  but the error was "${e.message}!"`);
//                     }
//                 });
//         };
//
//         test.given(trigger);
//     }
//
//     function executeCql_nullLibrary() {
//         let expectedError = new Error("Rule expects library \"FHIRHelpers\", but it is undefined");
//
//         var trigger = function () {
//
//             global.cdss.executeCql(p1, r1, {}, {"Imm": imm1})
//                 .then(result => {
//                     test.fail(`Test should have passed with error "${expectedError.message}" but did not!`);
//                 })
//                 .catch(e => {
//                     if (e.message !== expectedError.message) {
//                         test.fail(`Test should have passed with error "${expectedError.message}"  but the error was "${e.message}!"`);
//                     }
//                 });
//         };
//
//         test.given(trigger);
//     }
//
//     executeCql_nullPatient();
//     executeCql_nullRule();
//     executeCql_nullParameters();
//     executeCql_nullParameter();
//     executeCql_nullLibraries();
//     executeCql_nullLibrary();
//     executeCql_valid();
//
//
// }

testEndpoints();
// testGetListOfExpectedParameters();
// testGetListOfExpectedLibraries();
// testCreateBundle();
// testExecuteCql();

setTimeout(() => {
  console.log('All tests passed');
}, 500);

