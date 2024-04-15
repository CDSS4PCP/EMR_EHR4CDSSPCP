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

export interface CdssChartComponentProps {
  patientUuid: string;
  patientResults: object;
  ruleId: string;
  debug?: boolean;
  visibleColumns?: Array<string>;
  takeAction: (
    ruleId: string,
    patientId: string,
    vaccine: string,
    recommendation: string
  ) => void;
  declineAction: (
    ruleId: string,
    patientId: string,
    vaccine: string,
    recommendation: string
  ) => void;
}

export const CdssResultsTable: React.FC<CdssChartComponentProps> = ({
  patientUuid,
  ruleId,
  patientResults,
  debug,
  visibleColumns,
  takeAction,
  declineAction,
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
                return (
                  <TableCell>
                    {JSON.stringify(patientResults[patientUuid][m])}
                  </TableCell>
                );
              })}

            <TableCell>
              {patientResults[patientUuid]["Recommendation"] ===
              "Does not apply" ? (
                <div>
                  <Button disabled>No action Needed</Button>
                </div>
              ) : (
                <div>
                  <Button
                    kind={"primary"}
                    onClick={(e) =>
                      takeAction(
                        ruleId,
                        patientUuid,
                        patientResults[patientUuid]["VaccineName"],
                        patientResults[patientUuid]["Recommendation"]
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
                        patientResults[patientUuid]["Recommendation"]
                      );
                    }}
                  >
                    Decline action
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
