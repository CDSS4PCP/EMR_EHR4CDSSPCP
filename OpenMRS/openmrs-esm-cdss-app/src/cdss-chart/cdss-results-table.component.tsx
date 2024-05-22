import React from "react";
import {
  Button,
  DataTable,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@carbon/react";
import { types } from "sass";
import List = types.List;

export interface CdssChartComponentProps {
  patientUuid: string;
  patientResults: object;
  ruleId: string;
  debug?: boolean;
  visibleColumns?: Array<string>;
  existingUsages?: Array<object>;
  takeAction: (
    ruleId: string,
    patientId: string,
    vaccine: string,
    recommendation: List
  ) => void;
  declineAction: (
    ruleId: string,
    patientId: string,
    vaccine: string,
    recommendation: List
  ) => void;
}

function doesActionApply(patientId, rule, patientResult, existingUsages) {
  // TODO move this functionality to the common module
  if (patientResult["Recommendation"] == "Does not apply") {
    return false;
  }
  for (const usage of existingUsages) {
    const condition =
      patientId == usage["patientId"] &&
      patientResult["VaccineName"] == usage["vaccine"] &&
      rule == usage["rule"] &&
      patientResult["Recommendation"] == usage["recommendation"] &&
      usage["status"] == "ACTED";

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
  declineAction,
}) => {
  console.log("So.... ", patientResults);
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
                      <ul>
                        {patientResults[patientUuid][m].map((e) => {
                          return <li>{JSON.stringify(e)}</li>;
                        })}
                      </ul>
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
                    onClick={(e) =>
                      takeAction(
                        ruleId,
                        patientUuid,
                        patientResults[patientUuid]["VaccineName"],
                        patientResults[patientUuid]["Recommendations"]
                      )
                    }
                  >
                    Take action
                  </Button>

                  <Button
                    kind={"secondary"}
                    onClick={(e) => {
                      declineAction(
                        ruleId,
                        patientUuid,
                        patientResults[patientUuid]["VaccineName"],
                        patientResults[patientUuid]["Recommendations"]
                      );
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
