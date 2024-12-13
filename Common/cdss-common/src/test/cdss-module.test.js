/**
 * Executes tests for the executeCql function, including error cases and valid conditions.
 * Tests include throwing errors for undefined patient, rule, parameters, and libraries,
 * as well as validating a valid condition with specific parameters and libraries.
 *
 **/

/* eslint no-console: 0 */

const {executeCql, getListOfExpectedLibraries, getListOfExpectedParameters} = require('../cdss-module');
const vsac = require('cql-exec-vsac');

const fhirHelpers = require('./testResources/fhirHelpers.json'); // Update the path accordingly
const mmrCommon = require('./testResources/MMR_Common_Library.json');
const p1 = require('./testResources/p1.json');

const p2 = {
    "resourceType": "Patient",
    "id": "901e24c5-5b1f-4dd3-a085-834607f7d021",
    "meta": {
        "lastUpdated": "2024-08-08T15:48:33.000+00:00",
        "tag": [
            {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                "code": "SUBSETTED",
                "display": "Resource encoded in summary mode"
            }
        ]
    },
    "identifier": [
        {
            "id": "d87d1c6e-d472-4286-bc4e-c4ca19bf97ec",
            "extension": [
                {
                    "url": "http://fhir.openmrs.org/ext/patient/identifier#location",
                    "valueReference": {
                        "reference": "Location/736b08f9-94d6-4b50-ad58-6bc69b9cbfb8",
                        "type": "Location",
                        "display": "Ward 50"
                    }
                }
            ],
            "use": "official",
            "type": {
                "coding": [
                    {
                        "code": "05a29f94-c0ed-11e2-94be-8c13b969e334"
                    }
                ],
                "text": "OpenMRS ID"
            },
            "value": "100004N"
        }
    ],
    "active": true,
    "name": [
        {
            "id": "0f40a7bf-9ec9-49a4-8d57-c10b4333734a",
            "family": "Smith",
            "given": [
                "Mark"
            ]
        }
    ],
    "gender": "male",
    "birthDate": "2013-06-14",
    "deceasedBoolean": false,
    "address": [
        {
            "id": "60b5b897-78c5-48b3-9e43-18ea3588d95d",
            "extension": [
                {
                    "url": "http://fhir.openmrs.org/ext/address",
                    "extension": [
                        {
                            "url": "http://fhir.openmrs.org/ext/address#address1",
                            "valueString": "Address18718"
                        }
                    ]
                }
            ],
            "use": "home",
            "city": "City8718",
            "state": "State8718",
            "postalCode": "88827",
            "country": "Country8718"
        }
    ]
}

const p9 = {
    "resourceType": "Patient",
    "id": "901e24c5-5b1f-4dd3-a085-834607f7d021",
    "meta": {
        "lastUpdated": "2024-08-08T15:48:33.000+00:00",
        "tag": [
            {
                "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                "code": "SUBSETTED",
                "display": "Resource encoded in summary mode"
            }
        ]
    },
    "identifier": [
        {
            "id": "d87d1c6e-d472-4286-bc4e-c4ca19bf97ec",
            "extension": [
                {
                    "url": "http://fhir.openmrs.org/ext/patient/identifier#location",
                    "valueReference": {
                        "reference": "Location/736b08f9-94d6-4b50-ad58-6bc69b9cbfb8",
                        "type": "Location",
                        "display": "Ward 50"
                    }
                }
            ],
            "use": "official",
            "type": {
                "coding": [
                    {
                        "code": "05a29f94-c0ed-11e2-94be-8c13b969e334"
                    }
                ],
                "text": "OpenMRS ID"
            },
            "value": "100004N"
        }
    ],
    "active": true,
    "name": [
        {
            "id": "0f40a7bf-9ec9-49a4-8d57-c10b4333734a",
            "family": "Smith",
            "given": [
                "Mark"
            ]
        }
    ],
    "gender": "male",
    "birthDate": "2013-06-14",
    "deceasedBoolean": false,
    "address": [
        {
            "id": "60b5b897-78c5-48b3-9e43-18ea3588d95d",
            "extension": [
                {
                    "url": "http://fhir.openmrs.org/ext/address",
                    "extension": [
                        {
                            "url": "http://fhir.openmrs.org/ext/address#address1",
                            "valueString": "Address18718"
                        }
                    ]
                }
            ],
            "use": "home",
            "city": "City8718",
            "state": "State8718",
            "postalCode": "88827",
            "country": "Country8718"
        }
    ]
}
const imm1 = require('./testResources/imm1.json');
const r1 = require('./testResources/r1.json');
const r2 = require('./testResources/r2.json');
const r3 = require('./testResources/r3.json');
const r9 = require('./testResources/r9.json');

