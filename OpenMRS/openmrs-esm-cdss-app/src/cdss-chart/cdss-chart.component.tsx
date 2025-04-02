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
import {
  getRecommendations,
  getRules,
  getUsages,
  recordRuleUsage,
} from "../cdssService";
import { types } from "sass";
import { CdssUsage } from "../cdssTypes";
import { ListItem, UnorderedList } from "@carbon/react";

async function loadResults(patientUuid, setResultsCallback) {
  const rules = await getRules();
  const results = [];
  for (const rule of rules) {
    try {
      const result = await getRecommendations(patientUuid, rule);
      results.push(result);
      setResultsCallback([...results]);
    } catch (error) {
      console.log("Ran into error getting Recommendation for ", rule, error);
    }
  }
  setResultsCallback([...results]);
  return results;
}

export interface CdssChartComponentProps {
  patientUuid: string;
}

export const CdssChart: React.FC<CdssChartComponentProps> = ({
  patientUuid,
}) => {
  const [results, setResults] = useState([]);
  const [rules, setRules] = useState([]);
  const [usages, setExistingUsages] = useState([]);
  const [actionConfirmDialogOpen, setActionConfirmDialogOpen] = useState(false);
  const [actionDeclineDialogOpen, setActionDeclineDialogOpen] = useState(false);

  const [actionTaking, setActionTaking] = useState<CdssUsage>();

  useEffect(() => {
    getRules().then((rules) => {
      setRules(rules);
      loadResults(patientUuid, setResults);
    });
  }, []);

  useEffect(() => {
    getUsages().then((usageList) => {
      setExistingUsages(usageList);
    });
  }, []);

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

      {results == null ||
      (Array.isArray(results) && results.length != rules.length) ? (
        <div style={{ justifyContent: "center" }}>
          <Loading withOverlay={false} small={true} active={true}></Loading>
          {results.length} of {rules.length} rules checked
        </div>
      ) : (
        <CdssResultsTable
          patientUuid={patientUuid}
          patientResults={results}
          existingUsages={usages}
          visibleColumns={["VaccineName", "Recommendations"]}
          takeAction={(usage) => {
            setActionTaking(usage);
            setActionConfirmDialogOpen(true);
          }}
          declineAction={(usage) => {
            setActionTaking(usage);
            setActionDeclineDialogOpen(true);
            // recordRuleUsage(*/}
            //   ruleId,*/}
            //   patientId,*/}
            //   vaccine,*/}
            //   recommendation,*/}
            //   "DECLINED"*/}
            // )
          }}
        ></CdssResultsTable>
      )}

      {/*{results ? (*/}
      {/*  <CdssResultsTable*/}
      {/*    patientResults={results}*/}
      {/*    debug={false}*/}
      {/*    ruleId={ruleId}*/}
      {/*    patientUuid={patientUuid}*/}
      {/*    visibleColumns={["VaccineName", "Recommendations"]}*/}
      {/*    existingUsages={usages}*/}
      {/*    takeAction={(usage) => {*/}
      {/*      setActionTaking(usage);*/}
      {/*      setActionConfirmDialogOpen(true);*/}
      {/*    }}*/}
      {/*    declineAction={(usage) => {*/}
      {/*      setActionTaking(usage);*/}
      {/*      setActionDeclineDialogOpen(true);*/}
      {/*      // recordRuleUsage(*/}
      {/*      //   ruleId,*/}
      {/*      //   patientId,*/}
      {/*      //   vaccine,*/}
      {/*      //   recommendation,*/}
      {/*      //   "DECLINED"*/}
      {/*      // )*/}
      {/*    }}*/}
      {/*  ></CdssResultsTable>*/}
      {/*) : (*/}
      {/*  <div>*/}
      {/*    Waiting for patient....*/}
      {/*    <Loading {...loadingProps()} />*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};
