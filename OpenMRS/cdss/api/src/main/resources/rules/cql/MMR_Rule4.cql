library "MMR4regular12months_4yrs_OneMMRRecommendation" version '1.0.0'

//include "MMR_Common_Library" version '1.0.0' called Common
using FHIR version '4.0.1'

using QUICK

include "FHIRHelpers" version '4.0.1' called FHIRHelpers
include "MMR_Common_Library" version '1.0.0' called Common

//MMR valuesets and codesystems
parameter Imm List<Immunization>

context Patient



define "$Age1": 12

define "$Age1_unit": 'month'

define "$Age2": 4

define "$Age2_unit": 'year'

define "$Dose1AdminMinAge": 12

define "$Dose1AdminMinAge_unit": 'month'

define "$Dose1AdminMaxAge": 15

define "$Dose1AdminMaxAge_unit": 'month'


define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'

define "CurrentAge":
  Common.GetAge("$Age1_unit") >= "$Age1"
    and Common.GetAge("$Age2_unit") < "$Age2"




define function FindValidCodes(codes List<FHIR.Coding>):
    codes c where Common.ToCode(c) in Common.MMR_All_Valuesets

define function FindValidVaccines(Immunizations List<Immunization>):
    Immunizations Temp where (FindValidCodes(Temp.vaccineCode.coding)) is not null

//check to see if any existing immunization record is in MMR_Vaccine_union
//will all the vacines in the list be gone through one by one? if not, how to make them be checked one by one?
define "MMR_Vaccine_OneDose":
    Count(FindValidVaccines(Imm))= 1



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

define "DiffInMinAdminUnit":
    Abs(Common.GetDifferenceInUnit("VaccineDate", "PatientBirthDate", "$Dose1AdminMinAge_unit"))

define "DiffInMaxAdminUnit":
    Abs(Common.GetDifferenceInUnit("VaccineDate", "PatientBirthDate", "$Dose1AdminMaxAge_unit"))


define "InDemographic":
    CurrentAge

define "InPopulation":
    InDemographic and MMR_Vaccine_OneDose and "DiffInMinAdminUnit" >= "$Dose1AdminMinAge" and  "DiffInMaxAdminUnit" <= "$Dose1AdminMaxAge"


define "Recommendation":
    if InPopulation then
        'Recommendation 1: Schedule 2nd dose MMR when patient is 4-6 years old'
    else
        null
