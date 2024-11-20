import React, { useEffect, useState } from "react";
import { DataTableSkeleton, TextInput, SelectItem } from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";

import { EventEmitter } from "events";
import styles from "./cdss-modification-page.module.scss";
import Select from "@carbon/react/lib/components/Select/Select";
import CdssModificationTable from "./cdss-modification-table.component";

// Events used for parameter resets
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(20); // Arbitrary number

async function postRuleChange(ruleId, parameterChanges) {
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
    },
  };

  const response = await openmrsFetch(`/cdss/modify-rule.form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.text();
  if (response.status == 200) {
    eventEmitter.emit("modificationSucceeded", {
      ruleId: ruleId,
      parameterChanges: parameterChanges,
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

export const CdssModificationPage: React.FC = () => {
  const [ruleData, setRuleData] = useState(null);
  const [columns, setColumns] = useState(null);
  const [pendingParameterChanges, setPendingParameterChanges] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

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
      // columnList.unshift({
      //   name: "Enabled",
      //   key: "enabled",
      //   header: "enabled"
      // });

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
        setPendingParameterChanges={setPendingParameterChanges}
      />
    </div>
  );
};
