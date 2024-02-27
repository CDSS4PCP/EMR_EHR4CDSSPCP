import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@carbon/react";

export interface CdssChartComponentProps {
  patientUuid: string;
  patientResults: object;
  ruleId: string;
  debug?: boolean;
}

export const CdssResultsTable: React.FC<CdssChartComponentProps> = ({
  patientUuid,
  ruleId,
  patientResults,
  debug,
}) => {
  return (
    <div>
      {debug && <pre>{JSON.stringify(patientResults, null, 2)}</pre>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rule File</TableCell>
            {Object.keys(patientResults[patientUuid])
              .filter((m) => m !== "Patient")
              .map((m) => {
                return <TableCell>{m}</TableCell>;
              })}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>{ruleId}</TableCell>
            {Object.keys(patientResults[patientUuid])
              .filter((m) => m !== "Patient")
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
    </div>
  );
};
