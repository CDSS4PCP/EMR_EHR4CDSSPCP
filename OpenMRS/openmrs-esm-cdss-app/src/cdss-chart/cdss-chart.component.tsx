import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./cdss-chart.scss";
import {
  Extension,
  ExtensionSlot,
  useConfig,
  interpolateUrl,
  useSession,
  refetchCurrentUser,
  clearCurrentUser,
  getSessionStore,
  useConnectivity,
  navigate as openmrsNavigate,
  Session,
  openmrsFetch,
} from "@openmrs/esm-framework";
import {
  CardHeader,
  EmptyState,
  ErrorState,
  launchPatientWorkspace,
  PatientChartPagination,
} from "@openmrs/esm-patient-common-lib";

import "./../cdss.js";
import { usePatient } from "../patient-getter/patient-getter.resource";
import Loading from "@carbon/react/es/components/Loading/Loading";
import { CdssResultsTable } from "./cdss-results-table.component";

export interface CdssChartComponentProps {
  patientUuid: string;
}

export const CdssChart: React.FC<CdssChartComponentProps> = ({
  patientUuid,
}) => {
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

  async function doCoolStuff(patientUuid, ruleId) {
    // Set the endpoints
    global.cdss.endpoints = {
      metadata: {
        systemName: "OpenMRS",
        remoteAddress: "http://127.0.0.1:80/openmrs",
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
    };
    const result = await global.cdss.executeRuleWithPatient(
      patientUuid,
      ruleId
    );

    return result;
  }

  const { t } = useTranslation();

  // const ruleId = "age-1";
  const ruleId = "MMR_Rule4";
  const [results, setResults] = useState(null);

  useEffect(() => {
    doCoolStuff(patientUuid, ruleId).then((r) => {
      setResults(r);
    });
  }, []);

  const loadingProps = () => ({
    active: true,
    withOverlay: false,
    small: false,
    description: "Active loading indicator",
  });
  return (
    <div>
      <CardHeader title={"CDSS"}>
        <hr />
      </CardHeader>
      {results ? (
        <CdssResultsTable
          patientResults={results}
          debug={false}
          ruleId={ruleId}
          patientUuid={patientUuid}
          visibleColumns={["VaccineName", "Recommendation"]}
        ></CdssResultsTable>
      ) : (
        <div>
          Waiting for patient....
          <Loading {...loadingProps()} />
        </div>
      )}
    </div>
  );
};
