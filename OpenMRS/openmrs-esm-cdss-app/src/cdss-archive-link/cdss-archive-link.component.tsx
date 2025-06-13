import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

export default function CdssArchiveLink() {
  const url = window["origin"] + window["spaBase"] + "/cdss/archive";

  return <ConfigurableLink to={url}>CDSS Rule Archive</ConfigurableLink>;
}
