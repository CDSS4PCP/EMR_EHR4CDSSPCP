import React, { useEffect, useState } from "react";
import { DataTableSkeleton, TextInput, SelectItem } from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";

import { EventEmitter } from "events";
import styles from "./cdss-modification-page.module.scss";
import Select from "@carbon/react/lib/components/Select/Select";
import CdssModificationTable from "./cdss-modification-table.component";

// Events used for parameter resets
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(200); // Arbitrary number

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

export const CdssModificationPage: React.FC = () => {
  const [ruleData, setRuleData] = useState(null);
  const [columns, setColumns] = useState(null);
  const [pendingParameterChanges, setPendingParameterChanges] = useState({});

  const setPendingParameterChanges2 = (newValue) => {
    // if (newValue != null && Object.keys(newValue).length > 0) {
    //   throw new Error("Find stacktrace here!");
    // }
    // console.log("Calling setPendingParameterChanges=", newValue);

    setPendingParameterChanges(newValue);
  };

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

    setPendingParameterChanges2({});
  }

  eventEmitter.on("modificationSucceeded", (args) => {
    loadAndProcessData();
  });
  // Data structure to keep track of parameter changes
  useEffect(() => {
    loadAndProcessData();
  }, []);

  // if (ruleData == null || columns == null) {
  //   return <DataTableSkeleton headers={[]} aria-label="empty table" />;
  // }

  const rules = ruleData?.rules
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

  return (
    <div>
      <h1 className={styles.modHeader}>Rule Modification</h1>

      <CdssModificationTable
        rules={rules}
        columns={columns}
        pendingParameterChanges={pendingParameterChanges}
        setPendingParameterChanges={setPendingParameterChanges2}
        eventEmitter={eventEmitter}
      />
    </div>
  );
};
