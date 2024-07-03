library "MMR11MedicalContraPrecautionMMRRecommendation_Immunocompromised" version '1'

//include "MMR_Common_Library" version '1' called Common

using FHIR version '4.0.1'

include "FHIRHelpers" version '4.0.1' called FHIRHelpers

//MMR valuesets and codesystems

parameter Condition List<Condition>

valueset "Immunocompromised Conditions VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.1940'
valueset "Immunocompromised Conditions VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.2343'
valueset "Immunocompromised Conditions I10 VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.2328'
valueset "Immunocompromised Conditions VS_2": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.1740'
valueset "Immunocompromised Therapies VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.2348'
valueset "Immunocompromised Therapies I10 VS-2": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.2349'
valueset "COVID19 immunocompromised underlying condition reference set VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1181.67'
valueset "Immunocompromised Therapies I9 VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.2350'
valueset "Immunocompromised Therapies SMCT VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.2351'
valueset "Immunocompromised state for Urology Care VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1151.18'

define "generic_condition_valuesets":
  [Condition: "Immunocompromised Conditions VS"]
    union [Condition: "Immunocompromised Conditions VS_1"]
    union [Condition: "Immunocompromised Conditions I10 VS"]
    union [Condition: "Immunocompromised Conditions VS_2"]
	union [Condition: "Immunocompromised Therapies I10 VS-2"]
     union [Condition: "COVID19 immunocompromised underlying condition reference set VS"]
        union [Condition: "Immunocompromised state for Urology Care VS"]
		union [Condition:  "Immunocompromised Therapies VS"]
    	union [Condition: "Immunocompromised Therapies I9 VS"]
    union [Condition: "Immunocompromised Therapies SMCT VS"]
	
	
	

/*
define "Immunocompromised":
  ( exists ( "generic_condition_valuesets" ) ) is not null
*/

context Patient



define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'


define "InPopulation":
    exists(Condition Con where (Con) in "generic_condition_valuesets" )
   
   
   /*
   rationale
   If patient does not have MMR or MMRV records and patient is pregnant, schedule 1st dose of MMR after pregnancy and 2nd dose after 4 weeks of the 1st dose
   
   */
   
define "Recommendation 1: DO NOT ADMINISTER OR SCHEDULE MMR":
   InPopulation
   
 
define "Recommendation":
    if InPopulation then
        'Recommendation 1: DO NOT ADMINISTER OR SCHEDULE MMR'
    else
        'Does not apply'