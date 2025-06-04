import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

export default function CdssManagementLink() {
  const url = window["origin"] + window["spaBase"] + "/cdss/edit";

  return <ConfigurableLink to={url}>CDSS Rule Management</ConfigurableLink>;
}
