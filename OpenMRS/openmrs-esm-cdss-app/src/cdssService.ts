import { openmrsFetch } from "@openmrs/esm-framework";
import "./cdss.js";
import { types } from "sass";
import List = types.List;
import { CdssUsage } from "./cdssTypes";

const VSAC_API_KEY = ""; // Your api key goes here
function convertDateToTimestamp(date: Date) {
  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
}

async function loadPatient(patientId) {
  const result = await openmrsFetch(`/ws/fhir2/R4/Patient/${patientId}`, {});
  const pat = await result.json();
  return pat;
}

async function loadRule(ruleId) {
  let url = `/cdss/rule/${ruleId}`;
  if (!ruleId.endsWith(".json")) {
    url = `/cdss/rule/${ruleId}.json`;
  }

  const result = await openmrsFetch(url, {});
  const pat = await result.json();
  return pat;
}

async function loadImmunizations(patientId) {
  const result = await openmrsFetch(
    `/ws/fhir2/R4/Immunization?patient=${patientId}`,
    {}
  );
  const imm = await result.json();
  if (imm == undefined) {
    return [];
  }
  return imm;
}

// const recordRuleUsage = (
//   ruleId: string,
//   patientId: string,
//   vaccine: string,
//   recommendations: List,
//   status: string
// ) => {
//   const ac: AbortController = new AbortController();
//
//   const payload = {
//     vaccine: vaccine,
//     patientId: patientId,
//     timestamp: getCurrentTimestamp(),
//     rule: ruleId,
//     recommendations: recommendations,
//     status: status
//   };
//
//   console.log("Sending: ", payload);
//   openmrsFetch(`/cdss/record-usage.form`, {
//     signal: ac.signal,
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: payload
//   })
//     .then((result) => console.log("Received: ", result.data))
//     .catch((error) => console.log(error));
// };

const recordRuleUsage = (usage: CdssUsage) => {
  const ac: AbortController = new AbortController();

  const payload = {
    vaccine: usage.vaccine,
    patientId: usage.patientId,
    timestamp: convertDateToTimestamp(usage.timestamp),
    rule: usage.ruleId,
    recommendations: usage.recommendations,
    status: usage.status,
  };

  // console.log("Sending: ", payload);
  openmrsFetch(`/cdss/record-usage.form`, {
    signal: ac.signal,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  })
    // .then((result) => console.log("Received: ", result.data))
    .catch((error) => console.log(error));
};

async function getUsages() {
  const ac: AbortController = new AbortController();
  const response = await openmrsFetch(`/cdss/usages.form`, {
    signal: ac.signal,
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
}

async function getRecommendations(patientUuid, ruleId) {
  const result = await global.cdss.executeRuleWithPatient(patientUuid, ruleId);
  return result;
}

async function getRules() {
  const ac: AbortController = new AbortController();
  const response = await openmrsFetch(`/cdss/rule.form`, {
    signal: ac.signal,
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
}

function setupEndpointsMap() {
  // Set the endpoints
  global.cdss.endpoints = {
    metadata: {
      systemName: "OpenMRS",
      remoteAddress: "http://127.0.0.1:80/openmrs",
      vsacApiKey: VSAC_API_KEY,
    },
    patientById: {
      address: async (patientId) => {
        return await loadPatient(patientId);
      },
      method: "GET",
    },
    medicationRequestByPatientId: {
      address:
        "http://127.0.0.1:80/openmrs/ws/fhir2/R4/MedicationRequest/{{medicationRequestId}}",
      method: "GET",
    },
    medicationByMedicationRequestId: {
      address:
        "http://127.0.0.1:80/openmrs/ws/fhir2/R4/Medication/{{medicationId}}",
      method: "GET",
    },
    immunizationByPatientId: {
      address: async (patientId) => {
        return await loadImmunizations(patientId);
      },
      method: "GET",
    },
    observationByPatientId: {
      address:
        "http://127.0.0.1:80/openmrs/ws/fhir2/R4/Observation/{{patientId}}",
      method: "GET",
    },
    ruleById: {
      address: async (ruleId) => {
        return await loadRule(ruleId);
      },
      method: "GET",
    },
    getRules: {
      address: async () => {
        return await getRules();
      },
      method: "GET",
    },
    getUsages: {
      address: async () => {
        return await getUsages();
      },
      method: "GET",
    },
    recordUsage: {
      address: async (ruleId, patientId, vaccine, recommendation, status) => {
        return recordRuleUsage({
          ruleId: ruleId,
          patientId: patientId,
          vaccine: vaccine,
          recommendations: recommendation,
          status: status,
          timestamp: new Date(),
        });
      },
      method: "POST",
    },
    vsacSvs: {
      address: "http://localhost:8080/openmrs/cdss/RetrieveSvsValueSet.form",
      method: "GET",
    },
    vsacFhir: {
      address:
        "http://localhost:8080/openmrs/cdss/RetrieveFhirValueSet/{{oid}}.form",
      method: "GET",
    },
  };
}

setupEndpointsMap();
export {
  setupEndpointsMap,
  recordRuleUsage,
  getUsages,
  loadImmunizations,
  loadPatient,
  loadRule,
  getRecommendations,
  getRules,
};
