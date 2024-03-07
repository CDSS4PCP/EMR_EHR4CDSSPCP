import React from "react";
import {
  DataTable,
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
}

export const CdssResultsTable: React.FC<CdssChartComponentProps> = ({
  patientUuid,
  ruleId,
  patientResults,
  debug,
  visibleColumns,
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
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
