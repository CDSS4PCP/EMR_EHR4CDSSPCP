import { openmrsFetch } from "@openmrs/esm-framework";
import "./cdss.js";
import { types } from "sass";
import List = types.List;
import { CdssUsage } from "./cdssTypes";
import { of } from "rxjs";

const VSAC_API_KEY = ""; // Your api key goes here
const SERVER_URL = "http://127.0.0.1:80";

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
  const url = `/cdss/elm-rule/${ruleId}.form`;
  // if (!ruleId.endsWith(".json")) {
  //   url = `/cdss/rule/${ruleId}.json`;
  // }

  const result = await openmrsFetch(url, {});
  const pat = await result.json();
  return pat;
}

async function loadCqlRule(ruleId) {
  const url = `/cdss/cql-rule/${ruleId}.form`;
  // if (!ruleId.endsWith(".json")) {
  //   url = `/cdss/rule/${ruleId}.json`;
  // }

  const result = await openmrsFetch(url, {});
  const pat = await result.text();
  return pat;
}

async function loadMedicationRequest(patientId) {
  const result = await openmrsFetch(
    `/ws/fhir2/R4/MedicationRequest?patient=${patientId}`,
    {}
  );
  const pat = await result.json();
  return pat;
}

async function loadMedicationStatement(patientId) {
  const result = await openmrsFetch(
    `/ws/fhir2/R4/MedicationStatement?patient=${patientId}`,
    {}
  );
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

async function loadConditions(patientId) {
  const result = await openmrsFetch(
    `/ws/fhir2/R4/Condition?patient=${patientId}`,
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
  }).catch((error) => console.log(error));
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
  // console.log(result);
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

async function getSvsValueset(oid, version, apikey) {
  const ac: AbortController = new AbortController();

  const params = new URLSearchParams({ id: oid });
  if (version != null) {
    params.append("version", version);
  }

  const url = `/cdss/RetrieveSvsValueSet.form?${params}`;
  const response = await openmrsFetch(url, {
    signal: ac.signal,
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
}

async function getFhirValueset(oid, version, offset = 0) {
  // console.log(`Grab fhir valueset was called on ${oid}, version ${version}, offset: ${offset}`);
  const ac: AbortController = new AbortController();
  const params = new URLSearchParams();
  params.set("offset", String(offset));
  if (version != null) {
    params.set("valueSetVersion", version);
  }
  const url = `/cdss/RetrieveFhirValueSet/${oid}.form?${params}`;
  const response = await openmrsFetch(url, {
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
      remoteAddress: `${SERVER_URL}/openmrs`,
      vsacApiKey: VSAC_API_KEY,
    },
    patientById: {
      address: async (patientId) => {
        return await loadPatient(patientId);
      },
      method: "GET",
    },
    medicationRequestByPatientId: {
      address: async (patientId) => {
        return await loadMedicationRequest(patientId);
      },
      method: "GET",
    },
    medicationStatementByPatientId: {
      address: async (patientId) => {
        return await loadMedicationStatement(patientId);
      },
      method: "GET",
    },
    medicationByMedicationRequestId: {
      address: `${SERVER_URL}/openmrs/ws/fhir2/R4/Medication/{{medicationId}}`,
      method: "GET",
    },
    immunizationByPatientId: {
      address: async (patientId) => {
        return await loadImmunizations(patientId);
      },
      method: "GET",
    },
    conditionByPatientId: {
      address: async (patientId) => {
        return await loadConditions(patientId);
      },
      method: "GET",
    },
    observationByPatientId: {
      address: `${SERVER_URL}/openmrs/ws/fhir2/R4/Observation/{{patientId}}`,
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
      // address: `${SERVER_URL}/openmrs/cdss/RetrieveSvsValueSet.form`,
      address: async (oid, version, apikey) => {
        await getSvsValueset(oid, version, apikey);
      },
      method: "GET",
    },
    vsacFhir: {
      // address: `${SERVER_URL}/openmrs/cdss/RetrieveFhirValueSet/{{oid}}.form`,
      address: async (oid, version, offset, apikey) => {
        return await getFhirValueset(oid, version, offset);
      },

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
  loadCqlRule,
  getRecommendations,
  getRules,
};
