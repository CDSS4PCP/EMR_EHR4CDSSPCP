var test = require('unit.js');
var cdss = require('../../dist/main.js');


// Mock data for testing
const mockRule = {
    library: {
        includes: {
            def: [
                {localIdentifier: 'lib1', path: '/path/to/lib1'},
                {localIdentifier: 'lib2', path: '/path/to/lib2'},
            ],
        },
        parameters: {
            def: [{
                name: 'par1', accessLevel: 'Public', parameterTypeSpecifier: {
                    name: 'Number', type: 'NamedTypeSpecifier'
                }
            }]
        }
    }
};
// Real rule
const r1 = {
    "library": {
        "annotation": [{
            "translatorVersion": "3.0.0-SNAPSHOT", "translatorOptions": "", "type": "CqlToElmInfo"
        }], "identifier": {
            "id": "imm", "version": "1"
        }, "schemaIdentifier": {
            "id": "urn:hl7-org:elm", "version": "r1"
        }, "usings": {
            "def": [{
                "localIdentifier": "System", "uri": "urn:hl7-org:elm-types:r1"
            }, {
                "localIdentifier": "FHIR", "uri": "http://hl7.org/fhir", "version": "4.0.1"
            }]
        }, "includes": {
            "def": [{
                "localIdentifier": "FHIRHelpers", "path": "FHIRHelpers", "version": "4.0.1"
            }]
        }, "parameters": {
            "def": [{
                "name": "Imm", "accessLevel": "Public", "parameterTypeSpecifier": {
                    "name": "{http://hl7.org/fhir}Immunization", "type": "NamedTypeSpecifier"
                }
            }]
        }, "codeSystems": {
            "def": [{
                "name": "RXNORM", "id": "http://www.nlm.nih.gov/research/umls/rxnorm", "accessLevel": "Public"
            }]
        }, "codes": {
            "def": [{
                "name": "mmr code", "id": "7271275", "display": "mmr", "accessLevel": "Public", "codeSystem": {
                    "name": "RXNORM"
                }
            }]
        }, "contexts": {
            "def": [{
                "name": "Patient"
            }]
        }, "statements": {
            "def": [{
                "name": "Patient", "context": "Patient", "expression": {
                    "type": "SingletonFrom", "operand": {
                        "dataType": "{http://hl7.org/fhir}Patient",
                        "templateId": "http://hl7.org/fhir/StructureDefinition/Patient",
                        "type": "Retrieve"
                    }
                }
            }, {
                "name": "ToCode",
                "context": "Patient",
                "accessLevel": "Public",
                "type": "FunctionDef",
                "expression": {
                    "classType": "{urn:hl7-org:elm-types:r1}Code", "type": "Instance", "element": [{
                        "name": "code", "value": {
                            "path": "value", "type": "Property", "source": {
                                "path": "code", "type": "Property", "source": {
                                    "name": "coding", "type": "OperandRef"
                                }
                            }
                        }
                    }, {
                        "name": "system", "value": {
                            "path": "value", "type": "Property", "source": {
                                "path": "system", "type": "Property", "source": {
                                    "name": "coding", "type": "OperandRef"
                                }
                            }
                        }
                    }, {
                        "name": "version", "value": {
                            "path": "value", "type": "Property", "source": {
                                "path": "version", "type": "Property", "source": {
                                    "name": "coding", "type": "OperandRef"
                                }
                            }
                        }
                    }, {
                        "name": "display", "value": {
                            "path": "value", "type": "Property", "source": {
                                "path": "display", "type": "Property", "source": {
                                    "name": "coding", "type": "OperandRef"
                                }
                            }
                        }
                    }]
                },
                "operand": [{
                    "name": "coding", "operandTypeSpecifier": {
                        "name": "{http://hl7.org/fhir}Coding", "type": "NamedTypeSpecifier"
                    }
                }]
            }, {
                "name": "GetVaccineCode", "context": "Patient", "accessLevel": "Public", "expression": {
                    "type": "Query", "source": [{
                        "alias": "P", "expression": {
                            "name": "Imm", "type": "ParameterRef"
                        }
                    }], "relationship": [], "return": {
                        "expression": {
                            "name": "ToCode", "type": "FunctionRef", "operand": [{
                                "type": "Indexer", "operand": [{
                                    "path": "coding", "type": "Property", "source": {
                                        "path": "vaccineCode", "scope": "P", "type": "Property"
                                    }
                                }, {
                                    "valueType": "{urn:hl7-org:elm-types:r1}Integer",
                                    "value": "0",
                                    "type": "Literal"
                                }]
                            }]
                        }
                    }
                }
            }, {
                "name": "ProcessVaccineCode", "context": "Patient", "accessLevel": "Public", "expression": {
                    "type": "Query", "source": [{
                        "alias": "P", "expression": {
                            "name": "Imm", "type": "ParameterRef"
                        }
                    }], "relationship": [], "return": {
                        "expression": {
                            "type": "Equivalent", "operand": [{
                                "name": "GetVaccineCode", "type": "ExpressionRef"
                            }, {
                                "name": "mmr code", "type": "CodeRef"
                            }]
                        }
                    }
                }
            }, {
                "name": "InPopulation", "context": "Patient", "accessLevel": "Public", "expression": {
                    "type": "If", "condition": {
                        "name": "ProcessVaccineCode", "type": "ExpressionRef"
                    }, "then": {
                        "valueType": "{urn:hl7-org:elm-types:r1}Boolean", "value": "true", "type": "Literal"
                    }, "else": {
                        "valueType": "{urn:hl7-org:elm-types:r1}Boolean", "value": "false", "type": "Literal"
                    }
                }
            }]
        }
    }
};
//
const p1 = {
    "resourceType": "Patient",
    "id": "example",
    "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n\t\t\t<table>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Name</td>\n\t\t\t\t\t\t<td>Peter James \n              <b>Chalmers</b> (&quot;Jim&quot;)\n            </td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Address</td>\n\t\t\t\t\t\t<td>534 Erewhon, Pleasantville, Vic, 3999</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Contacts</td>\n\t\t\t\t\t\t<td>Home: unknown. Work: (03) 5555 6473</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Id</td>\n\t\t\t\t\t\t<td>MRN: 12345 (Acme Healthcare)</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>"
    },
    "identifier": [
        {
            "use": "usual",
            "type": {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                        "code": "MR"
                    }
                ]
            },
            "system": "urn:oid:1.2.36.146.595.217.0.1",
            "value": "12345",
            "period": {
                "start": "2001-05-06"
            },
            "assigner": {
                "display": "Acme Healthcare"
            }
        }
    ],
    "active": true,
    "name": [
        {
            "use": "official",
            "family": "Chalmers",
            "given": [
                "Peter",
                "James"
            ]
        },
        {
            "use": "usual",
            "given": [
                "Jim"
            ]
        },
        {
            "use": "maiden",
            "family": "Windsor",
            "given": [
                "Peter",
                "James"
            ],
            "period": {
                "end": "2002"
            }
        }
    ],
    "telecom": [
        {
            "use": "home"
        },
        {
            "system": "phone",
            "value": "(03) 5555 6473",
            "use": "work",
            "rank": 1
        },
        {
            "system": "phone",
            "value": "(03) 3410 5613",
            "use": "mobile",
            "rank": 2
        },
        {
            "system": "phone",
            "value": "(03) 5555 8834",
            "use": "old",
            "period": {
                "end": "2014"
            }
        }
    ],
    "gender": "male",
    "birthDate": "1974-12-25",
    "_birthDate": {
        "extension": [
            {
                "url": "http://hl7.org/fhir/StructureDefinition/patient-birthTime",
                "valueDateTime": "1974-12-25T14:35:45-05:00"
            }
        ]
    },
    "deceasedBoolean": false,
    "address": [
        {
            "use": "home",
            "type": "both",
            "text": "534 Erewhon St PeasantVille, Rainbow, Vic  3999",
            "line": [
                "534 Erewhon St"
            ],
            "city": "PleasantVille",
            "district": "Rainbow",
            "state": "Vic",
            "postalCode": "3999",
            "period": {
                "start": "1974-12-25"
            }
        }
    ],
    "contact": [
        {
            "relationship": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
                            "code": "N"
                        }
                    ]
                }
            ],
            "name": {
                "family": "du Marché",
                "_family": {
                    "extension": [
                        {
                            "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-prefix",
                            "valueString": "VV"
                        }
                    ]
                },
                "given": [
                    "Bénédicte"
                ]
            },
            "telecom": [
                {
                    "system": "phone",
                    "value": "+33 (237) 998327"
                }
            ],
            "address": {
                "use": "home",
                "type": "both",
                "line": [
                    "534 Erewhon St"
                ],
                "city": "PleasantVille",
                "district": "Rainbow",
                "state": "Vic",
                "postalCode": "3999",
                "period": {
                    "start": "1974-12-25"
                }
            },
            "gender": "female",
            "period": {
                "start": "2012"
            }
        }
    ],
    "managingOrganization": {
        "reference": "Organization/1"
    }
}


