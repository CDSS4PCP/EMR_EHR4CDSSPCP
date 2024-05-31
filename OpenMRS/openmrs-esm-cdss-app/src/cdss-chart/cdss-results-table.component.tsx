import React from "react";
import {
  Button,
  DataTable,
  Link,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  UnorderedList
} from "@carbon/react";
import { types } from "sass";
import List = types.List;
import { CdssUsage } from "../cdssTypes";

export interface CdssChartComponentProps {
  patientUuid: string;
  patientResults: object;
  ruleId: string;
  debug?: boolean;
  visibleColumns?: Array<string>;
  existingUsages?: Array<object>;
  takeAction: (usage: CdssUsage) => void;
  declineAction: (usage: CdssUsage) => void;
}

function doesActionApply(patientId, rule, patientResult, existingUsages) {
  // TODO move this functionality to the common module
  if (patientResult["Recommendation"] == "Does not apply") {
    return false;
  }
  const recommendationSet = new Set<string>();
  patientResult["Recommendations"].forEach((r) =>
    recommendationSet.add(r.recommendation)
  );

  for (const usage of existingUsages) {
    let condition =
      patientId == usage["patientId"] &&
      patientResult["VaccineName"] == usage["vaccine"] &&
      rule == usage["rule"] &&
      usage["status"] == "ACTED";

    const recommendations = new Set<string>();
    usage.recommendations.forEach((r) => recommendations.add(r.recommendation));
    const diff = new Set(
      [...recommendationSet].filter((x) => !recommendations.has(x))
    ).size;
    condition = condition && diff == 0;
    if (condition) {
      // Does not apply because previous action was taken
      return false;
    }
  }
  return true;
}

export const CdssResultsTable: React.FC<CdssChartComponentProps> = ({
                                                                      patientUuid,
                                                                      ruleId,
                                                                      patientResults,
                                                                      debug,
                                                                      visibleColumns,
                                                                      existingUsages,
                                                                      takeAction,
                                                                      declineAction
                                                                    }) => {
  return (
    <TableContainer style={{ padding: "10px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rule</TableCell>
            {Object.keys(patientResults[patientUuid])
              .filter((m) => m !== "Patient")
              .filter((m) =>
                visibleColumns != null ? visibleColumns.includes(m) : m
              )
              .map((m) => {
                return <TableCell>{m}</TableCell>;
              })}
            <TableCell>Take Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>{patientResults["library"].name}</TableCell>
            {Object.keys(patientResults[patientUuid])
              .filter((m) => m !== "Patient")
              .filter((m) =>
                visibleColumns != null ? visibleColumns.includes(m) : m
              )
              .map((m) => {
                if (typeof patientResults[patientUuid][m] == "string")
                  return (
                    <TableCell>{patientResults[patientUuid][m]}</TableCell>
                  );
                else if (Array.isArray(patientResults[patientUuid][m])) {
                  return (
                    <TableCell>
                      <UnorderedList>
                        {patientResults[patientUuid][m].map((e) => {
                          if (e.recommendation == undefined) {
                            return <></>;
                          } else return <ListItem>{e.recommendation}</ListItem>;
                        })}
                      </UnorderedList>
                    </TableCell>
                  );
                }
              })}

            <td>
              {doesActionApply(
                patientUuid,
                ruleId,
                patientResults[patientUuid],
                existingUsages
              ) ? (
                <div>
                  <Button
                    kind={"primary"}
                    onClick={(e) => {
                      const usage: CdssUsage = {
                        ruleId: ruleId,
                        patientId: patientUuid,
                        vaccine: patientResults[patientUuid]["VaccineName"],
                        timestamp: new Date(),
                        recommendations:
                          patientResults[patientUuid]["Recommendations"],
                        status: "ACTED"
                      };
                      takeAction(usage);
                    }}
                  >
                    Take action
                  </Button>

                  <Button
                    kind={"secondary"}
                    onClick={(e) => {
                      const usage: CdssUsage = {
                        ruleId: ruleId,
                        patientId: patientUuid,
                        vaccine: patientResults[patientUuid]["VaccineName"],
                        timestamp: new Date(),
                        recommendations:
                          patientResults[patientUuid]["Recommendations"],
                        status: "ACTED"
                      };
                      declineAction(usage);
                    }}
                  >
                    Decline action
                  </Button>
                </div>
              ) : (
                <div>
                  <Button disabled>No action Needed</Button>
                </div>
              )}
            </td>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
