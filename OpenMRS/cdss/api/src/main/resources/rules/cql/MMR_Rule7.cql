library "MMR7regular4_18yrs_OneDoseRecommendation" version '1'

include "MMR_Common_Library" version '1' called Common
using FHIR version '4.0.1'

using QUICK

include "FHIRHelpers" version '4.0.1' called FHIRHelpers


parameter Imm List<Immunization>

context Patient



define "$Age1": 4
define "$Age1_unit": 'year'
define "$Age2": 18
define "$Age2_unit": 'year'
define "$WeeksSinceDose": 4
define "$WeeksSinceDose_unit": 'week'


define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'



define "CurrentAge":
  Common.GetAge("$Age1_unit") >= "$Age1"
    and Common.GetAge("$Age2_unit") < "$Age2"





define "MMR_Vaccine_OneDose":
    Count (Common.FindValidVaccines(Imm))=1

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


define "WeeksFromFirstDose":
	(difference in weeks between  PrevDoseDate and Today() )

define "TimeSinceFirstDose":
    Common.GetDifferenceInUnit(MMRVaccineDate(Imm)[0].Date, Today(), "$WeeksSinceDose_unit")


define "InPopulation":
    CurrentAge and MMR_Vaccine_OneDose and TimeSinceFirstDose < "$WeeksSinceDose"


define "Recommendation1":
    if InPopulation then
        'Administer 2nd dose MMR'
    else
        null