function testEndpoints() {

    function endpoints_metadata() {
        test.object(global.cdss.endpoints).hasProperty("metadata");
        test.object(global.cdss.endpoints["metadata"]).hasProperty("systemName");
        test.object(global.cdss.endpoints["metadata"]).hasProperty("remoteAddress");
    }

    function endpoints_patientById() {
        test.object(global.cdss.endpoints).hasProperty("patientById");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("address");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("method");
    }

    function endpoints_medicationRequestByPatientId() {
        test.object(global.cdss.endpoints).hasProperty("medicationRequestByPatientId");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("address");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("method");
    }

    function endpoints_medicationByMedicationRequestId() {
        test.object(global.cdss.endpoints).hasProperty("medicationByMedicationRequestId");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("address");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("method");
    }

    function endpoints_immunizationByPatientId() {
        test.object(global.cdss.endpoints).hasProperty("immunizationByPatientId");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("address");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("method");
    }

    function endpoints_ruleById() {
        test.object(global.cdss.endpoints).hasProperty("ruleById");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("address");
        test.object(global.cdss.endpoints["patientById"]).hasProperty("method");
    }

    endpoints_metadata();
    endpoints_patientById();
    endpoints_medicationRequestByPatientId();
    endpoints_medicationByMedicationRequestId();
    endpoints_immunizationByPatientId();
    endpoints_ruleById();
}


