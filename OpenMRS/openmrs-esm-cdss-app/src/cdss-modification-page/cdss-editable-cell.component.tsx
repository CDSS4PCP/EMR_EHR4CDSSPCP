import {
  NumberInput,
  NumberInputProps,
} from "@carbon/react/lib/components/NumberInput/NumberInput";
import React, { useEffect, useRef, useState } from "react";
import styles from "./cdss-modification-page.module.scss";
import Select from "@carbon/react/lib/components/Select/Select";
import { SelectItem, TableCell, TextInput } from "@carbon/react";
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";
import CdssRuleParam from "./cdssRuleParam";
import { EventEmitter } from "events";
import { types } from "sass";
import Boolean = types.Boolean;

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
    type: type,
  };

  const pendingParameterChanges = { ...pendingChanges };

  // If the new value is the same as original, no need to make change, so delete the parameter from changes
  if (newValue == initialValue) {
    if (
      pendingParameterChanges[ruleId] &&
      pendingParameterChanges[ruleId].params &&
      pendingParameterChanges[ruleId].params[paramName]
    ) {
      delete pendingParameterChanges[ruleId].params[paramName];
    }
  } else {
    // Add new change to changes
    if (pendingParameterChanges[ruleId] == null) {
      pendingParameterChanges[ruleId] = { params: {} };
    }
    if (pendingParameterChanges[ruleId].params == null) {
      pendingParameterChanges[ruleId].params = {};
    }
    pendingParameterChanges[ruleId]["params"][paramName] = change;
  }

  setPendingChanges(pendingParameterChanges);
}

interface CdssNumberInputProps extends NumberInputProps {
  parameter: CdssRuleParam;
  cellId: string;
  ruleId: string;
  paramName: string;
  setPendingChanges: React.Dispatch<React.SetStateAction<any>>;
  pendingChanges: any;
  disabled: boolean;
  eventEmitter: EventEmitter;
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
      disabled,
      eventEmitter,
    },
    ref
  ) => {
    const initialValue = Number(parameter.value);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef();
    useEffect(() => {
      // if (value != initialValue)
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
  eventEmitter: EventEmitter;
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
      disabled,
      eventEmitter,
    },
    ref
  ) => {
    const initialValue = String(parameter.value);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef();
    useEffect(() => {
      // if (value != initialValue)
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

interface CdssBooleanInputProps extends NumberInputProps {
  parameter: CdssRuleParam;
  cellId: string;
  ruleId: string;
  paramName: string;
  setPendingChanges: React.Dispatch<React.SetStateAction<any>>;
  pendingChanges: any;
  disabled: boolean;
  eventEmitter: EventEmitter;
}

const CdssBooleanInput = React.forwardRef<
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
      disabled,
      eventEmitter,
    },
    ref
  ) => {
    const initialValue = parameter.value.toLowerCase() == "true";
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef();
    useEffect(() => {
      // if (value != initialValue)
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
      <Select
        id={cellId}
        className={styles.tableCellInput}
        defaultValue={initialValue}
        value={value + ""}
        noLabel={true}
        ref={inputRef}
        warn={value != initialValue}
        warnText={"This value was modified"}
        onChange={(e) => {
          setValue(e.target.value.toLowerCase() == "true");
          return true;
        }}
        disabled={disabled}
      >
        <SelectItem text={"True"} value={"true"}>
          {"true"}
        </SelectItem>
        <SelectItem text={"False"} value={"false"}>
          {"false"}
        </SelectItem>
      </Select>
    );
  }
);

interface CdssEditableCellProps extends TableCellProps {
  parameter: CdssRuleParam;
  cellId?: string;
  ruleId: string;
  setPendingChanges: React.Dispatch<React.SetStateAction<any>>;
  pendingChanges: any;
  disabled?: boolean;
  eventEmitter: EventEmitter;
}

const CdssEditableCell = React.forwardRef<
  HTMLTableCellElement,
  CdssEditableCellProps
>(
  (
    {
      parameter,
      cellId,
      ruleId,
      pendingChanges,
      setPendingChanges,
      disabled,
      eventEmitter,
    },
    ref
  ) => {
    const paramName = cellId.replace(ruleId + ":", "");

    if (parameter == null) {
      return (
        <TableCell
          ref={ref}
          key={cellId}
          className={styles.cdssEditableCell}
        ></TableCell>
      );
    }

    let input = <></>;
    if (parameter.type == "Integer") {
      input = (
        <CdssNumberInput
          parameter={parameter}
          cellId={cellId + ":input"}
          id={cellId + ":input"}
          ruleId={ruleId}
          paramName={paramName}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
          disabled={disabled}
          eventEmitter={eventEmitter}
        ></CdssNumberInput>
      );
    } else if (parameter.type == "String") {
      input = (
        <CdssStringInput
          parameter={parameter}
          cellId={cellId + ":input"}
          id={cellId + ":input"}
          ruleId={ruleId}
          paramName={paramName}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
          disabled={disabled}
          eventEmitter={eventEmitter}
        ></CdssStringInput>
      );
    } else if (parameter.type == "Boolean") {
      input = (
        <CdssBooleanInput
          parameter={parameter}
          cellId={cellId + ":input"}
          id={cellId + ":input"}
          ruleId={ruleId}
          paramName={paramName}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
          disabled={disabled}
          eventEmitter={eventEmitter}
        ></CdssBooleanInput>
      );
    }

    return (
      <TableCell ref={ref} key={cellId} className={styles.cdssEditableCell}>
        {input}
      </TableCell>
    );
  }
);

export default CdssEditableCell;
