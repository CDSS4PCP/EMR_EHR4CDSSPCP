import React from "react";
import {
  Form,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import mmr from "./MMR_descriptor.json";

export const CdssModificationPage: React.FC = () => {
  return (
    <div>
      <h1>Rule Modification</h1>
      {/*{JSON.stringify(mmr, null, 2)}*/}
      <Table useZebraStyles>
        <TableHead>
          <TableRow>
            {mmr.columns.map((m) => {
              return <TableHeader>{m}</TableHeader>;
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.keys(mmr)
            .filter((f) => f != "columns")
            .map((r) => (
              <TableRow>
                {Object.keys(mmr[r]).map((m) => {
                  return <TableCell>{mmr[r][m]}</TableCell>;
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
