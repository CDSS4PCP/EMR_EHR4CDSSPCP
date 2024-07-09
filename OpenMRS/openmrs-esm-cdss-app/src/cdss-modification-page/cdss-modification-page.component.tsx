import React from "react";
import {
  Form,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@carbon/react";

export const CdssModificationPage: React.FC = () => {
  return (
    <div>
      <h1>Rule Modification</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Rule Description</TableCell>
            <TableCell>Operator1</TableCell>
            <TableCell>Age1</TableCell>
            <TableCell>Age1 Unit</TableCell>
            <TableCell>Boolean</TableCell>
            <TableCell>Operator2</TableCell>
            <TableCell>Age2</TableCell>
            <TableCell>Age2 Unit</TableCell>
            <TableCell>Special Condition</TableCell>
            <TableCell>Vaccine Record</TableCell>
            <TableCell>Vaccine Alter</TableCell>
            <TableCell>Vaccine Dose </TableCell>
            <TableCell>Admin Min Age </TableCell>
            <TableCell>Admin Boolean</TableCell>
            <TableCell>Admin Max Age</TableCell>
            <TableCell>Interval 2</TableCell>
            <TableCell>Interval 3</TableCell>
            <TableCell>Interval 4</TableCell>
            <TableCell>Medical Indication 1</TableCell>
            <TableCell>Medical Indication 2</TableCell>
            <TableCell>Medical Indication 3</TableCell>
            <TableCell>Action 1 </TableCell>
            <TableCell>Action 2 </TableCell>
            <TableCell>Action 3 </TableCell>
            <TableCell>Action 4 </TableCell>
            <TableCell>Note </TableCell>
            <TableCell>Note </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody></TableBody>
      </Table>
    </div>
  );
};
