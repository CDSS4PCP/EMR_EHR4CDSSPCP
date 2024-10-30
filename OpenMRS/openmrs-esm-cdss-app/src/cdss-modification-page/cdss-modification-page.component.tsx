import React, { useEffect, useState } from "react";
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
  usePrefix
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import { TableCellProps } from "@carbon/react/lib/components/DataTable/TableCell";

async function getRuleData() {
  const result = await openmrsFetch("/cdss/rule-manifest.form");
  const json = await result.json();
  return json;
}

interface CdssEditableCellProps extends TableCellProps {
  parameter: any;
  key: string;
  className?: string;
}

const CdssEditableCell = React.forwardRef<
  HTMLTableCellElement,
  CdssEditableCellProps
>(({ key, className, parameter, ...rest }, ref) => {
  return (
    <TableCell ref={ref} key={key} {...rest}>
      {parameter?.value}
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
      <h1>Rule Modification</h1>

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
                        {...getRowProps({
                          row
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
