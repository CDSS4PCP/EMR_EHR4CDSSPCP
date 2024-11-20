import React, { useRef } from "react";
import { SelectItem, TableCell } from "@carbon/react";
import styles from "./cdss-modification-page.module.scss";
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";
import Select from "@carbon/react/lib/components/Select/Select";

interface CdssRuleEnableCellProps extends TableCellProps {
  ruleId: string;
  initialEnabled: boolean;
}

const CdssRuleEnableCell = React.forwardRef<
  HTMLTableCellElement,
  CdssRuleEnableCellProps
>(({ ruleId, initialEnabled }, ref) => {
  const inputRef = useRef();

  const [enabled, setEnabled] = React.useState<boolean>(initialEnabled);
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
          setEnabled(e.target.value.toLowerCase() == "true");
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
});

export default CdssRuleEnableCell;
