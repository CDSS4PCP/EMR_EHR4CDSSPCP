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
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";
import {
  NumberInput,
  NumberInputProps,
} from "@carbon/react/lib/components/NumberInput/NumberInput";

async function getRuleData() {
  const result = await openmrsFetch("/cdss/rule-manifest.form");
  const json = await result.json();
  return json;
}

interface CdssRuleParam {
  value: any;
  type: string;
  default?: any;
}

interface CdssNumberInputProps extends NumberInputProps {
  parameter: CdssRuleParam;
  key: string;
}

const CdssNumberInput = React.forwardRef<
  HTMLInputElement,
  CdssNumberInputProps
>(({ key, parameter }, ref) => {
  const initialValue = Number(parameter.value);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef();

  return (
    <NumberInput
      id={key + ":input"}
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
});

interface CdssStringInputProps extends NumberInputProps {
  parameter: CdssRuleParam;
  key: string;
}

const CdssStringInput = React.forwardRef<
  HTMLInputElement,
  CdssStringInputProps
>(({ key, parameter }, ref) => {
  const initialValue = String(parameter.value);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef();

  return (
    <TextInput
      id={key + ":input"}
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
});

interface CdssEditableCellProps extends TableCellProps {
  parameter: CdssRuleParam;
  key: string;
  className?: string;
}

const CdssEditableCell = React.forwardRef<
  HTMLTableCellElement,
  CdssEditableCellProps
>(({ key, parameter, ...rest }, ref) => {
  return (
    <TableCell ref={ref} key={key} {...rest}>
      {parameter.type == "Integer" ? (
        <CdssNumberInput
          parameter={parameter}
          key={key}
          id={key}
        ></CdssNumberInput>
      ) : (
        <CdssStringInput
          parameter={parameter}
          key={key}
          id={key}
        ></CdssStringInput>
      )}
    </TableCell>
  );
});

export const CdssModificationPage: React.FC = () => {
  const [ruleData, setRuleData] = useState(null);
  const [columns, setColumns] = useState(null);
  useEffect(() => {
    getRuleData().then((r) => {
      setRuleData(r);

      const cols = [];
      for (const rule of r.rules) {
        const paramNames = Object.keys(rule.params);
        for (const paramName of paramNames) {
          const param = structuredClone(rule.params[paramName]);
          param["name"] = paramName;
          param["key"] = paramName;
          param["header"] = paramName;
          cols.push(param);
        }
      }
      cols.sort((a, b) => a.name.localeCompare(b.name));
      setColumns(cols);
    });
  });
  // return <DataTableSkeleton headers={[]} aria-label="sample table" />;

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
      <h1>Rule Modification</h1>

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
              title="DataTable"
              description="With expansion"
              {...getTableContainerProps()}
            >
              <TableHead>
                <TableRow>
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
                        {...getRowProps({
                          row,
                        })}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <CdssEditableCell
                              key={String(cell.id)}
                              parameter={cell.value}
                            />
                          );
                        })}
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 1}
                        className="demo-expanded-td"
                      >
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
