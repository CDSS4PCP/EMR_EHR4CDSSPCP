import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Tab,
  DataTableSkeleton,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TextInput,
  Button,
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";
import {
  NumberInput,
  NumberInputProps,
} from "@carbon/react/lib/components/NumberInput/NumberInput";
import { EventEmitter } from "events";
import { loadCqlRule, loadRule } from "../cdssService";
import { Buffer } from "buffer";
import styles from "./cdss-modification-page.module.scss";

// Events used for parameter resets
const eventEmitter = new EventEmitter();

async function postRuleChange(ruleId, parameterChanges) {
  const modificationServiceUrl = "http://localhost:9090/api/inject";
  const cql = await loadCqlRule(ruleId);
  const changes = {};
  for (const paramName of Object.keys(parameterChanges)) {
    changes[paramName] = {
      value: parameterChanges[paramName].newValue,
      type: parameterChanges[paramName].type,
    };
  }

  const body = {
    params: changes,
    rule: {
      id: ruleId,
      version: "1",
      content: Buffer.from(cql, "utf-8").toString("base64"),
    },
  };
  const result = await fetch(modificationServiceUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(body),
  });
  console.log(result);
}

/**
 * Fetches rule manifest data from the server.
 *
 * @returns {Promise<any>} The JSON data containing rule information.
 */
async function getRuleData() {
  const result = await openmrsFetch("/cdss/rule-manifest.form");
  const json = await result.json();
  return json;
}

/**
 * Records changes to a parameter for a specific rule.
 *
 * @param {string} ruleId - The ID of the rule.
 * @param {string} paramName - The name of the parameter.
 * @param {any} newValue - The new value of the parameter.
 * @param {any} initialValue - The initial value of the parameter.
 */
function recordParameterChange(
  ruleId,
  paramName,
  newValue,
  initialValue,
  type,
  pendingChanges,
  setPendingChanges
) {
  const change = {
    newValue: newValue,
    initialValue: initialValue,
    type: type,
  };

  const pendingParameterChanges = { ...pendingChanges };
  if (pendingParameterChanges[ruleId] == null) {
    pendingParameterChanges[ruleId] = {};
  }
  pendingParameterChanges[ruleId][paramName] = change;

  if (newValue == initialValue) {
    delete pendingParameterChanges[ruleId][paramName];
  }
  setPendingChanges(pendingParameterChanges);
}

interface CdssRuleParam {
  value: any;
  type: string;
  default?: any;
  allowedValues?: any[];
}

interface CdssNumberInputProps extends NumberInputProps {
  parameter: CdssRuleParam;
  cellId: string;
  ruleId: string;
  paramName: string;
  setPendingChanges: React.Dispatch<React.SetStateAction<any>>;
  pendingChanges: any;
}

const CdssNumberInput = React.forwardRef<
  HTMLInputElement,
  CdssNumberInputProps
>(
  (
    { cellId, parameter, ruleId, paramName, pendingChanges, setPendingChanges },
    ref
  ) => {
    const initialValue = Number(parameter.value);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef();
    useEffect(() => {
      recordParameterChange(
        ruleId,
        paramName,
        value,
        initialValue,
        parameter.type,
        pendingChanges,
        setPendingChanges
      );
    }, [value]);
    eventEmitter.on("parameterReset", (state) => {
      if (state.ruleId == ruleId) setValue(initialValue);
    });
    return (
      <NumberInput
        className={styles.tableCellInput}
        id={cellId}
        ref={inputRef}
        value={value}
        warn={value != initialValue}
        warnText={"This value was modified"}
        defaultValue={initialValue}
        onChange={(e, newState) => {
          setValue(Number(newState.value));
          return true;
        }}
      ></NumberInput>
    );
  }
);

interface CdssStringInputProps extends NumberInputProps {
  parameter: CdssRuleParam;
  cellId: string;
  ruleId: string;
  paramName: string;
  setPendingChanges: React.Dispatch<React.SetStateAction<any>>;
  pendingChanges: any;
}

const CdssStringInput = React.forwardRef<
  HTMLInputElement,
  CdssStringInputProps
>(
  (
    { cellId, parameter, ruleId, paramName, pendingChanges, setPendingChanges },
    ref
  ) => {
    const initialValue = String(parameter.value);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef();
    useEffect(() => {
      recordParameterChange(
        ruleId,
        paramName,
        value,
        initialValue,
        parameter.type,
        pendingChanges,
        setPendingChanges
      );
    }, [value]);

    eventEmitter.on("parameterReset", (state) => {
      if (state.ruleId == ruleId) setValue(initialValue);
    });
    return (
      <TextInput
        id={cellId}
        className={styles.tableCellInput}
        ref={inputRef}
        value={value}
        warn={value != initialValue}
        warnText={"This value was modified"}
        defaultValue={initialValue}
        onChange={(e) => {
          setValue(e.target.value);
          return true;
        }}
      ></TextInput>
    );
  }
);

