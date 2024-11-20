import { NumberInput, NumberInputProps } from "@carbon/react/lib/components/NumberInput/NumberInput";
import React, { useEffect, useRef, useState } from "react";
import styles from "./cdss-modification-page.module.scss";
import Select from "@carbon/react/lib/components/Select/Select";
import { SelectItem, TableCell, TextInput } from "@carbon/react";
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";
import CdssRuleParam from "./cdssRuleParam";

interface CdssNumberInputProps extends NumberInputProps {
  parameter: CdssRuleParam;
  cellId: string;
  ruleId: string;
  paramName: string;
  setPendingChanges: React.Dispatch<React.SetStateAction<any>>;
  pendingChanges: any;
  disabled: boolean;
}

const CdssNumberInput = React.forwardRef<
  HTMLInputElement,
  CdssNumberInputProps
>(
  (
    {
      cellId,
      parameter,
      ruleId,
      paramName,
      pendingChanges,
      setPendingChanges,
      disabled
    },
    ref
  ) => {
    const initialValue = Number(parameter.value);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef();
    // useEffect(() => {
    //   recordParameterChange(
    //     ruleId,
    //     paramName,
    //     value,
    //     initialValue,
    //     parameter.type,
    //     pendingChanges,
    //     setPendingChanges
    //   );
    // }, [value]);
    // eventEmitter.on("parameterReset", (state) => {
    //   if (state.ruleId == ruleId) setValue(initialValue);
    // });

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
          disabled={disabled}
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
          disabled={disabled}
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
  disabled: boolean;
}

const CdssStringInput = React.forwardRef<
  HTMLInputElement,
  CdssStringInputProps
>(
  (
    {
      cellId,
      parameter,
      ruleId,
      paramName,
      pendingChanges,
      setPendingChanges,
      disabled
    },
    ref
  ) => {
    const initialValue = String(parameter.value);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef();
    // useEffect(() => {
    //   recordParameterChange(
    //     ruleId,
    //     paramName,
    //     value,
    //     initialValue,
    //     parameter.type,
    //     pendingChanges,
    //     setPendingChanges
    //   );
    // }, [value]);
    //
    // eventEmitter.on("parameterReset", (state) => {
    //   if (state.ruleId == ruleId) setValue(initialValue);
    // });

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
          disabled={disabled}
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
          disabled={disabled}
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
  disabled?: boolean;
}

const CdssEditableCell = React.forwardRef<
  HTMLTableCellElement,
  CdssEditableCellProps
>(
  (
    { parameter, cellId, ruleId, pendingChanges, setPendingChanges, disabled },
    ref
  ) => {
    const paramName = cellId.replace(ruleId + ":", "");
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
            disabled={disabled}
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
            disabled={disabled}
          ></CdssStringInput>
        )}
      </TableCell>
    );
  }
);

export default CdssEditableCell;
