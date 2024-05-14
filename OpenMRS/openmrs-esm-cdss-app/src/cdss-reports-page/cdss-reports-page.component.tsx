import React, { useEffect, useState } from "react";
import {
  Button,
  Column,
  Form,
  Grid,
  InlineNotification, ListItem, OrderedList,
  Row,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tile, UnorderedList
} from "@carbon/react";
import { openmrsFetch, useConfig } from "@openmrs/esm-framework";

import "./../cdss.js";
import { getUsages } from "../cdssService";

import styles from "./cdss-reports-page.module.scss";

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

  const uniquePatients: Set<string> = new Set([]);
  const uniquePatientsActed: Set<string> = new Set([]);
  const uniquePatientsDeclined: Set<string> = new Set([]);
  const uniquePatientsRoutine: Set<string> = new Set([]);
  const uniqueRules: Set<string> = new Set([]);
  const uniqueRulesActed: Set<string> = new Set([]);
  const uniqueRulesDeclined: Set<string> = new Set([]);
  const uniqueRulesRoutine: Set<string> = new Set([]);

  for (const usage of usages) {
    numTotal += 1;
    uniquePatients.add(usage.patientId);
    uniqueRules.add(usage.rule);

    if (usage.status === "ACTED") {
      numActed += 1;
      uniquePatientsActed.add(usage.patientId);
      uniqueRulesActed.add(usage.rule);
    }
    if (usage.status === "DECLINED") {
      numDeclined += 1;
      uniquePatientsDeclined.add(usage.patientId);
      uniqueRulesDeclined.add(usage.rule);
    }
    if (usage.status === "ROUTINE") {
      numRoutine += 1;
      uniquePatientsRoutine.add(usage.patientId);
      uniqueRulesRoutine.add(usage.rule);
    }
  }

  return {
    numTotal: numTotal,
    numRoutine: numRoutine,
    numActed: numActed,
    numDeclined: numDeclined,
    numUniquePatients: uniquePatients.size,
    numUniquePatientsActed: uniquePatientsActed.size,
    numUniquePatientsDeclined: uniquePatientsDeclined.size,
    numUniquePatientsRoutine: uniquePatientsRoutine.size,
    numUniqueUsedRules: uniqueRules.size,
    numUniqueUsedRulesActed: uniqueRulesActed.size,
    numUniqueUsedRulesDeclined: uniqueRulesDeclined.size,
    numUniqueUsedRulesRoutine: uniqueRulesRoutine.size
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
      <div className={styles.reportsHeaderContainer}>
        <span className={styles.reportsHeader}>All Reports</span>
      </div>
      <div className={styles.reportStatsContainer}>
        <div style={{ flexGrow: "1" }}>
          <div>
            <div className={styles.reportStatsCategoryHeaderContainer}>
              <div>Totals</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <p className={styles.reportStatsDataPointHeader}>
                    Total usages
                  </p>
                  <p className={styles.reportStatsDataPointValue}>
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
                    margin: "0.5rem"
                  }}
                >
                  <p className={styles.reportStatsDataPointHeader}>ROUTINE</p>
                  <p className={styles.reportStatsDataPointHeader}>ACTED</p>
                  <p className={styles.reportStatsDataPointHeader}>DECLINED</p>
                  <p className={styles.reportStatsDataPointValue}>
                    {usageStats["numRoutine"] == undefined
                      ? 0
                      : usageStats["numRoutine"]}
                  </p>
                  <p className={styles.reportStatsDataPointValueGreen}>
                    {usageStats["numActed"] == undefined
                      ? 0
                      : usageStats["numActed"]}
                  </p>
                  <p className={styles.reportStatsDataPointValueRed}>
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
            <div className={styles.reportStatsCategoryHeaderContainer}>
              <div>Patients</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <p className={styles.reportStatsDataPointHeader}>
                    Number of Unique Patients
                  </p>
                  <p className={styles.reportStatsDataPointValue}>
                    {usageStats["numUniquePatients"] == undefined
                      ? 0
                      : usageStats["numUniquePatients"]}
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto auto auto",
                    justifySelf: "flex-end",
                    columnGap: "0.5rem",
                    rowGap: "0.5rem",
                    margin: "0.5rem"
                  }}
                >
                  <p className={styles.reportStatsDataPointHeader}>ROUTINE</p>
                  <p className={styles.reportStatsDataPointHeader}>ACTED</p>
                  <p className={styles.reportStatsDataPointHeader}>DECLINED</p>
                  <p className={styles.reportStatsDataPointValue}>
                    {usageStats["numUniquePatientsRoutine"] == undefined
                      ? 0
                      : usageStats["numUniquePatientsRoutine"]}
                  </p>
                  <p className={styles.reportStatsDataPointValueGreen}>
                    {usageStats["numUniquePatientsActed"] == undefined
                      ? 0
                      : usageStats["numUniquePatientsActed"]}
                  </p>
                  <p className={styles.reportStatsDataPointValueRed}>
                    {usageStats["numUniquePatientsDeclined"] == undefined
                      ? 0
                      : usageStats["numUniquePatientsDeclined"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flexGrow: "1" }}>
          <div>
            <div className={styles.reportStatsCategoryHeaderContainer}>
              <div>Rules</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <p className={styles.reportStatsDataPointHeader}>
                    Number of Used Unique Rules
                  </p>
                  <p className={styles.reportStatsDataPointValue}>
                    {usageStats["numUniqueUsedRules"] == undefined
                      ? 0
                      : usageStats["numUniqueUsedRules"]}
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto auto auto",
                    justifySelf: "flex-end",
                    columnGap: "0.5rem",
                    rowGap: "0.5rem",
                    margin: "0.5rem"
                  }}
                >
                  <p className={styles.reportStatsDataPointHeader}>ROUTINE</p>
                  <p className={styles.reportStatsDataPointHeader}>ACTED</p>
                  <p className={styles.reportStatsDataPointHeader}>DECLINED</p>
                  <p className={styles.reportStatsDataPointValue}>
                    {usageStats["numUniqueUsedRulesRoutine"] == undefined
                      ? 0
                      : usageStats["numUniqueUsedRulesRoutine"]}
                  </p>
                  <p className={styles.reportStatsDataPointValueGreen}>
                    {usageStats["numUniqueUsedRulesActed"] == undefined
                      ? 0
                      : usageStats["numUniqueUsedRulesActed"]}
                  </p>
                  <p className={styles.reportStatsDataPointValueRed}>
                    {usageStats["numUniqueUsedRulesDeclined"] == undefined
                      ? 0
                      : usageStats["numUniqueUsedRulesDeclined"]}
                  </p>
                </div>
              </div>
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
                  <TableCell>
                    {usage.recommendations != undefined &&
                      <UnorderedList>
                        {usage.recommendations.map((r) => {
                          return <ListItem>{r.recommendation}</ListItem>;
                        })}
                      </UnorderedList>
                    }
                    {usage.recommendation1 != undefined &&
                      <>{usage.recommendation1}</>
                    }

                  </TableCell>
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
