import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  IconButton,
  Modal,
  Stack,
  Tooltip,
} from "@carbon/react";
import { openmrsFetch } from "@openmrs/esm-framework";

import { EventEmitter } from "events";
import styles from "./cdss-modification-page.module.scss";
// import Select from "@carbon/react/lib/components/Select/Select";
import CdssModificationTable from "./cdss-modification-table.component";
import { recordRuleUsage } from "../cdssService";
import UploadRuleDialog, { ParameterProps } from "./upload-rule-dialog";
import { Buffer } from "buffer";
import CdssEditableCell from "./cdss-editable-cell.component";
import CdssRuleEnableCell from "./cdss-rule-enable-cell.component";
import { DocumentSubtract } from "@carbon/react/icons";
import { Text } from "@carbon/react/es/components/Text";

interface CdssModificationListProps {
  rules?: Array<any>;
  pendingParameterChanges: object;
  setPendingParameterChanges: React.Dispatch<React.SetStateAction<any>>;
  eventEmitter: EventEmitter;
  uploadRuleButtonClicked?: () => any;
  archiveButtonClicked?: (ruleId) => any;
  postRuleChange?: (ruleId: string, parameterChanges: any) => void;
}

const CdssModificationList = React.forwardRef<
  HTMLInputElement,
  CdssModificationListProps
>(
  (
    {
      rules,
      pendingParameterChanges,
      setPendingParameterChanges,
      eventEmitter,
      archiveButtonClicked,
      postRuleChange,
    },
    ref
  ) => {
    return (
      <Accordion>
        <AccordionItem
          disabled={true}
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
              <strong style={{ flexShrink: 0 }}>Rule Id</strong>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div>Enabled</div>
                <div>Archive</div>
              </div>
            </Stack>
          }
        ></AccordionItem>
        {rules &&
          rules.map((rule, i) => {
            return (
              <AccordionItem
                key={rule.id}
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
                    <p style={{ flexShrink: 0 }}>
                      <span>
                        <strong> {rule.name + "-" + rule.version}</strong>
                      </span>
                      {rule.enabled == false && (
                        <span
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          <em>(Disabled)</em>
                        </span>
                      )}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <CdssRuleEnableCell
                        style={{ justifyContent: "flex-end" }}
                        ruleId={rule.id}
                        initialEnabled={rule.enabled}
                        eventEmitter={eventEmitter}
                        pendingParameterChanges={pendingParameterChanges}
                        setPendingParameterChanges={setPendingParameterChanges}
                      ></CdssRuleEnableCell>

                      <Stack
                        orientation={"horizontal"}
                        style={{ justifyContent: "flex-end" }}
                      >
                        {pendingParameterChanges &&
                          pendingParameterChanges[rule.id] &&
                          ((pendingParameterChanges[rule.id].params &&
                            Object.keys(pendingParameterChanges[rule.id].params)
                              .length > 0) ||
                            pendingParameterChanges[rule.id].enabled !=
                              null) && (
                            <div>
                              <Tooltip label={"Save Changes"}>
                                <Button
                                  kind={"primary"}
                                  onClick={(e) => {
                                    const changes =
                                      pendingParameterChanges[rule.id];
                                    postRuleChange(rule.id, changes);
                                    e.stopPropagation();
                                  }}
                                  tooltip={"Save Changes"}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onFocus={(e) => e.stopPropagation()}
                                >
                                  Save
                                </Button>
                              </Tooltip>

                              <Tooltip label={"Reset Changes"}>
                                <Button
                                  kind={"secondary"}
                                  onClick={(e) => {
                                    eventEmitter.emit("parameterReset", {
                                      ruleId: rule.id,
                                    });
                                    e.stopPropagation();
                                  }}
                                  tooltip={"Reset Changes"}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onFocus={(e) => e.stopPropagation()}
                                >
                                  Reset
                                </Button>
                              </Tooltip>
                            </div>
                          )}
                        <Tooltip label={"Archive Rule"}>
                          <IconButton
                            kind={"secondary"}
                            onClick={(e) => {
                              archiveButtonClicked(rule.id);
                              e.stopPropagation();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                          >
                            <DocumentSubtract
                              style={{ transform: "scale(2)" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </div>
                  </Stack>
                }
              >
                <div key={i} style={{ marginTop: "0.5rem" }}>
                  <strong>Description</strong>
                  <p>{rule.description}</p>
                </div>

                {rule.params &&
                  Object.keys(rule.params).length > 0 &&
                  Object.keys(rule.params).map((paramName) => {
                    const param = rule.params[paramName];
                    return (
                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>{paramName}</strong>
                        <CdssEditableCell
                          cellId={`${rule.id}-${paramName}`}
                          ruleId={rule.id}
                          parameter={param}
                          pendingChanges={pendingParameterChanges}
                          setPendingChanges={setPendingParameterChanges}
                          disabled={!rule.enabled}
                          eventEmitter={eventEmitter}
                        />
                      </div>
                    );
                  })}
              </AccordionItem>
            );
          })}
      </Accordion>
    );
  }
);
export default CdssModificationList;
