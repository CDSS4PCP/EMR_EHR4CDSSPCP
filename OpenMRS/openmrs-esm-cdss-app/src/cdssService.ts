import { openmrsFetch } from "@openmrs/esm-framework";
import "./cdss.js";
import { CdssUsage } from "./cdssTypes";

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
  // console.debug("Loaded patient", patientId);
  const pat = await result.json();
  return pat;
}

async function loadRule(ruleId) {
  const url = `/cdss/elm-rule/idOrName/${ruleId}.form`;

  const result = await openmrsFetch(url, {});

  const elm = await result.json();
  return elm;
}

async function loadCqlRule(ruleId) {
  const url = `/cdss/cql-rule/idOrName/${ruleId}.form`;

  const result = await openmrsFetch(url, {});
  const cql = await result.text();
  return cql;
}

async function loadMedicationRequest(patientId) {
  const result = await openmrsFetch(
    `/ws/fhir2/R4/MedicationRequest?patient=${patientId}`,
    {}
  );
  const medReqs = await result.json();
  if (medReqs == undefined) {
    return [];
  }
  return medReqs;
}

async function loadMedication(medicationId) {
  const result = await openmrsFetch(
    `/ws/fhir2/R4/Medication/${medicationId}`,
    {}
  );
  const meds = await result.json();
  if (meds == undefined) {
    return [];
  }
  return meds;
}

async function loadMedicationStatement(patientId) {
  // At development time of this project, OpenMRS did not implement MedicationStatements,
  // so this function is mostly useless
  const result = await openmrsFetch(
    `/ws/fhir2/R4/MedicationStatement?patient=${patientId}`,
    {}
  );

  const medStats = await result.json();
  if (medStats == undefined) {
    return [];
  }
  return medStats;
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
  const conds = await result.json();
  if (conds == undefined) {
    return [];
  }
  return conds;
}

async function loadObservations(patientId) {
  const result = await openmrsFetch(
    `/ws/fhir2/R4/Observation?patient=${patientId}`,
    {}
  );
  const obs = await result.json();
  if (obs == undefined) {
    return [];
  }
  return obs;
}

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

  openmrsFetch(`/cdss/record-usage.form`, {
    signal: ac.signal,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
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
  const startTime = performance.now();
  const result = await global.cdss.executeRuleWithPatient(patientUuid, ruleId);
  const endTime = performance.now();
  // eslint-disable-next-line no-console
  console.log(
    `The recommendations for ${ruleId} to ${endTime - startTime} ms`,
    result
  );
  return result;
}

async function getRules() {
  const ac: AbortController = new AbortController();
  const response = await openmrsFetch(
    `/cdss/rule.form?allRules=false&role=rule`,
    {
      signal: ac.signal,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

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
    medicationById: {
      address: async (medicationId) => {
        return await loadMedication(medicationId);
      },
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
      // address: `${SERVER_URL}/openmrs/ws/fhir2/R4/Observation/{{patientId}}`,
      address: async (patientId) => {
        return await loadObservations(patientId);
      },
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
      address: async (oid, version, apikey) => {
        await getSvsValueset(oid, version, apikey);
      },
      method: "GET",
    },
    vsacFhir: {
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
  // loadImmunizations,
  // loadConditions,
  loadPatient,
  loadRule,
  loadCqlRule,
  getRecommendations,
  getRules,
};
