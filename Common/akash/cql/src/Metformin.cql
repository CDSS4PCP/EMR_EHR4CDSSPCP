library "Metformin" version '1'

using FHIR version '4.0.1'

include "FHIRHelpers" version '4.0.1' called FHIRHelpers

codesystem "RXNORM": 'http://www.nlm.nih.gov/research/umls/rxnorm'

valueset "Metformin AllergyIntolerance VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1078.500'
valueset "Metformin AllergyIntolerance SCT VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1078.498'
valueset "Metformin VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.2.3000'
valueset "Metformin VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.526.3.3000'
valueset "Glyburide / Metformin VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.196.12.1360'
valueset "Glyburide / Metformin VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.196.11.1361'

code "metformin code": '6809' from "RXNORM" display 'metformin'

context Patient

define "generic_medication_request_valuesets":
  [MedicationRequest: "Metformin AllergyIntolerance VS"]
    union [MedicationRequest: "Metformin AllergyIntolerance SCT VS"]
    union [MedicationRequest: "Metformin VS"]
    union [MedicationRequest: "Metformin VS_1"]
    union [MedicationRequest: "Glyburide / Metformin VS"]
    union [MedicationRequest: "Glyburide / Metformin VS_1"]

define "generic_medication_request_concepts":
  [MedicationRequest: "metformin code"]

define "generic_medication_request_union":
  "generic_medication_request_valuesets"
    union "generic_medication_request_concepts"

define "Metformin AllergyIntolerance":
  ( exists ( "generic_medication_request_union" ) ) is null

define "MeetsInclusionCriteria":
  "Metformin AllergyIntolerance"

define "InPopulation":
  "MeetsInclusionCriteria"

define "Recommendation":
  if "InPopulation" then 'Not found Metformin intolerance or Metformin, medication request can be granted' 
    else null

define "Rationale":
  if "InPopulation" then null 
    else null

define "Links":
  if "InPopulation" then null 
    else null

define "Errors":
  null