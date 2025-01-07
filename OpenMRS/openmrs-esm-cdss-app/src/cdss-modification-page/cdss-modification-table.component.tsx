import React, { useState } from "react";
import {
  Button,
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  Toggle,
} from "@carbon/react";
import styles from "./cdss-modification-page.module.scss";
import CdssEditableCell from "./cdss-editable-cell.component";
import { EventEmitter } from "events";
import CdssRuleEnableCell from "./cdss-rule-enable-cell.component";
import { openmrsFetch } from "@openmrs/esm-framework";
import FormGroup from "@carbon/react/lib/components/FormGroup/FormGroup";
import { Label } from "@carbon/react/lib/components/Text";

async function postRuleChange(ruleId, parameterChanges, eventEmitter) {
  const changes = {};
  if (parameterChanges.params != null)
    for (const paramName of Object.keys(parameterChanges.params)) {
      changes[paramName] = {
        value: parameterChanges.params[paramName].newValue,
        type: parameterChanges.params[paramName].type,
      };
    }

  const body = {
    params: changes,
    rule: {
      id: ruleId,
    },
  };

  if (Object.keys(changes).length > 0) {
    try {
      const response = await openmrsFetch(`/cdss/modify-rule.form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status == 200) {
        eventEmitter.emit("modificationSucceeded", {
          ruleId: ruleId,
          parameterChanges: parameterChanges,
        });
        eventEmitter.emit("parameterReset", {
          ruleId: ruleId,
          parameterChanges: parameterChanges,
        });
      } else {
        eventEmitter.emit("modificationFailed", {
          ruleId: ruleId,
          parameterChanges: parameterChanges,
          message: await response.text(),
        });
      }
    } catch (e) {
      eventEmitter.emit("modificationFailed", {
        ruleId: ruleId,
        parameterChanges: parameterChanges,
        message: e.message,
      });
    }
  }

  if (parameterChanges.enabled != null) {
    if (parameterChanges.enabled == true) {
      try {
        const response = await openmrsFetch(
          `/cdss/enable-rule/${ruleId}.form`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status == 200) {
          eventEmitter.emit("ruleEnableSucceeded", { ruleId: ruleId });
        } else {
          eventEmitter.emit("ruleEnableFailed", {
            ruleId: ruleId,
            message: await response.text(),
          });
        }
      } catch (e) {
        eventEmitter.emit("ruleEnableFailed", {
          ruleId: ruleId,
          message: e.message,
        });
      }
    } else {
      try {
        const response = await openmrsFetch(
          `/cdss/disable-rule/${ruleId}.form`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status == 200) {
          eventEmitter.emit("ruleDisableSucceeded", { ruleId: ruleId });
        } else {
          eventEmitter.emit("ruleDisableFailed", {
            ruleId: ruleId,
            message: await response.text(),
          });
        }
      } catch (e) {
        eventEmitter.emit("ruleDisableFailed", {
          ruleId: ruleId,
          message: e.message,
        });
      }
    }
  }
}

interface CdssModificationTableProps {
  rules?: Array<any>;
  columns?: Array<any>;
  pendingParameterChanges: object;
  setPendingParameterChanges: React.Dispatch<React.SetStateAction<any>>;
  eventEmitter: EventEmitter;
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
    },
    ref
  ) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [showDescription, setShowDescription] = React.useState(true);

    if (rules == null || columns == null) {
      // No data given, return empty table
      return <DataTableSkeleton headers={[]} aria-label="no data" />;
    }
    const ruleDict = {};

    rules.forEach((r) => {
      ruleDict[r.id] = r;
    });

    return (
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
        }) => (
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
                  {/*<TableSelectAll {...getSelectionProps()} />*/}
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
                    {/*<TableSelectRow*/}
                    {/*  {...getSelectionProps({*/}
                    {/*    row,*/}
                    {/*    onChange: () => {*/}
                    {/*      const isSelected = selectedRows.includes(row.id);*/}
                    {/*      setSelectedRows((prevSelectedRows) =>*/}
                    {/*        isSelected*/}
                    {/*          ? prevSelectedRows.filter((id) => id !== row.id)*/}
                    {/*          : [...prevSelectedRows, row.id]*/}
                    {/*      );*/}
                    {/*    },*/}
                    {/*  })}*/}
                    {/*/>*/}
                    {showDescription && (
                      <TableCell>{ruleDict[row.id]?.description}</TableCell>
                    )}

                    <CdssRuleEnableCell
                      ruleId={row.id}
                      initialEnabled={ruleDict[row.id]?.enabled}
                      pendingParameterChanges={pendingParameterChanges}
                      setPendingParameterChanges={setPendingParameterChanges}
                      eventEmitter={eventEmitter}
                    ></CdssRuleEnableCell>

                    {row.cells.map((cell) => (
                      <CdssEditableCell
                        cellId={cell.id}
                        ruleId={row.id}
                        parameter={cell.value}
                        pendingChanges={pendingParameterChanges}
                        setPendingChanges={setPendingParameterChanges}
                        disabled={!ruleDict[row.id]?.enabled}
                        eventEmitter={eventEmitter}
                      />
                    ))}

                    <TableCell>
                      {pendingParameterChanges &&
                        pendingParameterChanges[row.id] &&
                        ((pendingParameterChanges[row.id].params &&
                          Object.keys(pendingParameterChanges[row.id].params)
                            .length > 0) ||
                          pendingParameterChanges[row.id].enabled != null) && (
                          <div>
                            <Button
                              kind={"primary"}
                              onClick={(e) => {
                                const changes = pendingParameterChanges[row.id];
                                postRuleChange(row.id, changes, eventEmitter);
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              kind={"secondary"}
                              onClick={(e) => {
                                eventEmitter.emit("parameterReset", {
                                  ruleId: row.id,
                                });
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    );
  }
);

export default CdssModificationTable;