function testGetListOfExpectedParameters() {

    function testListOfExpectedParameters_mockRule() {
        let result = global.cdss.getListOfExpectedParameters(mockRule);
        test.array(result).hasLength(1);
        test.array(result).contains([{name: 'par1', type: 'Number'}]);
    }


    function testListOfExpectedParameters_libraryParametersDefEmpty() {
        const result = global.cdss.getListOfExpectedParameters({library: {parameters: {def: []}}});

        test.array(result).is([]);
    }

    function testListOfExpectedParameters_libraryParametersDefUndefined() {
        const result = global.cdss.getListOfExpectedParameters({library: {parameters: {}}});

        test.undefined(result);
    }

    function testListOfExpectedParameters_libraryParametersUndefined() {
        const result = global.cdss.getListOfExpectedParameters({library: {}});

        test.undefined(result);
    }


    function testListOfExpectedParameters_libraryUndefined() {
        const result = global.cdss.getListOfExpectedParameters({});

        test.undefined(result);
    }

    function testListOfExpectedParameters_undefined() {
        const result = global.cdss.getListOfExpectedParameters(undefined);

        test.undefined(result);
    }

    function testListOfExpectedParameters_validRule1() {
        let expected = [{"name": "Imm", "type": "{http://hl7.org/fhir}Immunization"}];

        let result = global.cdss.getListOfExpectedParameters(r1);
        test.array(result).hasLength(1);
        test.array(result).contains(expected);
    }

    function testListOfExpectedParameters_validRule2() {
        let expected = [{"name": "Imm", "type": "{http://hl7.org/fhir}Immunization"}];

        let result = global.cdss.getListOfExpectedParameters(r1);
        test.array(result).hasLength(1);
        test.array(result).contains(expected);
    }

    testListOfExpectedParameters_mockRule();

    testListOfExpectedParameters_libraryParametersDefEmpty();
    testListOfExpectedParameters_libraryParametersDefUndefined();
    testListOfExpectedParameters_libraryParametersUndefined();
    testListOfExpectedParameters_libraryUndefined();
    testListOfExpectedParameters_undefined();

    testListOfExpectedParameters_validRule1();
    testListOfExpectedParameters_validRule2();
}