interface CdssEditableCellProps extends TableCellProps {
  parameter: CdssRuleParam;
  cellId?: string;
  ruleId: string;
  setPendingChanges: React.Dispatch<React.SetStateAction<any>>;
  pendingChanges: any;
}

const CdssEditableCell = React.forwardRef<
  HTMLTableCellElement,
  CdssEditableCellProps
>(({ parameter, cellId, ruleId, pendingChanges, setPendingChanges }, ref) => {
  const paramName = cellId.replace(ruleId + ":", "");
  return (
    <TableCell ref={ref} key={cellId} className={styles.cdssEditableCell}>
      {parameter.type == "Integer" ? (
        <CdssNumberInput
          parameter={parameter}
          cellId={cellId + ":input"}
          id={cellId + ":input"}
          ruleId={ruleId}
          paramName={paramName}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
        ></CdssNumberInput>
      ) : (
        <CdssStringInput
          parameter={parameter}
          cellId={cellId + ":input"}
          id={cellId + ":input"}
          ruleId={ruleId}
          paramName={paramName}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
        ></CdssStringInput>
      )}
    </TableCell>
  );
});

export const CdssModificationPage: React.FC = () => {
  const [ruleData, setRuleData] = useState(null);
  const [columns, setColumns] = useState(null);
  const [pendingParameterChanges, setPendingParameterChanges] = useState({});

  // Data structure to keep track of parameter changes
  useEffect(() => {
    getRuleData().then((r) => {
      setRuleData(r);

      const cols = {};
      for (const rule of r.rules) {
        const paramNames = Object.keys(rule.params);
        for (const paramName of paramNames) {
          const param = structuredClone(rule.params[paramName]);
          param["name"] = paramName;
          param["key"] = paramName;
          param["header"] = paramName;
          cols[paramName] = param;
        }
      }
      const columnList: any[] = Object.values(cols);
      columnList.sort((a, b) => a?.name.localeCompare(b.name));
      setColumns(columnList);
    });
  }, []);

  if (ruleData == null || columns == null) {
    return <DataTableSkeleton headers={[]} aria-label="sample table" />;
  }

  const rules = ruleData.rules
    .filter((r) => r.role.toLowerCase() == "rule")
    .map((r) => {
      const obj = {
        id: r.id,
        version: r.version,
        cqlFilePath: r.cqlFilePath,
        elmFilePath: r.elmFilePath,
        description: r.description,
        role: r.role,
        enabled: r.enabled,
        ...r.params,
      };
      return obj;
    });

  const ruleDict = {};
  rules.forEach((r) => {
    ruleDict[r.id] = r;
  });

  return (
    <div>
      <h1 className={styles.modHeader}>Rule Modification</h1>

      <DataTable useZebraStyles rows={rules} headers={columns}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getExpandedRowProps,
          getTableProps,
          getTableContainerProps,
        }) => {
          return (
            <TableContainer
              title="Rule parameter table"
              {...getTableContainerProps()}
            >
              <TableHead>
                <TableRow className={styles.cdssTableRow}>
                  <TableExpandHeader aria-label="expand row" />
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
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => {
                  return (
                    <React.Fragment key={row.id}>
                      <TableExpandRow
                        className={styles.cdssTableRow}
                        {...getRowProps({
                          row,
                        })}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <CdssEditableCell
                              cellId={cell.id}
                              ruleId={row.id}
                              parameter={cell.value}
                              pendingChanges={pendingParameterChanges}
                              setPendingChanges={setPendingParameterChanges}
                            />
                          );
                        })}

                        <TableCell>
                          {pendingParameterChanges &&
                            pendingParameterChanges[row.id] &&
                            Object.keys(pendingParameterChanges[row.id])
                              .length > 0 && (
                              <div>
                                <Button
                                  kind={"primary"}
                                  onClick={(e) => {
                                    const changes =
                                      pendingParameterChanges[row.id];
                                    postRuleChange(row.id, changes);
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
                      </TableExpandRow>
                      <TableExpandedRow colSpan={headers.length + 1}>
                        <h6>{row.id}</h6>
                        <div>{ruleDict[row.id].description}</div>
                      </TableExpandedRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </TableContainer>
          );
        }}
      </DataTable>
    </div>
  );
};
