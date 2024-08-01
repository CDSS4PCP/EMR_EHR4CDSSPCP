library "MMR2regularyoungerthan12_47monthsNoMMRRecommendation" version '1'


using FHIR version '4.0.1'

include "FHIRHelpers" version '4.0.1' called FHIRHelpers
include "MMR_Common_Library" version '1' called Common


parameter Imm List<Immunization>

context Patient



define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'



define "CurrentAge":
  AgeInMonths() >= 12
    and AgeInMonths() <= 47


define "MMRVaccine_NonExist":
  Count(Common.FindValidVaccines(Imm)) = 0

define "InPopulation":
   CurrentAge and MMRVaccine_NonExist

define "Recommendation1":
    if InPopulation then
        'Recommendation 1: Adminster 1st dose'
    else
        null

define "Recommendation2":
    if InPopulation then
        'Schedule 2nd dose 4-6 yr of age'
    else
        null


define "Recommendation":
    if InPopulation then
        {Recommendation1, Recommendation2}
    else
        null