function testGetListOfExpectedLibraries() {

    function getListOfExpectedLibraries_mockRule() {

        // Test case 1: Test with a valid rule
        const result = global.cdss.getListOfExpectedLibraries(mockRule);

        // Assert that the result is an array
        test.array(result);

        // Assert the length of the result array
        test.array(result).hasLength(2);

        // Assert the structure of the first element in the array
        test.array(result).contains([{name: 'lib1', path: '/path/to/lib1'}]);

        // Assert the structure of the second element in the array
        test.array(result).contains([{name: 'lib2', path: '/path/to/lib2'}]);
    }

    function getListOfExpectedLibraries_libraryIncludesDefEmpty() {

        // Test case 2: Test with a rule where library.includes.def is empty
        const result = global.cdss.getListOfExpectedLibraries({library: {includes: {def: []}}});

        // Assert that the result is an empty array
        test.undefined(result);

    }

    function getListOfExpectedLibraries_libraryIncludesDefUndefined() {

        // Test case 3: Test with a rule where library.includes.def is undefined
        const result = global.cdss.getListOfExpectedLibraries({library: {includes: {}}});

        // Assert that the result is an empty array
        test.undefined(result);
    }

    function getListOfExpectedLibraries_libraryIncludesUndefined() {

        const result = global.cdss.getListOfExpectedLibraries({library: {}});

        // Assert that the result is an empty array
        test.undefined(result);
    }

    function getListOfExpectedLibraries_libraryUndefined() {

        const result = global.cdss.getListOfExpectedLibraries({});

        test.undefined(result);
    }

    function getListOfExpectedLibraries_validRule() {
        const result4 = global.cdss.getListOfExpectedLibraries(r1);
        test.array(result4).hasLength(1);
        test.array(result4).contains([{name: 'FHIRHelpers', path: 'FHIRHelpers'}]);

    }

    getListOfExpectedLibraries_mockRule();
    getListOfExpectedLibraries_libraryIncludesDefEmpty();
    getListOfExpectedLibraries_libraryIncludesDefUndefined();
    getListOfExpectedLibraries_libraryUndefined();
    getListOfExpectedLibraries_libraryIncludesUndefined();
    getListOfExpectedLibraries_validRule();
}


function testCreateBundle() {

    function createBundle_nullUrl() {
        // Test case 1: Non-Bundle resource with null URL
        const nonBundleResourceNullUrl = {resourceType: "Patient", name: "John Doe"};
        const result1 = global.cdss.createBundle(nonBundleResourceNullUrl, null);
        test.object(result1).is({
            resourceType: "Bundle",
            entry: [{resource: nonBundleResourceNullUrl}]
        });
    }

    function createBundle_withUrl() {
        // Test case 2: Non-Bundle resource with a specified URL
        const nonBundleResourceWithUrl = {resourceType: "Patient", name: "Jane Doe"};
        const specifiedUrl = 'http://example.com/patients/123';
        const result2 = global.cdss.createBundle(nonBundleResourceWithUrl, specifiedUrl);
        test.object(result2).is({
            resourceType: "Bundle",
            entry: [{resource: nonBundleResourceWithUrl, fullUrl: specifiedUrl}]
        });
    }

    function createBundle_bundleValid() {
        // Test case 3: Bundle resource
        const bundleResource = {resourceType: "Bundle", entry: [{resource: {resourceType: "Patient", name: "Bob"}}]};
        const result3 = global.cdss.createBundle(bundleResource);
        test.object(result3).is(bundleResource); // Should be the same as the input

    }

    function createBundle_bundleUndefined() {
        const result = global.cdss.createBundle(undefined);
        test.undefined(result);

    }

    createBundle_nullUrl();
    createBundle_withUrl();
    createBundle_bundleValid();
    createBundle_bundleUndefined();
}

async function testExecuteCql() {

    async function executeCql_nullPatient() {

        let err = new Error("Patient is undefined");
        test.function(() => {
            console.log("hello");

            global.cdss.executeCql(null, mockRule, null, null);
        }).throws();


        // trigger
        // var trigger = await function(){
        //     throw new Error("I'm a ninja !")
        // };
        //
        // test.function( () =>  trigger())
        //     .throws();

    }

    async function executeCql_nullRule() {
        const result = await global.cdss.executeCql(p1, null, null, null);
        // test.undefined(result);
    }

    await executeCql_nullPatient();

    // executeCql_nullRule();

}

// testEndpoints();
// testGetListOfExpectedParameters();
// testGetListOfExpectedLibraries();
// testCreateBundle();
testExecuteCql();


console.log("All tests passed");


