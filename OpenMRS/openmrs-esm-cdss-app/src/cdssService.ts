import { openmrsFetch } from "@openmrs/esm-framework";
import "./cdss.js";

async function loadPatient(patientId) {
  const result = await openmrsFetch(`/ws/fhir2/R4/Patient/${patientId}`, {});
  const pat = await result.json();
  return pat;
}

async function loadRule(ruleId) {
  const result = await openmrsFetch(`/cdss/rule/${ruleId}.json`, {});
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

const recordActionTaken = (
  ruleId: string,
  patientId: string,
  vaccine: string,
  recommendation: string
) => {
  const ac: AbortController = new AbortController();
  openmrsFetch(`/cdss/record-usage.form`, {
    signal: ac.signal,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      vaccine: vaccine,
      patientId: patientId,
      timestamp: new Date(),
      rule: ruleId,
      recommendation: recommendation,
      status: "ACTED"
    }
  })
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
};


const declineActionTaken = (
  ruleId: string,
  patientId: string,
  vaccine: string,
  recommendation: string
) => {
  const ac: AbortController = new AbortController();
  openmrsFetch(`/cdss/record-usage.form`, {
    signal: ac.signal,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      vaccine: vaccine,
      patientId: patientId,
      timestamp: new Date(),
      rule: ruleId,
      recommendation: recommendation,
      status: "DECLINED"
    }
  })
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
};

async function getUsages() {
  const ac: AbortController = new AbortController();
  const response = await openmrsFetch(`/cdss/usages.form`, {
    signal: ac.signal,
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  return await response.json();
}

async function getRecommendations(patientUuid, ruleId) {
  const result = await global.cdss.executeRuleWithPatient(patientUuid, ruleId);

  return result;
}

function setupEndpointsMap() {
  // Set the endpoints
  global.cdss.endpoints = {
    metadata: {
      systemName: "OpenMRS",
      remoteAddress: "http://127.0.0.1:80/openmrs"
    },
    patientById: {
      address: async (patientId) => {
        return await loadPatient(patientId);
      },
      method: "GET"
    },
    medicationRequestByPatientId: {
      address:
        "http://127.0.0.1:80/openmrs/ws/fhir2/R4/MedicationRequest/{{medicationRequestId}}",
      method: "GET"
    },
    medicationByMedicationRequestId: {
      address:
        "http://127.0.0.1:80/openmrs/ws/fhir2/R4/Medication/{{medicationId}}",
      method: "GET"
    },
    immunizationByPatientId: {
      address: async (patientId) => {
        return await loadImmunizations(patientId);
      },
      method: "GET"
    },
    observationByPatientId: {
      address:
        "http://127.0.0.1:80/openmrs/ws/fhir2/R4/Observation/{{patientId}}",
      method: "GET"
    },
    ruleById: {
      address: async (ruleId) => {
        return await loadRule(ruleId);
      },
      method: "GET"
    },
    getUsages: {
      address: async () => {
        return await getUsages();
      },
      method: "GET"
    },
    recordUsage: {
      address: async (ruleId, patientId, vaccine, recommendation) => {
        return await recordActionTaken(
          ruleId,
          patientId,
          vaccine,
          recommendation
        );
      },
      method: "POST"
    }
  };
}

setupEndpointsMap();
export {
  setupEndpointsMap,
  recordActionTaken,
  declineActionTaken,
  getUsages,
  loadImmunizations,
  loadPatient,
  loadRule,
  getRecommendations
};
