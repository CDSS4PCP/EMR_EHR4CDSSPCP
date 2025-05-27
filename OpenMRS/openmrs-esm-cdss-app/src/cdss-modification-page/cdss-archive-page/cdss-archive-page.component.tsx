import React, { useEffect, useState } from "react";
import {
  ContainedList,
  ContainedListItem,
  IconButton,
  ListItem,
  Modal,
  UnorderedList,
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";
import { Restart } from "@carbon/react/icons";

import { EventEmitter } from "events";
import styles from "./cdss-modification-page.module.scss";
import { recordRuleUsage } from "../../cdssService";
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
  const result = await openmrsFetch("/cdss/rule-archive.form");
  const json = await result.json();
  return json;
}

export const CdssArchivePage: React.FC = () => {
  const [ruleData, setRuleData] = useState(null);
  const [columns, setColumns] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showArchiveConfirmationMessage, setShowArchiveConfirmationMessage] =
    useState(false);
  const [confirmationArchiveRuleId, setConfirmationArchiveRuleId] =
    useState(null);

  const [pendingParameterChanges, setPendingParameterChanges] = useState({});

  const [isUploadRuleDialogOpen, setIsUploadRuleDialogOpen] = useState(false);

  const handleUploadRuleButtonClicked = () => {
    setIsUploadRuleDialogOpen(true);
  };

  const handleCloseUploadRuleDialog = () => {
    setIsUploadRuleDialogOpen(false);
  };

  const fulfillArchiveRuleRequest = (ruleId) => {
    if (ruleId == null) {
      eventEmitter.emit("ruleArchiveFailed", { message: "RuleId was null" });
      return;
    }
    openmrsFetch(`/cdss/archive-rule/id/${ruleId}.form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        eventEmitter.emit("ruleArchiveSucceeded", {});
      })
      .catch((error) => {
        eventEmitter.emit("ruleArchiveFailed", { message: error.message });
      });
  };
  const handleRestoreButtonClicked = async (ruleId) => {
    // setConfirmationArchiveRuleId(ruleId);
    // setShowArchiveConfirmationMessage(true);
    console.log("restoreButtonClicked", ruleId);
    const result = await openmrsFetch(`/cdss/restore-rule/id/${ruleId}.form`, {
      method: "POST",
    });
    // const json = await result.json();
    // console.log(json);
    return result;
  };

  function loadAndProcessData() {
    getRuleData().then((r) => {
      setRuleData(r);
    });
    setPendingParameterChanges({});
    // setPendingParameterChanges2({});
  }

  // Data structure to keep track of parameter changes
  useEffect(() => {
    loadAndProcessData();
  }, []);

  const rules = ruleData
    ?.filter((r) => r.role.toLowerCase() == "rule")
    .map((r) => {
      const obj = {
        id: r.id,
        name: r.libraryName,
        version: r.version,
        // cqlFilePath: r.cqlFilePath,
        // elmFilePath: r.elmFilePath,
        description: r.description,
        role: r.role,
        enabled: r.enabled,
        ...r.params,
      };
      return obj;
    });

  return (
    <div>
      <ContainedList label={"Archived Rules"} size={"lg"}>
        {rules && rules.length > 0 ? (
          rules.map((rule) => {
            return (
              <ContainedListItem
                action={
                  <IconButton
                    size={"lg"}
                    onClick={() => {
                      handleRestoreButtonClicked(rule.id);
                    }}
                  >
                    <Restart size={"lg"}></Restart>
                  </IconButton>
                }
              >
                <p>
                  {rule.name}-{rule.version}
                </p>
              </ContainedListItem>
            );
          })
        ) : (
          <ContainedListItem>No archived Rules</ContainedListItem>
        )}
      </ContainedList>
    </div>
  );
};
