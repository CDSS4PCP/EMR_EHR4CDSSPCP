library "MMR4regular12months_4yrs_OneMMRRecommendation" version '1'

//include "MMR_Common_Library" version '1' called Common
using FHIR version '4.0.1'

using QUICK

include "FHIRHelpers" version '4.0.1' called FHIRHelpers
include "MMR_Common_Library" version '1' called Common

//MMR valuesets and codesystems
//
//codesystem "Other": 'http://hl7.org/fhir/sid/cvx'
//
//valueset "Measles, Mumps and Rubella (MMR) Vaccine Administered VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.11.1086'
//valueset "Measles, Mumps and Rubella (MMR) Vaccine VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.196.11.1235'
//valueset "Measles, Mumps and Rubella (MMR) Vaccine VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.196.12.1224'
//valueset "Measles, Mumps and Rubella (MMR) Vaccine Administered VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.12.1031'
//valueset "Measles, Mumps and Rubella (MMR) Vaccine Administered VS_2": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.110.11.1085'
//
//code "measles, mumps, rubella, and varicella virus vaccine code": '94' from "Other" display 'measles, mumps, rubella, and varicella virus vaccine'
//code "measles, mumps and rubella virus vaccine code": '3' from "Other" display 'measles, mumps and rubella virus vaccine'

//immunization can be a list, not always only one value

parameter Imm List<Immunization>

context Patient



define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'

define "CurrentAge":
    AgeInMonths() > 12 and AgeInYears() < 4



define function FindValidCodes(codes List<FHIR.Coding>):
    codes c where Common.ToCode(c) in Common.MMR_All_Valuesets

define function FindValidVaccines(Immunizations List<Immunization>):
    Immunizations Temp where  (FindValidCodes(Temp.vaccineCode.coding)) is not null



define "MMR_Vaccine_OneDose":
    Count (FindValidVaccines (Imm))= 1

define "MMR_Dose_Count":
    Count (FindValidVaccines (Imm))
define "MMR_Doses":
    FindValidVaccines (Imm)

define "Imms":
    Imm

define function MMRVaccineDate(Immunizations List<FHIR.Immunization>):
    (Immunizations TemDate where  FindValidCodes(TemDate.vaccineCode.coding) is not null
        return Tuple {Date: Date(year from TemDate.occurrence.value,
                      month from TemDate.occurrence.value,
					  day from TemDate.occurrence.value)
					  }
    sort by Date)


define "PatientBirthDate":
    ToDate(Patient.birthDate.value)

define "VaccineDate":
    ToDate(MMRVaccineDate(Imm)[0].Date)

define "DiffInMonths":
    Abs(difference in months between "VaccineDate" and "PatientBirthDate")


define "InDemographic":
    CurrentAge


define "InPopulation":
    InDemographic and MMR_Vaccine_OneDose

define "Recommendation":
    if InPopulation then
        'Recommendation 1: Schedule 2nd dose MMR when patient is 4-6 years old'
    else
        'Does not apply'
