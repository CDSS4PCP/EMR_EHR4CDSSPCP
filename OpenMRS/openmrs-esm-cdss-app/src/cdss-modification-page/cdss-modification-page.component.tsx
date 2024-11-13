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
  Button
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";
import {
  NumberInput,
  NumberInputProps
} from "@carbon/react/lib/components/NumberInput/NumberInput";
import { EventEmitter } from "events";
import { loadCqlRule, loadRule } from "../cdssService";
import { Buffer } from "buffer";
import styles from "./cdss-modification-page.module.scss";
import Select from "@carbon/react/lib/components/Select/Select";
import SelectItem from "@carbon/react/lib/components/SelectItem/SelectItem";

// Events used for parameter resets
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(20); // Arbitrary number

async function postRuleChange(ruleId, parameterChanges) {
  console.log(ruleId, parameterChanges);

  const changes = {};
  for (const paramName of Object.keys(parameterChanges)) {
    changes[paramName] = {
      value: parameterChanges[paramName].newValue,
      type: parameterChanges[paramName].type
    };
  }

  const body = {
    params: changes,
    rule: {
      id: ruleId,
      version: "1"
    }
  };

  const response = await openmrsFetch(`/cdss/modify-rule.form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const result = await response.text();
  if (response.status == 200) {
    console.log(result);
    eventEmitter.emit("modificationSucceeded", {
      ruleId: ruleId,
      parameterChanges: parameterChanges
    });
  } else {
    console.error(response);
  }
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
 * Records a change in a parameter value for a specific rule.
 *
 * @param ruleId - The identifier of the rule for which the parameter change is recorded.
 * @param paramName - The name of the parameter that has changed.
 * @param newValue - The new value of the parameter.
 * @param initialValue - The initial value of the parameter before the change.
 * @param type - The type of the parameter.
 * @param pendingChanges - An object containing all pending changes.
 * @param setPendingChanges - A function to update the pending changes state.
 *
 * Updates the pending changes with the new parameter value if it differs from the initial value.
 * Removes the parameter change from pending changes if the new value matches the initial value.
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
    type: type
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

    if (parameter.allowedValues == null || parameter.allowedValues.length == 0)
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
    else
      return (
        <Select
          id={cellId}
          className={styles.tableCellInput}
          defaultValue={initialValue}
          value={value}
          noLabel={true}
          ref={inputRef}
          warn={value != initialValue}
          warnText={"This value was modified"}
          onChange={(e) => {
            setValue(Number(e.target.value));
            return true;
          }}
        >
          {parameter.allowedValues.map((value) => (
            <SelectItem text={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </Select>
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

    if (parameter.allowedValues == null || parameter.allowedValues.length == 0)
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
    else {
      return (
        <Select
          id={cellId}
          className={styles.tableCellInput}
          defaultValue={initialValue}
          value={value}
          noLabel={true}
          ref={inputRef}
          warn={value != initialValue}
          warnText={"This value was modified"}
          onChange={(e) => {
            setValue(e.target.value);
            return true;
          }}
        >
          {parameter.allowedValues.map((value) => (
            <SelectItem text={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </Select>
      );
    }
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
  console.log(parameter);
  if (parameter == null) {
    return (
      <TableCell ref={ref} key={cellId} className={styles.cdssEditableCell}>
        Parameter was null
      </TableCell>
    );
  }
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

  function loadAndProcessData() {
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
  }

  eventEmitter.on("modificationSucceeded", (args) => {
    loadAndProcessData();
  });
  // Data structure to keep track of parameter changes
  useEffect(() => {
    loadAndProcessData();
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
        ...r.params
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
            getTableContainerProps
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
                        header
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
                          row
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
                                      ruleId: row.id
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
