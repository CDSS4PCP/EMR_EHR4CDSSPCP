library "MMR5regular12months_4yrs_OneDoseOutOf12to15MonRecommendation" version '1'

//include "MMR_Common_Library" version '1' called Common
using FHIR version '4.0.1'

using QUICK

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

//immunization can be a list, not always only one value

parameter Imm List<Immunization>

context Patient

define function ToCode (coding FHIR.Coding):
     System.Code{
	 code: coding.code.value,
	 system: coding.system.value,
	 version: coding.version.value,
	 display: coding.display.value
	 }

//define generic MMR valuesets groups and codes union

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

//Parameters-Age1, Age2
define "CurrentAge":
  AgeInMonths() > 12
    and AgeInYears() < 4



//check to see if any existing immunization record is in MMR_Vaccine_union
//will all the vacines in the list be gone through one by one? if not, how to make them be checked one by one?

//this one dose can be from (MMR valueses OR CVS codes,) or MMR admin, however only one from either set
  
//Parameters-Immunization record and dose   
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
  
  define function MMRVaccineDate(Immunizations List<FHIR.Immunization>):
     (Imm TemDate
	 where (TemDate) in "MMR_Vaccine_union"
  return Tuple {
  Date: Date(year from TemDate.occurrence.value,
                      month from TemDate.occurrence.value,
					  day from TemDate.occurrence.value)
    }
    sort by Date)
	
	//Parameters-Admdate	
	define "AgeFirstMMR":
	difference in months between MMRVaccineDate(Imm)[0].Date and Patient.birthDate
	//difference in months between Patient.birthDate and MMRVaccineDate(Imm)[0].date


	define "AgeFirstMMRIn":
	AgeFirstMMR < 12 or AgeFirstMMR > 15

//Parameters-Admdate		
	define "Time_from_1st_dose":
	(difference in weeks between Today() and MMRVaccineDate(Imm)[0].Date) >= 4
	
	define "InDemographic":
 AgeFirstMMRIn and CurrentAge and Time_from_1st_dose


  define "InPopulation":
     	 InDemographic and MMR_Vaccine_OneDose
		 
//parameters-Todo1		 
		 define "Recommendation 1: Administer 2nd dose MMR":
		 InPopulation
		 
		 