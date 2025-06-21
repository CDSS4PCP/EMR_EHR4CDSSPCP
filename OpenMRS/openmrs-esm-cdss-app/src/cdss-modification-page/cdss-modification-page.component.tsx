import React, { useEffect, useState } from "react";
import {
  Button,
  ComposedModal,
  Form,
  IconButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SelectItem,
  Stack,
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";

import { EventEmitter } from "events";
import styles from "./cdss-modification-page.module.scss";
import CdssModificationTable from "./cdss-modification-table.component";
import UploadRuleDialog, { ParameterProps } from "./upload-rule-dialog";
import { Buffer } from "buffer";
import { DocumentAdd } from "@carbon/react/icons";
import CdssModificationList from "./cdss-modification-list.component";
import Select from "@carbon/react/lib/components/Select/Select";
import * as url from "node:url";

// Events used for parameter resets
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(1000); // Arbitrary number

async function enableRule(ruleId) {
  const url = `/cdss/enable-rule/${ruleId}.form`;
  try {
    const response = await openmrsFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.url.includes(url) && response.status === 200) {
      eventEmitter.emit("ruleEnableSucceeded", { ruleId });
    } else {
      const message = await response.text();
      eventEmitter.emit("ruleEnableFailed", { ruleId, message });
    }
  } catch (e) {
    eventEmitter.emit("ruleEnableFailed", { ruleId, message: e.message });
  }
}

async function disableRule(ruleId) {
  const url = `/cdss/disable-rule/${ruleId}.form`;
  try {
    const response = await openmrsFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.url.includes(url) && response.status === 200) {
      eventEmitter.emit("ruleDisableSucceeded", { ruleId });
    } else {
      const message = await response.text();
      eventEmitter.emit("ruleDisableFailed", { ruleId, message });
    }
  } catch (e) {
    eventEmitter.emit("ruleDisableFailed", { ruleId, message: e.message });
  }
}

async function sendParameterChanges(ruleId, changes, parameterChanges) {
  const url = `/cdss/modify-rule.form`;
  const body = {
    params: changes,
    rule: { id: ruleId },
  };

  try {
    const response = await openmrsFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.url.includes(url) && response.status === 200) {
      eventEmitter.emit("modificationSucceeded", {
        ruleId: ruleId,
        parameterChanges: parameterChanges,
      });
      eventEmitter.emit("parameterReset", {
        ruleId: ruleId,
        parameterChanges: parameterChanges,
      });
    } else {
      const message = await response.text();
      eventEmitter.emit("modificationFailed", {
        ruleId: ruleId,
        parameterChanges: parameterChanges,
        message: message,
      });
    }
  } catch (e) {
    eventEmitter.emit("modificationFailed", {
      ruleId: ruleId,
      parameterChanges: parameterChanges,
      message: e.message,
    });
  }
}

async function postRuleChange(ruleId, parameterChanges) {
  const changes = {};
  if (parameterChanges.params != null)
    for (const paramName of Object.keys(parameterChanges.params)) {
      changes[paramName] = {
        value: parameterChanges.params[paramName].newValue,
        type: parameterChanges.params[paramName].type,
      };
    }

  if (Object.keys(changes).length > 0) {
    await sendParameterChanges(ruleId, changes, parameterChanges);

    // try {
    //   const response = await openmrsFetch(`/cdss/modify-rule.form`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });
    //   if (response.status == 200) {
    //     eventEmitter.emit("modificationSucceeded", {
    //       ruleId: ruleId,
    //       parameterChanges: parameterChanges,
    //     });
    //     eventEmitter.emit("parameterReset", {
    //       ruleId: ruleId,
    //       parameterChanges: parameterChanges,
    //     });
    //   } else {
    //     eventEmitter.emit("modificationFailed", {
    //       ruleId: ruleId,
    //       parameterChanges: parameterChanges,
    //       message: await response.text(),
    //     });
    //   }
    // } catch (e) {
    //   eventEmitter.emit("modificationFailed", {
    //     ruleId: ruleId,
    //     parameterChanges: parameterChanges,
    //     message: e.message,
    //   });
    // }
  }

  if (parameterChanges.enabled != null) {
    if (parameterChanges.enabled == true) {
      await enableRule(ruleId);
    } else {
      await disableRule(ruleId);
    }
  }
}

