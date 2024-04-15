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
import {
  declineActionTaken,
  getRecommendations,
  recordActionTaken,
} from "../cdssService";

export interface CdssChartComponentProps {
  patientUuid: string;
}

export const CdssChart: React.FC<CdssChartComponentProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  // const ruleId = "age-1";
  const ruleId = "MMR_Rule4";
  const [results, setResults] = useState(null);

  useEffect(() => {
    getRecommendations(patientUuid, ruleId).then((r) => {
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
          takeAction={recordActionTaken}
          declineAction={declineActionTaken}
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
