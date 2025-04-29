import React, { useEffect, useState } from "react";
import { Modal } from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";

import { EventEmitter } from "events";
import styles from "./cdss-modification-page.module.scss";
// import Select from "@carbon/react/lib/components/Select/Select";
import CdssModificationTable from "./cdss-modification-table.component";
import { recordRuleUsage } from "../cdssService";
import UploadRuleDialog, { ParameterProps } from "./upload-rule-dialog";
import { Buffer } from "buffer";

// Events used for parameter resets
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(1000); // Arbitrary number

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
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pendingParameterChanges, setPendingParameterChanges] = useState({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleUploadRuleSubmit = async (
    libraryName: string,
    libraryVersion: string,
    description: string,
    enabled: boolean,
    file: File,
    params: Record<string, ParameterProps>
  ) => {
    const cqlContents = await file.text();
    const cqlEncoded = Buffer.from(cqlContents).toString("base64");
    const body = {
      libraryName: libraryName,
      libraryVersion: libraryVersion,
      description: description,
      ruleRole: "RULE",
      cql: cqlEncoded,
      params: params,
    };
    openmrsFetch("/cdss/create-rule.form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    })
      .then((response) => {
        eventEmitter.emit("ruleUploadSucceeded", {});
      })
      .catch((error) => {
        eventEmitter.emit("ruleUploadFailed", { message: error.message });
      });
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
    setPendingParameterChanges({});
    // setPendingParameterChanges2({});
  }

  eventEmitter.on("modificationSucceeded", (args) => {
    const newPendingChanges = { ...pendingParameterChanges };
    delete newPendingChanges[args.ruleId];
    setPendingParameterChanges(newPendingChanges);

    loadAndProcessData();
  });

  eventEmitter.on("modificationFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });

  eventEmitter.on("ruleEnableSucceeded", (args) => {
    loadAndProcessData();
  });

  eventEmitter.on("ruleDisableSucceeded", (args) => {
    loadAndProcessData();
  });

  eventEmitter.on("ruleUploadSucceeded", (args) => {
    loadAndProcessData();
  });

  eventEmitter.on("ruleEnableFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });

  eventEmitter.on("ruleDisableFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });
  eventEmitter.on("ruleUploadFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });

  // Data structure to keep track of parameter changes
  useEffect(() => {
    loadAndProcessData();
  }, []);

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
      <Modal
        modalHeading="Take action"
        open={showErrorMessage}
        primaryButtonText="Ok"
        passiveModal
        onRequestClose={() => setShowErrorMessage(false)}
        onRequestSubmit={() => {
          setShowErrorMessage(false);
        }}
      >
        <p>Could not fulfill request because of an error</p>
        <code>{errorMessage}</code>
      </Modal>

      <UploadRuleDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleUploadRuleSubmit}
      />

      <h1 className={styles.modHeader}>Rule Management</h1>

      <CdssModificationTable
        rules={rules}
        columns={columns}
        pendingParameterChanges={pendingParameterChanges}
        setPendingParameterChanges={setPendingParameterChanges}
        eventEmitter={eventEmitter}
        uploadRuleButtonClicked={handleOpenDialog}
      />
    </div>
  );
};
