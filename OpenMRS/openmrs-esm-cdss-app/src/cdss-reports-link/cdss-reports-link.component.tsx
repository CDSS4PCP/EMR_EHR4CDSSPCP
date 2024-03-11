import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

export default function CdssReportsLink() {
  const url = window["origin"] + window["spaBase"] + "/cdss/reports";

  return <ConfigurableLink to={url}>CDSS Reports</ConfigurableLink>;
}
