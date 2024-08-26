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
  UnorderedList,
} from "@carbon/react";
import { types } from "sass";
import List = types.List;
import { CdssUsage } from "../cdssTypes";

import { CloseOutline, CheckmarkOutline } from "@carbon/react/icons";

interface CdssResultsTableDataCellProps {
  data: any;
}

interface CdssResultsTableHeaderProps {
  visibleColumns: Array<string>;
}

interface CdssResultsTableRowProps {
  visibleColumns: Array<string>;
  patientUuid: string;
  patientResults: object;
  existingUsages?: Array<object>;
  takeAction: (usage: CdssUsage) => void;
  declineAction: (usage: CdssUsage) => void;
}

export interface CdssChartResultsTableProps {
  patientUuid: string;
  patientResults: object[];
  // ruleId: string;
  debug?: boolean;
  visibleColumns?: Array<string>;
  existingUsages?: Array<object>;
  takeAction: (usage: CdssUsage) => void;
  declineAction: (usage: CdssUsage) => void;
}

function doesActionApply(patientId, rule, patientResult, existingUsages) {
  if (
    patientId == null ||
    rule == null ||
    patientResult == null ||
    existingUsages == null
  ) {
    return false;
  }
  // TODO move this functionality to the common module
  // if (patientResult["Recommendation"] == "Does not apply") {
  //   return false;
  // }
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

const CdssResultsTableDataCell: React.FC<CdssResultsTableDataCellProps> = ({
  data,
}) => {
  if (data == null) {
    return <TableCell></TableCell>;
  } else if (typeof data == "string") {
    return <TableCell>{data}</TableCell>;
  } else if (Array.isArray(data)) {
    return (
      <TableCell>
        <UnorderedList>
          {data.map((d) => (
            <ListItem>
              {d.recommendation != null
                ? d.recommendation
                : "Recommendations unavailable"}
            </ListItem>
          ))}
        </UnorderedList>
      </TableCell>
    );
  }
};

const CdssResultsTableHeader: React.FC<CdssResultsTableHeaderProps> = ({
  visibleColumns,
}) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Rule</TableCell>
        {visibleColumns
          .filter((m) => m !== "Patient")
          .map((m) => {
            return <TableCell>{m}</TableCell>;
          })}
        <TableCell>Take Action</TableCell>
      </TableRow>
    </TableHead>
  );
};

const CdssResultsTableRow: React.FC<CdssResultsTableRowProps> = ({
  visibleColumns,
  patientResults,
  patientUuid,
  existingUsages,
  takeAction,
  declineAction,
}) => {
  return (
    <TableRow>
      <CdssResultsTableDataCell
        data={patientResults?.["library"]?.["name"]}
      ></CdssResultsTableDataCell>
      {visibleColumns.map((column) => {
        return (
          <CdssResultsTableDataCell
            data={patientResults?.[patientUuid]?.[column]}
          ></CdssResultsTableDataCell>
        );
      })}

      <TableCell>
        <div>
          <Button
            kind={"primary"}
            aria-label={"Take action"}
            onClick={(e) => {
              const usage: CdssUsage = {
                ruleId: patientResults?.["library"]?.["name"],
                patientId: patientUuid,
                vaccine: patientResults?.[patientUuid]?.["VaccineName"],
                timestamp: new Date(),
                recommendations:
                  patientResults?.[patientUuid]?.["Recommendations"],
                status: "ACTED",
              };
              takeAction(usage);
            }}
            renderIcon={CheckmarkOutline}
          >
            {/*Take action*/}
          </Button>

          <Button
            kind={"secondary"}
            aria-label={"Decline action"}
            onClick={(e) => {
              const usage: CdssUsage = {
                ruleId: patientResults?.["library"]?.["name"],
                patientId: patientUuid,
                vaccine: patientResults?.[patientUuid]?.["VaccineName"],
                timestamp: new Date(),
                recommendations:
                  patientResults?.[patientUuid]?.["Recommendations"],
                status: "ACTED",
              };
              declineAction(usage);
            }}
            renderIcon={CloseOutline}
          >
            {/*Decline action*/}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
export const CdssResultsTable: React.FC<CdssChartResultsTableProps> = ({
  patientUuid,
  // ruleId,
  patientResults,
  debug,
  visibleColumns,
  existingUsages,
  takeAction,
  declineAction,
}) => {
  if (patientResults == null) {
    return <div></div>;
  } else
    return (
      <TableContainer style={{ padding: "10px" }}>
        <Table>
          <CdssResultsTableHeader
            visibleColumns={visibleColumns}
          ></CdssResultsTableHeader>

          <TableBody>
            {patientResults.map((result) => {
              const applicable = doesActionApply(
                patientUuid,
                result?.["library"]?.["name"],
                result[patientUuid],
                existingUsages
              );

              if (
                !debug &&
                (result[patientUuid]?.Recommendations === undefined ||
                  result[patientUuid].Recommendations.length === 0 ||
                  !applicable)
              ) {
                return <></>;
              }
              return (
                <CdssResultsTableRow
                  visibleColumns={visibleColumns}
                  patientUuid={patientUuid}
                  patientResults={result}
                  existingUsages={existingUsages}
                  takeAction={takeAction}
                  declineAction={declineAction}
                ></CdssResultsTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
};
