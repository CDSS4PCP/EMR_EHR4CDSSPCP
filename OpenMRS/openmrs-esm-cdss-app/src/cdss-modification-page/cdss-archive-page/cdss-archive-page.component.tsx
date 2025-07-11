import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  ComposedModal,
  ContainedListItem,
  IconButton,
  Modal,
  ModalFooter,
  Stack,
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";
import { Restart } from "@carbon/react/icons";

import { EventEmitter } from "events";

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
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showRestoreConfirmationMessage, setShowRestoreConfirmationMessage] =
    useState(false);
  const [confirmationRestoreRuleId, setConfirmationRestoreRuleId] =
    useState(null);

  eventEmitter.on("ruleRestoreSucceeded", (args) => {
    setShowErrorMessage(false);
    loadAndProcessData();
  });

  eventEmitter.on("ruleRestoreFailed", (args) => {
    setShowErrorMessage(true);
    setErrorMessage(args.message);
  });

  const handleRestoreButtonClicked = async (ruleId) => {
    setConfirmationRestoreRuleId(ruleId);
    setShowRestoreConfirmationMessage(true);
  };

  const fulfillRestoreRuleRequest = async (ruleId) => {
    openmrsFetch(`/cdss/restore-rule/id/${ruleId}.form`, {
      method: "POST",
    })
      .then(async (result) => {
        eventEmitter.emit("ruleRestoreSucceeded", {});
      })
      .catch((error) => {
        eventEmitter.emit("ruleRestoreFailed", { message: error.message });
      });
  };

  function loadAndProcessData() {
    getRuleData().then((r) => {
      setRuleData(r);
    });
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

      <ComposedModal open={showRestoreConfirmationMessage}>
        <h2>Take Action</h2>
        <p>Are you sure you want to archive this rule?</p>
        <ModalFooter
          primaryButtonText={"Yes"}
          secondaryButtonText={"No"}
          onRequestClose={() => {
            setShowRestoreConfirmationMessage(false);
            setConfirmationRestoreRuleId(null);
          }}
          onRequestSubmit={() => {
            fulfillRestoreRuleRequest(confirmationRestoreRuleId);
            setShowRestoreConfirmationMessage(false);
          }}
        ></ModalFooter>
      </ComposedModal>

      <Accordion label={"Archived Rules"} size={"lg"}>
        {rules && rules.length > 0 ? (
          rules.map((rule) => {
            return (
              <AccordionItem
                title={
                  <Stack
                    orientation={"horizontal"}
                    gap={10}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <p>
                      <strong>
                        {rule.name}-{rule.version}
                      </strong>
                    </p>

                    <IconButton
                      size={"lg"}
                      onClick={(e) => {
                        handleRestoreButtonClicked(rule.id);
                        e.stopPropagation();
                      }}
                    >
                      <Restart style={{ transform: "scale(2)" }}></Restart>
                    </IconButton>
                  </Stack>
                }
              >
                <p>{rule.description}</p>

                {rule.params &&
                  Object.keys(rule.params).length > 0 &&
                  Object.keys(rule.params).map((paramName) => {
                    return (
                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>{paramName}</strong>
                        <p>{rule.params[paramName].value}</p>
                      </div>
                    );
                  })}
              </AccordionItem>
            );
          })
        ) : (
          <ContainedListItem>No archived Rules</ContainedListItem>
        )}
      </Accordion>
    </div>
  );
};
