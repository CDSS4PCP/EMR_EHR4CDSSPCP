import React, { useEffect, useState } from "react";
import {
  Form,
  Tab,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import mmr from "./MMR_descriptor.json";
import { openmrsFetch } from "@openmrs/esm-framework";
import { use } from "i18next";

async function getRuleData() {
  const result = await openmrsFetch("/cdss/rule-manifest.form");
  const json = await result.json();
  return json;
}

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
          cols.push(param);
        }
      }
      cols.sort((a, b) => a.name.localeCompare(b.name));
      setColumns(cols);
    });
  });

  if (ruleData == null && columns != null) {
    return <DataTableSkeleton headers={columns} aria-label="sample table" />;
  }
  if (ruleData == null && columns == null) {
    return <DataTableSkeleton headers={[]} aria-label="sample table" />;
  }
  return (
    <div>
      <h1>Rule Modification</h1>

      <Table useZebraStyles>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            {columns != null &&
              columns.map((m) => {
                return <TableHeader>{m.name != null && m.name}</TableHeader>;
              })}
          </TableRow>
        </TableHead>

        <TableBody>
          {ruleData != null &&
            ruleData.rules != null &&
            ruleData.rules
              .filter((r) => {
                if (r.role == null) return true;
                else return r.role.toLowerCase() == "rule";
              })
              .map((r) => {
                return (
                  <TableRow>
                    <TableCell>{r.id}</TableCell>
                    {columns.map((column) => {
                      return (
                        <TableCell>
                          {r.params != null &&
                            r.params[column.name] != null &&
                            r.params[column.name].value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
};
