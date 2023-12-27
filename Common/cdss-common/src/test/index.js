var test = require('unit.js');
var cdss = require('../../dist/main.js');


// console.log(global.cdss);

// Testing getListOfExpectedParameters()


function testGetListOfExpectedParameters1() {
    let r1 = {
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
    let expect = [{"name": "Imm", "type": "{http://hl7.org/fhir}Immunization"}];

    let result = global.cdss.getListOfExpectedParameters(r1);
    test.array(result).is(expect);

}

function testGetListOfExpectedParameters2() {
    let r1 = {
        "library": {
            "annotation": [{
                "translatorVersion": "3.0.0-SNAPSHOT", "translatorOptions": "", "type": "CqlToElmInfo"
            }], "identifier": {
                "id": "medrx0312", "version": "1"
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
                    "name": "PrescriptionRequest", "accessLevel": "Public", "parameterTypeSpecifier": {
                        "name": "{http://hl7.org/fhir}MedicationRequest", "type": "NamedTypeSpecifier"
                    }
                }]
            }, "codeSystems": {
                "def": [{
                    "name": "RXNORM", "id": "http://www.nlm.nih.gov/research/umls/rxnorm", "accessLevel": "Public"
                }]
            }, "codes": {
                "def": [{
                    "name": "phenytoin code",
                    "id": "1313112",
                    "display": "phenytoin",
                    "accessLevel": "Public",
                    "codeSystem": {
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
                    "name": "ProcessMedication1", "context": "Patient", "accessLevel": "Public", "expression": {
                        "type": "Query", "source": [{
                            "alias": "P", "expression": {
                                "name": "PrescriptionRequest", "type": "ParameterRef"
                            }
                        }], "relationship": [], "return": {
                            "expression": {
                                "path": "reference", "type": "Property", "source": {
                                    "path": "medication", "scope": "P", "type": "Property"
                                }
                            }
                        }
                    }
                }, {
                    "name": "ProcessMedication2", "context": "Patient", "accessLevel": "Public", "expression": {
                        "type": "Query", "source": [{
                            "alias": "P", "expression": {
                                "name": "PrescriptionRequest", "type": "ParameterRef"
                            }
                        }], "relationship": [], "return": {
                            "expression": {
                                "path": "coding", "type": "Property", "source": {
                                    "path": "medication", "scope": "P", "type": "Property"
                                }
                            }
                        }
                    }
                }]
            }
        }
    };
    let expect = [{"name": "PrescriptionRequest", "type": "{http://hl7.org/fhir}MedicationRequest"}];

    let result = global.cdss.getListOfExpectedParameters(r1);
    test.array(result).is(expect);

}

// testGetListOfExpectedParameters1();
// testGetListOfExpectedParameters2();


// Mock data for testing
const mockRule = {
    library: {
        includes: {
            def: [
                {localIdentifier: 'lib1', path: '/path/to/lib1'},
                {localIdentifier: 'lib2', path: '/path/to/lib2'},
            ],
        },
    },
};

// Test case 1: Test with a valid rule
const result = global.cdss.getListOfExpectedLibraries(mockRule);

console.log(result);

// Assert that the result is an array
test.array(result);

// Assert the length of the result array
test.array(result).hasLength(2);

// Assert the structure of the first element in the array
test.array(result).contains([{ name: 'lib1', path: '/path/to/lib1' }]);

// Assert the structure of the second element in the array
test.array(result).contains([{name: 'lib2', path: '/path/to/lib2'}]);

// Test case 2: Test with a rule where library.includes.def is empty
const result2 = global.cdss.getListOfExpectedLibraries({library: {includes: {def: []}}});

// Assert that the result is an empty array
test.array(result2).is([]);

// You can add more assertions if needed

// Test case 3: Test with a rule where library.includes.def is undefined
const result3 = global.cdss.getListOfExpectedLibraries({library: {includes: {}}});

// Assert that the result is an empty array
test.array(result3).is([]);

// Test case 4: Test with a rule where library.includes.def is not present
const result4 = global.cdss.getListOfExpectedLibraries({library: {}});

// Assert that the result is an empty array
test.array(result4).is([]);

// You can add more test cases as needed
