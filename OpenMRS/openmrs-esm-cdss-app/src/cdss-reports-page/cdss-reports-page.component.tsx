import React from "react";
import { InlineNotification } from "@carbon/react";
import { useConfig } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { CdssChartComponentProps } from "../cdss-chart/cdss-chart.component";
import "./../cdss.js";

export const CdssReportsPage: React.FC = () => {
  return (
    <div>
      <h1> Here are Some Reports</h1>
    </div>
  );
};

export default CdssReportsPage;
