library "MMR12MedicalContraPrecautionMMRRecommendation_HIVImmunocompromised" version '1'

//include "MMR_Common_Library" version '1' called Common

using FHIR version '4.0.1'
//using FHIR version '5'

include "FHIRHelpers" version '4.0.1' called FHIRHelpers

codesystem "CONDCLINSTATUS": 'http://terminology.hl7.org/CodeSystem/condition-clinical'

parameter Condition List<Condition>
parameter Observation List<Observation>

valueset "HIV Infection or AIDS (Disorders) (SNOMED) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.460'
valueset "HIV VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.12.1003'
valueset "HIV 1 VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.11.1005'
valueset "HIV Lab Tests VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1056.50'
valueset "HIV Infection (Tests for HIV Antibody) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.730'
valueset "Indicators of Human Immunodeficiency Virus (HIV) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1056.54'
valueset "Indicators of Human Immunodeficiency Virus (HIV) VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1056.53'
valueset "HIV Infection (ARV Combination Treatment for HIV) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1597'
valueset "HIV Infection (Tests for HIV Nucleic Acid [Qualitative]) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.728'
valueset "HIV Infection (ARV Protease Inhibitors [PIs]) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1598'
valueset "Human Immunodeficiency Virus (HIV)  Viral Load VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1056.71'
valueset "HIV Infection (Tests for HIV Nucleic Acid [Viral Load]) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.729'
valueset "HIV Infection (ARV Integrase Strand Transfer Inhibitors [INSTIs]) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1600'
valueset "HIV Infection (ARV Non nucleoside Reverse Transcriptase Inhibitors [NNRTIs]) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1595'
valueset "HIV Infection (Organism or Substance in Lab Results) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.356'
valueset "HIV Viral Load VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.12.1002'
valueset "HIV Infection (Tests for HIV Antigen) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.368'
valueset "HIV Infection (Tests for HIV by Culture and Identification Method) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.726'
valueset "HIV Infection or AIDS (Disorders) (ICD10CM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.461'
valueset "HIV Infection (ARV Boosters [CYP3A4 Inhibitor]) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1601'
valueset "HIV Infection (ARV CCR5 Antagonists) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1599'
valueset "Indicators of Human Immunodeficiency Virus (HIV) VS_2": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1056.52'
valueset "HIV 1 VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.11.1007'
valueset "HIV Tests VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1166.11'
valueset "HIV in Pregnancy Childbirth and Puerperium VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1029.272'
valueset "HIV in Pregnancy Childbirth and Puerperium VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1029.271'
valueset "ICD10 Codes for HIV Diagnosis VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1262.4'
valueset "Indicators of Human Immunodeficiency Virus (HIV) VS_3": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1056.51'
valueset "HIV Infection (Combination Tests for HIV Antigen and Antibody) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.731'
valueset "HIV VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1029.270'
valueset "HIV 1 VS_2": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.11.1006'
valueset "HIV 2 VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.11.1008'
valueset "HIV Infection (ARV Attachment Inhibitors) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1603'
valueset "HIV Infection (ARV Fusion Inhibitors) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1596'
valueset "HIV Infection (ARV Postattachment Inhibitors) (RXNORM) VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1146.1602'
valueset "ICD9 Codes for HIV Diagnosis VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1262.3'
valueset "HIV 2 VS_1": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.11.1009'
valueset "HIV 2 VS_2": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.120.11.1010'
valueset "History of HIV/AIDS ICD10CM VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1213.72'
valueset "History of HIV/AIDS SNOMED VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1213.73'

code "Condition Active code": 'active' from "CONDCLINSTATUS" display 'Active'

concept "Condition Active": { "Condition Active code" } display 'Active'

context Patient



define "VaccineName":
    'Measles, Mumps, and Rubella Virus Vaccine'