async function fulfillArchiveRuleRequest(ruleId) {
  if (ruleId == null) {
    eventEmitter.emit("ruleArchiveFailed", { message: "RuleId was null" });
    return;
  }
  const url = `/cdss/archive-rule/id/${ruleId}.form`;
  const response = await openmrsFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (response.url.includes(url) && response.status == 200) {
    eventEmitter.emit("ruleArchiveSucceeded", { ruleId: ruleId });
  } else {
    const message = await response.text();

    eventEmitter.emit("ruleArchiveFailed", {
      ruleId: ruleId,
      message: message,
    });
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
 * Fetches vaccines from server
 *
 * @returns {Promise<any>} The JSON list containing vaccine list.
 */
async function getVaccines() {
  const result = await openmrsFetch("/cdss/vaccines.form");
  const json = await result.json();
  return json;
}

export const CdssModificationPage: React.FC = () => {
  const [ruleData, setRuleData] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [vaccine, setVaccine] = useState("noVaccine");
  const [columns, setColumns] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showArchiveConfirmationMessage, setShowArchiveConfirmationMessage] =
    useState(false);
  const [confirmationArchiveRuleId, setConfirmationArchiveRuleId] =
    useState(null);

  const [pendingParameterChanges, setPendingParameterChanges] = useState({});

  const [isUploadRuleDialogOpen, setIsUploadRuleDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  const handleUploadRuleButtonClicked = () => {
    setIsUploadRuleDialogOpen(true);
  };

  const handleCloseUploadRuleDialog = () => {
    setIsUploadRuleDialogOpen(false);
  };

  const handleArchiveButtonClicked = (ruleId) => {
    setConfirmationArchiveRuleId(ruleId);
    setShowArchiveConfirmationMessage(true);
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
      const newRuleData = { rules: [] };
      r.rules.forEach((rule) => {
        if (
          (vaccine == "noVaccine" && rule.vaccine == null) ||
          rule.vaccine == vaccine
        ) {
          newRuleData.rules.push(rule);
        }
      });

      setRuleData(newRuleData);

      const cols = {};
      for (const rule of newRuleData.rules) {
        if (vaccine != null)
          if (
            (vaccine == "noVaccine" && rule.vaccine == null) ||
            rule.vaccine == vaccine
          ) {
            const paramNames = Object.keys(rule.params);
            for (const paramName of paramNames) {
              const param = structuredClone(rule.params[paramName]);
              param["name"] = paramName;
              param["key"] = paramName;
              param["header"] = paramName;
              cols[paramName] = param;
            }
          }
      }
      const columnList: any[] = Object.values(cols);
      columnList.sort((a, b) => a?.name.localeCompare(b.name));
      setColumns(columnList);
    });
    setPendingParameterChanges({});
  }

  eventEmitter.on("modificationSucceeded", (args) => {
    const newPendingChanges = { ...pendingParameterChanges };
    delete newPendingChanges[args.ruleId];
    setPendingParameterChanges(newPendingChanges);

    loadAndProcessData();
  });

  eventEmitter.on("ruleEnableSucceeded", (args) => {
    setShowErrorMessage(false);

    loadAndProcessData();
  });

  eventEmitter.on("ruleDisableSucceeded", (args) => {
    setShowErrorMessage(false);

    loadAndProcessData();
  });

  eventEmitter.on("ruleUploadSucceeded", (args) => {
    setShowErrorMessage(false);

    loadAndProcessData();
  });

  eventEmitter.on("ruleArchiveSucceeded", (args) => {
    setShowErrorMessage(false);
    loadAndProcessData();
  });

  eventEmitter.on("modificationFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });

  eventEmitter.on("ruleEnableFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
    eventEmitter.emit("parameterReset", { ruleId: args.ruleId });
  });

  eventEmitter.on("ruleDisableFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
    eventEmitter.emit("parameterReset", { ruleId: args.ruleId });
  });
  eventEmitter.on("ruleUploadFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });

  eventEmitter.on("ruleArchiveFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });
  // Data structure to keep track of parameter changes
  useEffect(() => {
    getVaccines().then((v) => {
      setVaccines(v);
      if (v && v.length && v.length > 0) {
        setVaccine(vaccines[0]);
      } else {
        setVaccine("noVaccine");
      }
    });
  }, []);

  useEffect(() => {
    loadAndProcessData();
  }, [vaccine]);

  const rules = ruleData?.rules
    ?.filter((r) => r.role.toLowerCase() == "rule")
    .map((r) => {
      const name = r.libraryName != null ? r.libraryName : r.name;
      const obj = {
        id: r.id,
        name: name,
        version: r.version,
        // cqlFilePath: r.cqlFilePath,
        // elmFilePath: r.elmFilePath,
        description: r.description,
        role: r.role,
        enabled: r.enabled,
        params: r.params,
      };

      return obj;
    });

  return (
    <div>
      <ComposedModal
        open={showErrorMessage}
        passiveModal
        onClose={() => setShowErrorMessage(false)}
      >
        <h2>Could not fulfill request because of an error</h2>
        <code>{errorMessage}</code>
      </ComposedModal>

      <ComposedModal open={showArchiveConfirmationMessage}>
        <h2>Take Action</h2>
        <p>Are you sure you want to archive this rule?</p>
        <ModalFooter
          primaryButtonText={"Yes"}
          secondaryButtonText={"No"}
          onRequestClose={() => {
            setShowArchiveConfirmationMessage(false);
            setConfirmationArchiveRuleId(null);
          }}
          onRequestSubmit={() => {
            fulfillArchiveRuleRequest(confirmationArchiveRuleId);
            setShowArchiveConfirmationMessage(false);
          }}
        ></ModalFooter>
      </ComposedModal>

      <UploadRuleDialog
        isOpen={isUploadRuleDialogOpen}
        onClose={handleCloseUploadRuleDialog}
        onSubmit={handleUploadRuleSubmit}
      />

      <h1 className={styles.modHeader}>Rule Management</h1>

      <Form style={{ marginLeft: "1rem", marginRight: "1rem" }}>
        <Stack
          orientation="horizontal"
          spacing={2}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <Select
              helperText="Select your view"
              labelText="Select your view"
              id={"view-select"}
              defaultValue={"table"}
              onChange={(e) => {
                setViewMode(e.target.value);
              }}
              size="sm"
            >
              <SelectItem text="Table" value="table" />
              <SelectItem text="List" value="list" />
            </Select>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Select
              helperText="Select a Vaccine"
              labelText="Select a Vaccine"
              id={"vaccine-select"}
              defaultValue={
                vaccines && vaccines.length > 0 ? vaccines[0] : "noVaccine"
              }
              onChange={(e) => {
                setVaccine(e.target.value);
                loadAndProcessData();
              }}
              size="sm"
            >
              {vaccines &&
                vaccines.map((vaccine) => (
                  <SelectItem
                    id={"vaccine-" + vaccine}
                    text={vaccine}
                    value={vaccine}
                  ></SelectItem>
                ))}
              <SelectItem
                id={"noVaccine"}
                text={"No vaccine"}
                value={"noVaccine"}
              ></SelectItem>
            </Select>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <IconButton
              tooltip={"Upload a new Rule"}
              label={"Upload a new Rule"}
              size={"lg"}
              style={{
                marginLeft: "2rem",
                marginRight: "2rem",
                marginTop: "2px",
                marginBottom: "2px",
              }}
              onClick={() => {
                if (handleUploadRuleButtonClicked !== null) {
                  handleUploadRuleButtonClicked();
                }
              }}
            >
              <DocumentAdd style={{ transform: "scale(2)" }} />
            </IconButton>
          </div>
        </Stack>
      </Form>

      {viewMode == "table" && columns ? (
        <CdssModificationTable
          rules={rules}
          columns={columns}
          pendingParameterChanges={pendingParameterChanges}
          setPendingParameterChanges={setPendingParameterChanges}
          eventEmitter={eventEmitter}
          uploadRuleButtonClicked={handleUploadRuleButtonClicked}
          archiveButtonClicked={handleArchiveButtonClicked}
          postRuleChange={postRuleChange}
        />
      ) : (
        <CdssModificationList
          rules={rules}
          pendingParameterChanges={pendingParameterChanges}
          setPendingParameterChanges={setPendingParameterChanges}
          eventEmitter={eventEmitter}
          uploadRuleButtonClicked={handleUploadRuleButtonClicked}
          archiveButtonClicked={handleArchiveButtonClicked}
          postRuleChange={postRuleChange}
        ></CdssModificationList>
      )}
    </div>
  );
};