const VALUESETS_CACHE = './src/test/testResources/valuesets/';

const API_KEY = "c4269c97-fab9-4675-860d-6a811daf430b";
const codeService = new vsac.CodeService(VALUESETS_CACHE, true, true);

describe('executeCql function', () => {
    test('should throw an error if patient is undefined', async () => {
        await expect(executeCql(null, {})).rejects.toThrow('Patient is undefined');
    });

    test('should throw an error if rule is undefined', async () => {
        await expect(executeCql({}, null)).rejects.toThrow('Rule is undefined');
    });


    test('should throw an error if rule expects parameters but they are undefined', async () => {
        await expect(executeCql(p1, r1, {'FHIRHelpers': fhirHelpers}, {}, codeService, API_KEY))
            .rejects.toThrow('Rule expects parameter \"Imm\", but it is undefined');
    });

    test('should throw an error if rule expects libraries but they are undefined', async () => {
        await expect(executeCql(p1, r1, {}, {}, codeService, API_KEY))
            .rejects.toThrow('Rule expects library \"FHIRHelpers\", but it is undefined');
    });

    test('should throw an error if rule expects parameters but they are undefined', async () => {
        await expect(executeCql(p1, r1, {'FHIRHelpers': fhirHelpers}, null, codeService, API_KEY))
            .rejects.toThrow('Rule expects parameters, but they are undefined');
    });

    test('should throw an error if rule expects libraries but they are undefined', async () => {
        await expect(executeCql(p1, r1, null, {'Imm': imm1}, codeService, API_KEY))
            .rejects.toThrow('Rule expects libraries, but they are undefined');
    });

    test('valid condition', async () => {
        let result = await executeCql(p1, r2, {'FHIRHelpers': fhirHelpers}, {'Imm': imm1}, codeService, API_KEY);
        expect(result).not.toBeNull();
    }, 15000);

    test('valid condition9', async () => {
        let result = await executeCql(p9, r9, {
            'FHIRHelpers': fhirHelpers,
            "Common": mmrCommon
        }, {
            "Imm": {
                "resourceType": "Bundle",
                "id": "03f53f9a-0d28-4a79-8364-1e18bbacb60f",
                "meta": {
                    "lastUpdated": "2024-12-04T20:06:42.769+00:00",
                    "tag": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                            "code": "SUBSETTED",
                            "display": "Resource encoded in summary mode"
                        }
                    ]
                },
                "type": "searchset",
                "total": 0,
                "link": [
                    {
                        "relation": "self",
                        "url": "http://127.0.0.1/openmrs/ws/fhir2/R4/Immunization?_summary=data&patient=901e24c5-5b1f-4dd3-a085-834607f7d021"
                    }
                ]
            },
            "Conditions": {
                "resourceType": "Bundle",
                "id": "a36d55eb-174e-4d10-a0a9-c22b170eb8ce",
                "meta": {
                    "lastUpdated": "2024-12-05T17:05:43.984+00:00",
                    "tag": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                            "code": "SUBSETTED",
                            "display": "Resource encoded in summary mode"
                        }
                    ]
                },
                "type": "searchset",
                "total": 28,
                "link": [
                    {
                        "relation": "self",
                        "url": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition?_summary=data&patient=901e24c5-5b1f-4dd3-a085-834607f7d021"
                    },
                    {
                        "relation": "next",
                        "url": "http://127.0.0.1/openmrs/ws/fhir2/R4?_getpages=d22471ae-ae11-4112-bad9-e740e5492c0f&_getpagesoffset=10&_count=10&_bundletype=searchset"
                    }
                ],
                "entry": [
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/71f289b0-6312-45cf-82e4-3e166e1a49fe",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "71f289b0-6312-45cf-82e4-3e166e1a49fe",
                            "meta": {
                                "lastUpdated": "2021-06-15T16:17:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "156587AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "heparin allergy"
                                    },
                                    {
                                        "system": "https://cielterminology.org",
                                        "code": "156587"
                                    },
                                    {
                                        "system": "http://snomed.info/sct/",
                                        "code": "294872001"
                                    }
                                ],
                                "text": "heparin allergy"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2021-06-15T16:17:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/da833b8d-caae-4dc6-a322-e6bb0bbee95a",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "da833b8d-caae-4dc6-a322-e6bb0bbee95a",
                            "meta": {
                                "lastUpdated": "2021-06-15T16:17:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "149085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Allergy to Insect Bites"
                                    },
                                    {
                                        "system": "https://cielterminology.org",
                                        "code": "149085"
                                    },
                                    {
                                        "system": "http://snomed.info/sct/",
                                        "code": "213024000"
                                    }
                                ],
                                "text": "Allergy to Insect Bites"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2021-06-15T16:17:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/cbb94543-d95d-4fec-8a34-f5bf98f6156f",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "cbb94543-d95d-4fec-8a34-f5bf98f6156f",
                            "meta": {
                                "lastUpdated": "2021-06-15T16:17:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "112264AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Transitory tachypnea of newborn (P22.1)"
                                    }
                                ],
                                "text": "Transitory tachypnea of newborn (P22.1)"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2021-06-15T16:17:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/b4144d1f-f369-470d-bf9a-a683f8f40872",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "b4144d1f-f369-470d-bf9a-a683f8f40872",
                            "meta": {
                                "lastUpdated": "2021-12-17T15:26:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "112250AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Amputation of arm (T11.6)"
                                    }
                                ],
                                "text": "Amputation of arm (T11.6)"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2021-12-17T15:26:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/a71f07a5-e67f-4171-8a52-e752c761e645",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "a71f07a5-e67f-4171-8a52-e752c761e645",
                            "meta": {
                                "lastUpdated": "2022-02-01T13:32:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "155043AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "allergy to remifentanil"
                                    },
                                    {
                                        "system": "https://cielterminology.org",
                                        "code": "155043"
                                    },
                                    {
                                        "system": "http://snomed.info/sct/",
                                        "code": "441992007"
                                    }
                                ],
                                "text": "allergy to remifentanil"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2022-02-01T13:32:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/033a6e31-4f65-431e-9d7b-620ddfa71951",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "033a6e31-4f65-431e-9d7b-620ddfa71951",
                            "meta": {
                                "lastUpdated": "2022-02-01T13:32:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "126558AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Shigellosis"
                                    },
                                    {
                                        "system": "https://cielterminology.org",
                                        "code": "126558"
                                    },
                                    {
                                        "system": "http://snomed.info/sct/",
                                        "code": "36188001"
                                    }
                                ],
                                "text": "Shigellosis"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2022-02-01T13:32:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/6c237aee-355f-4774-89f7-562c87ce1b7a",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "6c237aee-355f-4774-89f7-562c87ce1b7a",
                            "meta": {
                                "lastUpdated": "2022-08-22T14:51:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "151292AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Personal History of Allergy to Unspecified Medicinal Agent"
                                    },
                                    {
                                        "system": "https://cielterminology.org",
                                        "code": "151292"
                                    },
                                    {
                                        "system": "http://snomed.info/sct/",
                                        "code": "312850006"
                                    }
                                ],
                                "text": "Personal History of Allergy to Unspecified Medicinal Agent"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2022-08-22T14:51:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/dee269da-97f9-4a42-b808-11bf86ea49d2",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "dee269da-97f9-4a42-b808-11bf86ea49d2",
                            "meta": {
                                "lastUpdated": "2022-09-08T18:19:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "112141AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Tuberculosis"
                                    },
                                    {
                                        "system": "https://cielterminology.org",
                                        "code": "112141"
                                    },
                                    {
                                        "system": "http://snomed.info/sct/",
                                        "code": "56717001"
                                    }
                                ],
                                "text": "Tuberculosis"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2022-09-08T18:19:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/3a948039-3239-4cfb-aa43-224be0a61995",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "3a948039-3239-4cfb-aa43-224be0a61995",
                            "meta": {
                                "lastUpdated": "2022-09-08T18:19:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "110771AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Stromal tumor of digestive system (D48.1)"
                                    }
                                ],
                                "text": "Stromal tumor of digestive system (D48.1)"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2022-09-08T18:19:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    },
                    {
                        "fullUrl": "http://127.0.0.1/openmrs/ws/fhir2/R4/Condition/1120ef7d-144c-4e15-a4d7-093b8d0a7d22",
                        "resource": {
                            "resourceType": "Condition",
                            "id": "1120ef7d-144c-4e15-a4d7-093b8d0a7d22",
                            "meta": {
                                "lastUpdated": "2022-09-09T23:02:46.000+00:00",
                                "tag": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
                                        "code": "SUBSETTED",
                                        "display": "Resource encoded in summary mode"
                                    }
                                ]
                            },
                            "extension": [
                                {
                                    "url": "http://fhir.openmrs.org/ext/non-coded-condition",
                                    "valueString": "Some non-coded condition"
                                }
                            ],
                            "clinicalStatus": {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                        "code": "active"
                                    }
                                ]
                            },
                            "code": {
                                "coding": [
                                    {
                                        "code": "112188AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                        "display": "Triplet Pregnancy (O30.1)"
                                    }
                                ],
                                "text": "Triplet Pregnancy (O30.1)"
                            },
                            "subject": {
                                "reference": "Patient/901e24c5-5b1f-4dd3-a085-834607f7d021",
                                "type": "Patient",
                                "display": "Mark Smith (OpenMRS ID: 100004N)"
                            },
                            "recordedDate": "2022-09-09T23:02:46+00:00",
                            "recorder": {
                                "reference": "Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB",
                                "type": "Practitioner",
                                "display": "Super User"
                            }
                        }
                    }
                ]
            }
        }, codeService, API_KEY);
        expect(result).not.toBeNull();
    }, 15000);

});