define "generic_condition_valuesets":
  [Condition: "HIV Infection or AIDS (Disorders) (SNOMED) VS"]
    union [Condition: "HIV VS"]
    union [Condition: "HIV 1 VS"]
    union [Condition: "HIV Lab Tests VS"]
    union [Condition: "HIV Infection (Tests for HIV Antibody) VS"]
    union [Condition: "Indicators of Human Immunodeficiency Virus (HIV) VS"]
    union [Condition: "Indicators of Human Immunodeficiency Virus (HIV) VS_1"]
    union [Condition: "HIV Infection (ARV Combination Treatment for HIV) (RXNORM) VS"]
    union [Condition: "HIV Infection (Tests for HIV Nucleic Acid [Qualitative]) VS"]
    union [Condition: "HIV Infection (ARV Protease Inhibitors [PIs]) (RXNORM) VS"]
    union [Condition: "Human Immunodeficiency Virus (HIV)  Viral Load VS"]
    union [Condition: "HIV Infection (Tests for HIV Nucleic Acid [Viral Load]) VS"]
    union [Condition: "HIV Infection (ARV Integrase Strand Transfer Inhibitors [INSTIs]) (RXNORM) VS"]
    union [Condition: "HIV Infection (ARV Non nucleoside Reverse Transcriptase Inhibitors [NNRTIs]) (RXNORM) VS"]
    union [Condition: "HIV Infection (Organism or Substance in Lab Results) VS"]
    union [Condition: "HIV Viral Load VS"]
    union [Condition: "HIV Infection (Tests for HIV Antigen) VS"]
    union [Condition: "HIV Infection (Tests for HIV by Culture and Identification Method) VS"]
    union [Condition: "HIV Infection or AIDS (Disorders) (ICD10CM) VS"]
    union [Condition: "HIV Infection (ARV Boosters [CYP3A4 Inhibitor]) (RXNORM) VS"]
    union [Condition: "HIV Infection (ARV CCR5 Antagonists) (RXNORM) VS"]
    union [Condition: "Indicators of Human Immunodeficiency Virus (HIV) VS_2"]
    union [Condition: "HIV 1 VS_1"]
    union [Condition: "HIV Tests VS"]
    union [Condition: "HIV in Pregnancy Childbirth and Puerperium VS"]
    union [Condition: "HIV in Pregnancy Childbirth and Puerperium VS_1"]
    union [Condition: "ICD10 Codes for HIV Diagnosis VS"]
    union [Condition: "Indicators of Human Immunodeficiency Virus (HIV) VS_3"]
    union [Condition: "HIV Infection (Combination Tests for HIV Antigen and Antibody) VS"]
    union [Condition: "HIV VS_1"]
    union [Condition: "HIV 1 VS_2"]
    union [Condition: "HIV 2 VS"]
    union [Condition: "HIV Infection (ARV Attachment Inhibitors) (RXNORM) VS"]
    union [Condition: "HIV Infection (ARV Fusion Inhibitors) (RXNORM) VS"]
    union [Condition: "HIV Infection (ARV Postattachment Inhibitors) (RXNORM) VS"]
    union [Condition: "ICD9 Codes for HIV Diagnosis VS"]
    union [Condition: "HIV 2 VS_1"]
    union [Condition: "HIV 2 VS_2"]
    union [Condition: "History of HIV/AIDS ICD10CM VS"]
    union [Condition: "History of HIV/AIDS SNOMED VS"]





define function ActiveCondition(CondList List<Condition>):
  CondList C
    where C.clinicalStatus ~ "Condition Active"
      and C.abatement is null


 define "HIV_or_AIDS":
  exists (ActiveCondition("generic_condition_valuesets") )
 
 
 valueset "CD4 Percentage VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.121.12.1005'
 valueset "CD4+ Percentage VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.121.11.1009'
 valueset "CD4 Count VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.121.12.1004'
 valueset "CD4+ Count VS": 'https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.121.11.1006'

/*
define "generic_observation_cd4percentage":
  [Observation: "CD4 Percentage VS"]
    union [Observation: "CD4+ Percentage VS"]
	
	define "generic_observation_cd4count":
	[Observation: "CD4 Count VS"]
	union [Observation: "CD4+ Count VS"]
*/


define function HighestObservation(Observation List<Observation>):
  Max(Observation O
      return FHIRHelpers.ToQuantity(O.value as FHIR.Quantity)
  )

define "CD4 Percentage":
   ((HighestObservation([Observation: "CD4 Percentage VS"]) < 15%)  
  or 
  (HighestObservation([Observation: "CD4+ Percentage VS"]) <15%)
  ) ) is not null
     



define "CD4 Count":
    ((HighestObservation([Observation: "CD4 Count VS"]) < 200/mm3)  
  or 
  (HighestObservation([Observation: "CD4+ Count VS"]) < 200/mm3)) is not null
    

define "total_CD4":
 exists (Observation obs 
 where (obs) in ("CD4 Percentage" union "CD4 Count") )


    
  define "InPopulation":
   total_CD4 and HIV_or_AIDS
   
   
   define "Recommendation 1: DO NOT ADMINISTER OR SCHEDULE MMR":
   InPopulation
   