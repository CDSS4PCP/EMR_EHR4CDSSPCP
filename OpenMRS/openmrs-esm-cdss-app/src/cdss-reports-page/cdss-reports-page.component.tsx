import React, { useEffect, useState } from "react";
import {
  Button,
  Column,
  Form,
  Grid,
  InlineNotification,
  Row,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tile,
} from "@carbon/react";
import { openmrsFetch, useConfig } from "@openmrs/esm-framework";

import "./../cdss.js";
import { getUsages } from "../cdssService";

function getYear(date) {
  return date[0];
}

function getMonth(date) {
  return date[1];
}

function getDay(date) {
  return date[2];
}

function getHour(date) {
  return date[3];
}

function getMinute(date) {
  return date[4];
}

function getSecond(date) {
  return date[5];
}

function getStatsOnUsages(usages) {
  let numTotal = 0;
  let numRoutine = 0;
  let numActed = 0;
  let numDeclined = 0;

  for (const usage of usages) {
    numTotal += 1;

    if (usage.status === "ACTED") {
      numActed += 1;
    }
    if (usage.status === "DECLINED") {
      numDeclined += 1;
    }
    if (usage.status === "ROUTINE") {
      numRoutine += 1;
    }
  }
  return {
    numTotal: numTotal,
    numRoutine: numRoutine,
    numActed: numActed,
    numDeclined: numDeclined,
  };
}

export const CdssReportsPage: React.FC = () => {
  const [usages, setUsages] = useState([]);
  const [usageStats, setUsageStats] = useState({});
  useEffect(() => {
    getUsages().then((json) => {
      setUsages(json);
      const stats = getStatsOnUsages(json);
      setUsageStats(stats);
    });
  }, []);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          height: "4rem",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        <span style={{ fontSize: "1.25rem", color: "#161616" }}>
          {" "}
          All Reports{" "}
        </span>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5rem 0rem",
          flexFlow: "row wrap",
        }}
      >
        <div style={{ flexGrow: "1" }}>
          <div>
            <div
              style={{
                margin: "0.5rem",
                padding: "1rem",
                height: "7.875rem",
                border: ".0625rem solid #e0e0e0",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  letterSpacing: "0.16px",
                  color: "#525252",
                }}
              >
                Totals
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "400",
                      letterSpacing: "0.32px",
                      color: "##525252",
                    }}
                  >
                    Total usages
                  </p>
                  <p
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "400",
                      letterSpacing: 0,
                      color: "#161616",
                    }}
                  >
                    {usageStats["numTotal"] == undefined
                      ? 0
                      : usageStats["numTotal"]}
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto auto auto",
                    justifySelf: "flex-end",
                    columnGap: "0.5rem",
                    rowGap: "0.5rem",
                    margin: "0.5rem",
                  }}
                >
                  <p style={{ fontSize: "0.625rem", color: "#525252" }}>
                    ROUTINE
                  </p>
                  <p style={{ fontSize: "0.625rem", color: "#525252" }}>
                    ACTED
                  </p>
                  <p style={{ fontSize: "0.625rem", color: "#525252" }}>
                    DECLINED
                  </p>
                  <p style={{ color: "#525252" }}>
                    {usageStats["numRoutine"] == undefined
                      ? 0
                      : usageStats["numRoutine"]}
                  </p>
                  <p style={{ color: "#319227" }}>
                    {usageStats["numActed"] == undefined
                      ? 0
                      : usageStats["numActed"]}
                  </p>
                  <p style={{ color: "#DA1E28" }}>
                    {usageStats["numDeclined"] == undefined
                      ? 0
                      : usageStats["numDeclined"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flexGrow: "1" }}>
          <div>
            <div
              style={{
                margin: "0.5rem",
                padding: "1rem",
                height: "7.875rem",
                border: ".0625rem solid #e0e0e0",
              }}
            >
              10
            </div>
          </div>
        </div>
        <div style={{ flexGrow: "1" }}>
          <div>
            <div
              style={{
                margin: "0.5rem",
                padding: "1rem",
                height: "7.875rem",
                border: ".0625rem solid #e0e0e0",
              }}
            >
              10
            </div>
          </div>
        </div>
      </div>

      <TableContainer style={{ padding: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Vaccine</TableCell>
              <TableCell>Rule</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Recommendation</TableCell>
              <TableCell>Occurrence Time</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usages.map((usage) => {
              return (
                <TableRow>
                  <TableCell>{usage.id}</TableCell>
                  <TableCell>{usage.vaccine}</TableCell>
                  <TableCell>{usage.rule}</TableCell>
                  <TableCell>{usage.patientId}</TableCell>
                  <TableCell>{usage.recommendation}</TableCell>
                  <TableCell>
                    {getYear(usage.timestamp)}-{getMonth(usage.timestamp)}-
                    {getDay(usage.timestamp)} {getHour(usage.timestamp)}:
                    {getMinute(usage.timestamp)}:{getSecond(usage.timestamp)}
                  </TableCell>
                  <TableCell>{usage.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CdssReportsPage;
