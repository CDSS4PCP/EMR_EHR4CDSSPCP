library "MMR10MedicalContraPrecautionMMRRecommendation" version '1'

//include "MMR_Common_Library" version '1' called Common

using FHIR version '4.0.1'

include "FHIRHelpers" version '4.0.1' called FHIRHelpers

//MMR valuesets and codesystems

codesystem "Other": 'http://hl7.org/fhir/sid/cvx'

valueset "Measles, Mumps and Rubella (MMR) Vaccine Administered VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.11.1086'
valueset "Measles, Mumps and Rubella (MMR) Vaccine VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.196.11.1235'
valueset "Measles, Mumps and Rubella (MMR) Vaccine VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.196.12.1224'
valueset "Measles, Mumps and Rubella (MMR) Vaccine Administered VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1031'
valueset "Measles, Mumps and Rubella (MMR) Vaccine Administered VS_2": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.11.1085'

code "measles, mumps, rubella, and varicella virus vaccine code": '94' from "Other" display 'measles, mumps, rubella, and varicella virus vaccine'
code "measles, mumps and rubella virus vaccine code": '03' from "Other" display 'measles, mumps and rubella virus vaccine'

valueset "Pregnant (ICD10CM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1986'
valueset "Pregnant (SNOMED) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.676'
valueset "Pregnant State VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3157.4055'
valueset "Obstetrical or Pregnancy Related Conditions VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.117.1.7.1.263'
valueset "Pregnancy VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1078.264'



parameter Imm List<Immunization>
parameter Condition List<Condition>

context Patient


define function ToCode(coding FHIR.Coding):
     System.Code {
	 code: coding.code.value,
	 system: coding.system.value,
	 version: coding.version.value,
	 display: coding.display.value
	 }


define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'

define "MMR_Vaccine_valuesets":
      [Immunization: "Measles, Mumps and Rubella (MMR) Vaccine VS"]
    union [Immunization: "Measles, Mumps and Rubella (MMR) Vaccine VS_1"]
    
		define "MMR_Vaccine_Admin_valuesets":
  [Immunization: "Measles, Mumps and Rubella (MMR) Vaccine Administered VS"]
        union [Immunization: "Measles, Mumps and Rubella (MMR) Vaccine Administered VS_1"]
    union [Immunization: "Measles, Mumps and Rubella (MMR) Vaccine Administered VS_2"]

define "MMR_Vaccine_CVXCodes":
  [Immunization: "measles, mumps, rubella, and varicella virus vaccine code"]
    union [Immunization: "measles, mumps and rubella virus vaccine code"]

define "MMR_Vaccine_union":
"MMR_Vaccine_valuesets" 
union "MMR_Vaccine_Admin_valuesets" 
union "MMR_Vaccine_CVXCodes"


  
  define function CheckMMRdose(Immunizations List<FHIR.Immunization>):
    Imm Temp
	where (Temp) in ("MMR_Vaccine_CVXCodes" union "MMR_Vaccine_valuesets")
	return Temp
	
	define function CheckMMRAdmin(Immunizations List<FHIR.Immunization>):
	Imm TempAdm
	where (TempAdm) in "MMR_Vaccine_Admin_valuesets"
	return TempAdm
  
  define "MMR_Vaccine_OneDose":
    Count (CheckMMRdose (Imm))=1 or Count(CheckMMRAdmin(Imm))=1
  
  define "Pregnant_valuesets":
  [Condition: "Pregnant (ICD10CM) VS"]
    union [Condition: "Pregnant (SNOMED) VS"]
    union [Condition: "Pregnant State VS"]
    union [Condition: "Obstetrical or Pregnancy Related Conditions VS"]
	union [Condition: "Pregnancy VS"]
  
  
  define "Pregnant_Exist":
  exists(Condition Con
where (Con) in "Pregnant_valuesets")
  
  

define "InPopulation":
   MMR_Vaccine_OneDose and Pregnant_Exist
   
   
   /*
   rationale
   If patient does not have MMR or MMRV records and patient is pregnant, schedule 1st dose of MMR after pregnancy and 2nd dose after 4 weeks of the 1st dose
   
   */
   
define "Recoomendation 1: Schedule 1st dose MMR after pregnancy":
   InPopulation
   
define "Recoomendation 2: Schedule 2nd dose MMR after 4 weeks of 1st dose":
   InPopulation



define "Recommendation":
    if InPopulation then
        'Recoomendation 1: Schedule 1st dose MMR after pregnancy Recoomendation 2: Schedule 2nd dose MMR after 4 weeks of 1st dose'
    else
        'Does not apply'