import React, { useEffect, useState } from "react";

import { CardHeader } from "@openmrs/esm-patient-common-lib";

import "./../cdss.js";
import Loading from "@carbon/react/es/components/Loading/Loading";
import { CdssResultsTable } from "./cdss-results-table.component";
import {
  getRecommendations,
  getRules,
  getUsages,
  recordRuleUsage,
} from "../cdssService";
import { CdssUsage } from "../cdssTypes";
import {
  ComposedModal,
  ListItem,
  UnorderedList,
  ModalFooter,
} from "@carbon/react";

async function loadResults(patientUuid, setResultsCallback) {
  const rules = await getRules();
  const results = [];
  for (const rule of rules) {
    try {
      const result = await getRecommendations(patientUuid, rule);
      results.push(result);
      setResultsCallback([...results]);
    } catch (error) {
      // eslint-disable-next-line no-console
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
      <ComposedModal modalHeading="Take action" open={actionConfirmDialogOpen}>
        {actionTaking == null ? (
          <></>
        ) : (
          <div>
            <h2>Take action</h2>
            <p>
              Did you follow the following suggestions:
              <br />
              <UnorderedList>
                {actionTaking.recommendations.map((e) => (
                  <ListItem>{e.recommendation}</ListItem>
                ))}
              </UnorderedList>
            </p>

            <ModalFooter
              primaryButtonText={"Yes"}
              secondaryButtonText={"No"}
              onRequestClose={() => setActionConfirmDialogOpen(false)}
              onRequestSubmit={() => {
                recordRuleUsage(actionTaking);
                setActionConfirmDialogOpen(false);
                window.location.reload();
              }}
            ></ModalFooter>
          </div>
        )}
      </ComposedModal>

      <ComposedModal
        modalHeading="Decline action"
        open={actionDeclineDialogOpen}
      >
        {actionTaking == null ? (
          <></>
        ) : (
          <div>
            <h2>Take action</h2>

            <p>
              Are you sure you want to decline the following suggestions:
              <br />
              <UnorderedList>
                {actionTaking.recommendations.map((e) => (
                  <ListItem>{e.recommendation}</ListItem>
                ))}
              </UnorderedList>
            </p>
            <ModalFooter
              primaryButtonText={"Yes"}
              secondaryButtonText={"No"}
              onRequestClose={() => setActionDeclineDialogOpen(false)}
              onRequestSubmit={() => {
                recordRuleUsage(actionTaking);
                setActionDeclineDialogOpen(false);
                window.location.reload();
              }}
            ></ModalFooter>
          </div>
        )}
      </ComposedModal>

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
          }}
        ></CdssResultsTable>
      )}
    </div>
  );
};
