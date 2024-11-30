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
  TableToolbarContent,
} from "@carbon/react";
import styles from "./cdss-modification-page.module.scss";
import CdssEditableCell from "./cdss-editable-cell.component";
import { EventEmitter } from "events";
import CdssRuleEnableCell from "./cdss-rule-enable-cell.component";
import { openmrsFetch } from "@openmrs/esm-framework";

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
      version: "1",
    },
  };

  if (Object.keys(changes).length > 0) {
    const response = await openmrsFetch(`/cdss/modify-rule.form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.text();
    if (response.status == 200) {
      eventEmitter.emit("modificationSucceeded", {
        ruleId: ruleId,
        parameterChanges: parameterChanges,
      });
    } else {
      console.error(response);
    }
  }

  if (parameterChanges.enabled != null) {
    if (parameterChanges.enabled == true) {
      const response = await openmrsFetch(`/cdss/enable-rule/${ruleId}.form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      console.log("Enabled rule ", response.status);
    } else {
      const response = await openmrsFetch(`/cdss/disable-rule/${ruleId}.form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      console.log("Disabled rule ", response.status);
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
                {selectedRows.length > 0 &&
                  selectedRows.every(
                    (rowId) => ruleDict[rowId]?.enabled == true
                  ) && (
                    <Button
                      kind={"danger"}
                      onClick={() => console.log("Disable Button click")}
                    >
                      Disable
                    </Button>
                  )}
                {selectedRows.length > 0 &&
                  selectedRows.every(
                    (rowId) => ruleDict[rowId]?.enabled == false
                  ) && (
                    <Button
                      kind={"primary"}
                      onClick={() => console.log("Enable Button click")}
                    >
                      Enable
                    </Button>
                  )}
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
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
                    <TableSelectRow
                      {...getSelectionProps({
                        row,
                        onChange: () => {
                          const isSelected = selectedRows.includes(row.id);
                          setSelectedRows((prevSelectedRows) =>
                            isSelected
                              ? prevSelectedRows.filter((id) => id !== row.id)
                              : [...prevSelectedRows, row.id]
                          );
                        },
                      })}
                    />

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
