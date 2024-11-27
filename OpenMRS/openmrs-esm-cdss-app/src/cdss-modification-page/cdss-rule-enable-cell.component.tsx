import React, { useRef } from "react";
import { SelectItem, TableCell } from "@carbon/react";
import styles from "./cdss-modification-page.module.scss";
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";
import Select from "@carbon/react/lib/components/Select/Select";
import { EventEmitter } from "events";

interface CdssRuleEnableCellProps extends TableCellProps {
  ruleId: string;
  initialEnabled: boolean;
  eventEmitter?: EventEmitter;
  pendingParameterChanges: object;
  setPendingParameterChanges: React.Dispatch<React.SetStateAction<any>>;
}

const CdssRuleEnableCell = React.forwardRef<
  HTMLTableCellElement,
  CdssRuleEnableCellProps
>(
  (
    {
      ruleId,
      initialEnabled,
      eventEmitter,
      pendingParameterChanges,
      setPendingParameterChanges,
    },
    ref
  ) => {
    const inputRef = useRef();

    const [enabled, setEnabled] = React.useState<boolean>(initialEnabled);

    if (eventEmitter != null)
      eventEmitter.on("parameterReset", (ruleReset) => {
        if (ruleReset.ruleId == ruleId) {
          if (
            pendingParameterChanges[ruleId] &&
            pendingParameterChanges[ruleId].enabled != null
          ) {
            setEnabled(initialEnabled);
            delete pendingParameterChanges[ruleId].enabled;
            setPendingParameterChanges({ ...pendingParameterChanges });
          }
        }
      });

    return (
      <TableCell
        ref={ref}
        key={ruleId + ":enable"}
        className={styles.cdssEditableCell}
      >
        <Select
          id={ruleId + ":enable:input"}
          className={styles.tableCellInput}
          defaultValue={initialEnabled}
          value={enabled + ""}
          noLabel={true}
          ref={inputRef}
          warn={enabled != initialEnabled}
          warnText={"This value was modified"}
          onChange={(e) => {
            const newEnabled = e.target.value.toLowerCase() == "true";

            setEnabled(newEnabled);

            if (pendingParameterChanges[ruleId] == null) {
              pendingParameterChanges[ruleId] = { enabled: newEnabled };
            } else {
              pendingParameterChanges[ruleId].enabled = newEnabled;
            }
            setPendingParameterChanges({ ...pendingParameterChanges });
            return true;
          }}
        >
          <SelectItem text={"Yes"} value={true}>
            Yes
          </SelectItem>
          <SelectItem text={"No"} value={false}>
            No
          </SelectItem>
        </Select>
      </TableCell>
    );
  }
);

export default CdssRuleEnableCell;
