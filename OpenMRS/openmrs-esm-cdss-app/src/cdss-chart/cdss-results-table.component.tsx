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

export interface CdssResultsTableHeaderProps {
  visibleColumns: Array<string>;
}

export interface CdssResultsTableRowProps {
  visibleColumns: Array<string>;
  patientUuid: string;
  patientResults: object;
}

export interface CdssChartResultsTableProps {
  patientUuid: string;
  patientResults: object[];
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
}) => {
  console.log(patientResults);

  return (
    <TableRow>
      <TableCell>{patientResults["library"]["name"]}</TableCell>
      {visibleColumns.map((column) => {
        // console.log(patientResults[patientUuid][column] == null ? `null ${column}` : patientResults[patientUuid][column]);

        if (patientResults[patientUuid][column] == null) {
          return <TableCell></TableCell>;
        } else if (Array.isArray(patientResults[patientUuid][column])) {
          return (
            <TableCell>
              <UnorderedList>
                {patientResults[patientUuid][column].map((e) => {
                  return <ListItem>{JSON.stringify(e)}</ListItem>;
                })}
              </UnorderedList>
            </TableCell>
          );
        } else {
          return <TableCell>{patientResults[patientUuid][column]}</TableCell>;
        }
      })}
      <TableCell>Action</TableCell>
    </TableRow>
  );
};
export const CdssResultsTable: React.FC<CdssChartResultsTableProps> = ({
  patientUuid,
  ruleId,
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
              return (
                <CdssResultsTableRow
                  visibleColumns={visibleColumns}
                  patientUuid={patientUuid}
                  patientResults={result}
                ></CdssResultsTableRow>
              );
            })}
          </TableBody>

          {/*<TableBody>*/}
          {/*  <TableRow>*/}
          {/*    <TableCell>{patientResults[0]["library"].name}</TableCell>*/}
          {/*    {Object.keys(patientResults[0][patientUuid])*/}
          {/*      .filter((m) => m !== "Patient")*/}
          {/*      .filter((m) =>*/}
          {/*        visibleColumns != null ? visibleColumns.includes(m) : m*/}
          {/*      )*/}
          {/*      .map((m) => {*/}
          {/*        if (typeof patientResults[0][patientUuid][m] == "string")*/}
          {/*          return (*/}
          {/*            <TableCell>{patientResults[0][patientUuid][m]}</TableCell>*/}
          {/*          );*/}
          {/*        else if (Array.isArray(patientResults[0][patientUuid][m])) {*/}
          {/*          return (*/}
          {/*            <TableCell>*/}
          {/*              <UnorderedList>*/}
          {/*                {patientResults[0][patientUuid][m].map((e) => {*/}
          {/*                  if (e.recommendation == undefined) {*/}
          {/*                    return <></>;*/}
          {/*                  } else*/}
          {/*                    return <ListItem>{e.recommendation}</ListItem>;*/}
          {/*                })}*/}
          {/*              </UnorderedList>*/}
          {/*            </TableCell>*/}
          {/*          );*/}
          {/*        }*/}
          {/*      })}*/}

          {/*    <td>*/}
          {/*      {doesActionApply(*/}
          {/*        patientUuid,*/}
          {/*        ruleId,*/}
          {/*        patientResults[0][patientUuid],*/}
          {/*        existingUsages*/}
          {/*      ) ? (*/}
          {/*        <div>*/}
          {/*          <Button*/}
          {/*            kind={"primary"}*/}
          {/*            onClick={(e) => {*/}
          {/*              const usage: CdssUsage = {*/}
          {/*                ruleId: ruleId,*/}
          {/*                patientId: patientUuid,*/}
          {/*                vaccine:*/}
          {/*                  patientResults[0][patientUuid]["VaccineName"],*/}
          {/*                timestamp: new Date(),*/}
          {/*                recommendations:*/}
          {/*                  patientResults[0][patientUuid]["Recommendations"],*/}
          {/*                status: "ACTED",*/}
          {/*              };*/}
          {/*              takeAction(usage);*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            Take action*/}
          {/*          </Button>*/}

          {/*          <Button*/}
          {/*            kind={"secondary"}*/}
          {/*            onClick={(e) => {*/}
          {/*              const usage: CdssUsage = {*/}
          {/*                ruleId: ruleId,*/}
          {/*                patientId: patientUuid,*/}
          {/*                vaccine:*/}
          {/*                  patientResults[0][patientUuid]["VaccineName"],*/}
          {/*                timestamp: new Date(),*/}
          {/*                recommendations:*/}
          {/*                  patientResults[0][patientUuid]["Recommendations"],*/}
          {/*                status: "ACTED",*/}
          {/*              };*/}
          {/*              declineAction(usage);*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            Decline action*/}
          {/*          </Button>*/}
          {/*        </div>*/}
          {/*      ) : (*/}
          {/*        <div>*/}
          {/*          <Button disabled>No action Needed</Button>*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    </td>*/}
          {/*  </TableRow>*/}
          {/*</TableBody>*/}
        </Table>
      </TableContainer>
    );
};
