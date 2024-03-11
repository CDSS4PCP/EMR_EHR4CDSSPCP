import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";

export default function CdssReportsLink() {
  return <ConfigurableLink to={window["getOpenmrsSpaBase"] + "/cdss-reports"}>CDSS Reports</ConfigurableLink>;
}
