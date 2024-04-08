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
import { openmrsFetch } from "@openmrs/esm-framework";

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
}

export const CdssResultsTable: React.FC<CdssChartComponentProps> = ({
  patientUuid,
  ruleId,
  patientResults,
  debug,
  visibleColumns,
  takeAction,
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
                <Button disabled>No action Needed</Button>
              ) : (
                <Button
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
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
