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
  TableRow,
} from "@carbon/react";
import { openmrsFetch, useConfig } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export const CdssReportsPage: React.FC = () => {
  async function toggleUsage() {
    const ac: AbortController = new AbortController();
    await openmrsFetch(`/cdss/usage.form`, {
      signal: ac.signal,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  async function getUsages() {
    const ac: AbortController = new AbortController();
    const response = await openmrsFetch(`/cdss/usages.form`, {
      signal: ac.signal,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  }

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
              <TableCell>Patient</TableCell>
              <TableCell>Occurrence Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usages.map((usage) => {
              return (
                <TableRow>
                  <TableCell>{usage[0]}</TableCell>
                  <TableCell>{usage[1]}</TableCell>
                  <TableCell>{usage[2]}</TableCell>
                  <TableCell>{usage[3]}</TableCell>
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
