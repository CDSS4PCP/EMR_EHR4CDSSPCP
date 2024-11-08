library "MMR1regularyoungerthan12monthsNoMMRRecommendation" version '1'


using FHIR version '4.0.1'

include "FHIRHelpers" version '4.0.1'
include "MMR_Common_Library" version '1' called Common


parameter Imm List<Immunization>


context Patient



define "$Age1":
    0

define "$Age1_unit":
    'month'

define "$Age2":
    12

define "$Age2_unit":
    'month'

define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'

define "PatientAge":
    AgeInMonths()

define "CurrentAge":
  Common.GetAge("$Age1_unit") >= "$Age1"
    and Common.GetAge("$Age2_unit") < "$Age2"




define "InPopulation":
   CurrentAge and  Count(Common.FindValidVaccines(Imm)) = 0

define "Recommendation1":
    if InPopulation then
        'Recommendation 1: Schedule 1st dose MMR when patient is 12-15 months'
    else null

define "Recommendation2":
    if InPopulation then
        'Recommendation 2: Schedule 2nd dose MMR when patient is 4-6 years'
    else null

