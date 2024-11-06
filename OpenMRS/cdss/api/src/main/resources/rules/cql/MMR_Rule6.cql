library "MMR6regular12months_4yrs_OneDoseOutOf12to15MonRecommendation" version '1'

include "MMR_Common_Library" version '1' called Common
using FHIR version '4.0.1'

using QUICK

include "FHIRHelpers" version '4.0.1' called FHIRHelpers


//immunization can be a list, not always only one value
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

define "$WeeksSinceDose": 4

define "$WeeksSinceDose_unit": 'week'



define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'




define "CurrentAge":
  Common.GetAge("$Age1_unit") >= "$Age1"
    and Common.GetAge("$Age2_unit") < "$Age2"




//check to see if any existing immunization record is in MMR_Vaccine_union
//will all the vacines in the list be gone through one by one? if not, how to make them be checked one by one?

//this one dose can be from (MMR valueses OR CVS codes,) or MMR admin, however only one from either set


define "MMR_Vaccine_OneDose":
    Count (Common.FindValidVaccines (Imm))=1

define function MMRVaccineDate(Immunizations List<FHIR.Immunization>):
     (Imm TemDate
	 where (Common.FindValidCodes(TemDate.vaccineCode.coding)) in Common.MMR_All_Valuesets
  return Tuple {
  Date: Date(year from TemDate.occurrence.value,
                      month from TemDate.occurrence.value,
					  day from TemDate.occurrence.value)
    }
    sort by Date)

define "PrevDoseDate":
    MMRVaccineDate(Imm)[0].Date

define "PatientBirthDate":
    ToDate(Patient.birthDate.value)



define "AgeFirstFirstDoseMonths":
    months between Patient.birthDate and PrevDoseDate // This does not take years into account


define "DiffInMinAdminUnit":
    Abs(Common.GetDifferenceInUnit("PrevDoseDate", "PatientBirthDate", "$Dose1AdminMinAge_unit"))

define "DiffInMaxAdminUnit":
    Abs(Common.GetDifferenceInUnit("PrevDoseDate", "PatientBirthDate", "$Dose1AdminMaxAge_unit"))





define "AgeFirstMMRIn":
    "DiffInMinAdminUnit" < "$Dose1AdminMinAge" or  "DiffInMaxAdminUnit" > "$Dose1AdminMaxAge"


define "WeeksFromFirstDose":
    (difference in weeks between MMRVaccineDate(Imm)[0].Date and Today() )

define "TimeSinceFirstDose":
    Common.GetDifferenceInUnit(MMRVaccineDate(Imm)[0].Date, Today(), "$WeeksSinceDose_unit")




define "InPopulation":
    MMR_Vaccine_OneDose and AgeFirstMMRIn and CurrentAge and TimeSinceFirstDose < "$WeeksSinceDose"

 define "Recommendation1":
     if InPopulation then
        'Schedule 2nd dose >= 4 wk of 1st dose'
     else
        null
