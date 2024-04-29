import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InlineNotification,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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

export const CdssReportsPage: React.FC = () => {
  // async function getUsages() {
  //   const ac: AbortController = new AbortController();
  //   const response = await openmrsFetch(`/cdss/usages.form`, {
  //     signal: ac.signal,
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //
  //   return await response.json();
  // }

  const [usages, setUsages] = useState([]);
  useEffect(() => {
    getUsages().then((json) => {
      setUsages(json);
    });
  }, []);

  return (
    <div>
      <h1> All Reports </h1>

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