describe('getListOfExpectedLibraries function', () => {
    test('returns an array of expected libraries with name and path', () => {
        const rule = {
            library: {
                includes: {
                    def: [
                        {localIdentifier: 'lib1', path: '/path/to/lib1'},
                        {localIdentifier: 'lib2', path: '/path/to/lib2'},
                    ],
                },
            },
        };

        expect(getListOfExpectedLibraries(rule)).toEqual([
            {name: 'lib1', path: '/path/to/lib1'},
            {name: 'lib2', path: '/path/to/lib2'},
        ]);
    });

    test('returns undefined if rule or its properties are missing', () => {
        expect(getListOfExpectedLibraries()).toBeUndefined();
        expect(getListOfExpectedLibraries({})).toBeUndefined();
        expect(getListOfExpectedLibraries({library: {}})).toBeUndefined();
        expect(getListOfExpectedLibraries({library: {includes: {}}})).toBeUndefined();
    });

    test('returns undefined if def is not an array', () => {
        const rule = {
            library: {
                includes: {
                    def: {},
                },
            },
        };

        expect(getListOfExpectedLibraries(rule)).toBeUndefined();
    });
});


describe('getListOfExpectedParameters function', () => {
    test('should return undefined if rule or its properties are undefined', () => {
        expect(getListOfExpectedParameters()).toBeUndefined();
        expect(getListOfExpectedParameters({})).toBeUndefined();
        expect(getListOfExpectedParameters({library: {}})).toBeUndefined();
    });

    test('should return undefined if parameters.def is not an array', () => {
        const rule = {
            library: {
                parameters: {
                    def: {}
                }
            }
        };
        expect(getListOfExpectedParameters(rule)).toBeUndefined();
    });

    test('should return an array of objects with name and type properties', () => {
        const rule = {
            library: {
                parameters: {
                    def: [
                        {
                            name: 'par1',
                            parameterTypeSpecifier: {
                                name: 'Number'
                            }
                        },
                        {
                            name: 'par2',
                            parameterTypeSpecifier: {
                                type: 'Array',
                                elementType: {name: 'String'}
                            }
                        }
                    ]
                }
            }
        };
        const expected = [
            {name: 'par1', type: 'Number'},
            {name: 'par2', type: 'Array<String>'}
        ];
        expect(getListOfExpectedParameters(rule)).toEqual(expected);
    });
});
