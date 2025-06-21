import React, { useState } from "react";
import {
  Button,
  DataTable,
  DataTableSkeleton,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  Toggle,
  Tooltip,
} from "@carbon/react";
import { DocumentSubtract } from "@carbon/react/icons";

import styles from "./cdss-modification-page.module.scss";
import CdssEditableCell from "./cdss-editable-cell.component";
import { EventEmitter } from "events";
import CdssRuleEnableCell from "./cdss-rule-enable-cell.component";

interface CdssModificationTableProps {
  rules?: Array<any>;
  columns?: Array<any>;
  pendingParameterChanges: object;
  setPendingParameterChanges: React.Dispatch<React.SetStateAction<any>>;
  eventEmitter: EventEmitter;
  uploadRuleButtonClicked?: () => any;
  archiveButtonClicked?: (ruleId) => any;
  postRuleChange?: (ruleId: string, parameterChanges: any) => void;
}

const CdssModificationTable = React.forwardRef<
  HTMLInputElement,
  CdssModificationTableProps
>(
  (
    {
      rules,
      columns,
      pendingParameterChanges,
      setPendingParameterChanges,
      eventEmitter,
      uploadRuleButtonClicked,
      archiveButtonClicked,
      postRuleChange,
    },
    ref
  ) => {
    const [showDescription, setShowDescription] = React.useState(true);

    if (rules == null || columns == null) {
      // No data given, return empty table
      return <DataTableSkeleton headers={[]} aria-label="no data" />;
    }
    const ruleDict = {};

    rules.forEach((r) => {
      ruleDict[r.id] = r;
    });

    if (!columns || columns.length === 0) {
      console.warn("Missing or empty columns");
    }

    return (
      <div>
        <DataTable rows={rules} headers={columns}>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getTableProps,
            getTableContainerProps,
            getToolbarProps,
          }) => {
            return (
              <TableContainer
                title="Modifcation Table"
                {...getTableContainerProps()}
              >
                <TableToolbar
                  {...getToolbarProps()}
                  aria-label="data table toolbar"
                >
                  <TableToolbarContent>
                    <div>
                      <div
                        style={{
                          marginBlockEnd: "0.5rem",
                        }}
                      >
                        Descriptions
                      </div>
                      <Toggle
                        size={"sm"}
                        onToggle={(e) => {
                          setShowDescription(e);
                          return true;
                        }}
                        defaultToggled={showDescription}
                      />
                    </div>
                  </TableToolbarContent>
                </TableToolbar>

                <Table {...getTableProps()} style={{ marginTop: "1rem" }}>
                  <TableHead>
                    <TableRow>
                      {showDescription && (
                        <TableHeader key={"ruleDescriptionHeader"}>
                          Description
                        </TableHeader>
                      )}

                      <TableHeader key={"enableHeader"}>Enabled</TableHeader>
                      {headers.map((header, i) => (
                        <TableHeader
                          key={i}
                          {...getHeaderProps({
                            header,
                          })}
                        >
                          {header.name}
                        </TableHeader>
                      ))}
                      <TableHeader key={"actionHeader"}>Action</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className={
                          ruleDict[row.id]?.enabled
                            ? styles.cdssEnabledTableRow
                            : styles.cdssDisabledTableRow
                        }
                        {...getRowProps({
                          row,
                        })}
                      >
                        {showDescription && (
                          <TableCell>{ruleDict[row.id]?.description}</TableCell>
                        )}

                        <CdssRuleEnableCell
                          ruleId={row.id}
                          initialEnabled={ruleDict[row.id]?.enabled}
                          pendingParameterChanges={pendingParameterChanges}
                          setPendingParameterChanges={
                            setPendingParameterChanges
                          }
                          eventEmitter={eventEmitter}
                        ></CdssRuleEnableCell>

                        {row.cells.map((cell) => {
                          const param =
                            ruleDict[row.id]?.params[cell.info.header];
                          return (
                            <CdssEditableCell
                              cellId={cell.id}
                              ruleId={row.id}
                              parameter={param}
                              pendingChanges={pendingParameterChanges}
                              setPendingChanges={setPendingParameterChanges}
                              disabled={!ruleDict[row.id]?.enabled}
                              eventEmitter={eventEmitter}
                            />
                          );
                        })}

                        <TableCell>
                          <Stack orientation={"horizontal"}>
                            {pendingParameterChanges &&
                              pendingParameterChanges[row.id] &&
                              ((pendingParameterChanges[row.id].params &&
                                Object.keys(
                                  pendingParameterChanges[row.id].params
                                ).length > 0) ||
                                pendingParameterChanges[row.id].enabled !=
                                  null) && (
                                <div>
                                  <Tooltip label={"Save Changes"}>
                                    <Button
                                      kind={"primary"}
                                      onClick={(e) => {
                                        const changes =
                                          pendingParameterChanges[row.id];
                                        postRuleChange(row.id, changes);
                                      }}
                                      tooltip={"Save Changes"}
                                    >
                                      Save
                                    </Button>
                                  </Tooltip>

                                  <Tooltip label={"Reset Changes"}>
                                    <Button
                                      kind={"secondary"}
                                      onClick={(e) => {
                                        eventEmitter.emit("parameterReset", {
                                          ruleId: row.id,
                                        });
                                      }}
                                      tooltip={"Reset Changes"}
                                    >
                                      Reset
                                    </Button>
                                  </Tooltip>
                                </div>
                              )}
                            <Tooltip label={"Archive Rule"}>
                              <IconButton
                                kind={"secondary"}
                                onClick={(e) => {
                                  archiveButtonClicked(row.id);
                                }}
                              >
                                <DocumentSubtract
                                  style={{ transform: "scale(2)" }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </DataTable>
      </div>
    );
  }
);

export default CdssModificationTable;
