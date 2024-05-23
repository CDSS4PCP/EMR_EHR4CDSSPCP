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
import Modal from "@carbon/react/es/components/Modal/Modal";
import { CdssResultsTable } from "./cdss-results-table.component";
import { getRecommendations, getUsages, recordRuleUsage } from "../cdssService";
import { types } from "sass";
import { CdssUsage } from "../cdssTypes";
import { ListItem, UnorderedList } from "@carbon/react";

export interface CdssChartComponentProps {
  patientUuid: string;
}

export const CdssChart: React.FC<CdssChartComponentProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const ruleId = "MMR_Rule4";
  const [results, setResults] = useState(null);
  const [usages, setExistingUsages] = useState([]);
  const [actionConfirmDialogOpen, setActionConfirmDialogOpen] = useState(false);
  const [actionDeclineDialogOpen, setActionDeclineDialogOpen] = useState(false);

  const [actionTaking, setActionTaking] = useState<CdssUsage>();

  useEffect(() => {
    getRecommendations(patientUuid, ruleId).then((r) => {
      setResults(r);
      // console.log(r);
    });
  }, []);

  useEffect(() => {
    getUsages().then(setExistingUsages);
  }, []);

  const loadingProps = () => ({
    active: true,
    withOverlay: false,
    small: false,
    description: "Active loading indicator",
  });
  return (
    <div>
      <Modal
        modalHeading="Take action"
        open={actionConfirmDialogOpen}
        primaryButtonText="Yes"
        secondaryButtonText="Cancel"
        onRequestClose={() => setActionConfirmDialogOpen(false)}
        onRequestSubmit={() => {
          recordRuleUsage(actionTaking);
          setActionConfirmDialogOpen(false);
          window.location.reload();

        }}
      >
        {actionTaking == null ? (
          <></>
        ) : (
          <div>
            <p>
              Did you follow the following suggestions:
              <br />
              <UnorderedList>
                {actionTaking.recommendations.map((e) => (
                  <ListItem>{e.recommendation}</ListItem>
                ))}
              </UnorderedList>
            </p>
          </div>
        )}
      </Modal>

      <Modal
        modalHeading="Decline action"
        open={actionDeclineDialogOpen}
        primaryButtonText="Yes"
        secondaryButtonText="Cancel"
        onRequestClose={() => setActionDeclineDialogOpen(false)}
        onRequestSubmit={() => {
          recordRuleUsage(actionTaking);
          setActionDeclineDialogOpen(false);
          window.location.reload();

        }}
      >
        {actionTaking == null ? (
          <></>
        ) : (
          <div>
            <p>
              Are you sure you want to decline the following suggestions:
              <br />
              <UnorderedList>
                {actionTaking.recommendations.map((e) => (
                  <ListItem>{e.recommendation}</ListItem>
                ))}
              </UnorderedList>
            </p>
          </div>
        )}
      </Modal>

      <CardHeader title={"CDSS"}>
        <hr />
      </CardHeader>
      {results ? (
        <CdssResultsTable
          patientResults={results}
          debug={false}
          ruleId={ruleId}
          patientUuid={patientUuid}
          visibleColumns={["VaccineName", "Recommendations"]}
          existingUsages={usages}
          takeAction={(usage) => {
            setActionTaking(usage);
            setActionConfirmDialogOpen(true);
          }}
          declineAction={(usage) => {
            setActionTaking(usage);
            setActionDeclineDialogOpen(true);
            // recordRuleUsage(
            //   ruleId,
            //   patientId,
            //   vaccine,
            //   recommendation,
            //   "DECLINED"
            // )
          }}
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
