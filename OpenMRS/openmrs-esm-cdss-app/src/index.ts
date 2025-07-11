/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */
import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { createDashboardLink } from "@openmrs/esm-patient-common-lib";
import { dashboardMeta } from "./dashboard.meta";

import { configSchema } from "./config-schema";
import { CdssChart } from "./cdss-chart/cdss-chart.component";
import cdssReportsPageComponent, {
  CdssReportsPage,
} from "./cdss-reports-page/cdss-reports-page.component";
import CdssReportsLink from "./cdss-reports-link/cdss-reports-link.component";
import { CdssModificationPage } from "./cdss-modification-page/cdss-modification-page.component";
import { CdssArchivePage } from "./cdss-modification-page/cdss-archive-page/cdss-archive-page.component";
import CdssArchiveLink from "./cdss-archive-link/cdss-archive-link.component";
import CdssManagementLink from "./cdss-management-link/cdss-management-link.component";

const moduleName = "@openmrs/esm-cdss-app";

const options = {
  featureName: "patient-cdss",
  moduleName,
};

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * This named export tells the app shell that the default export of `root.component.tsx`
 * should be rendered when the route matches `root`. The full route
 * will be `openmrsSpaBase() + 'root'`, which is usually
 * `/openmrs/spa/root`.
 */
export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

/**
 * The following are named exports for the extensions defined in this frontend modules for cdss. See the `routes.json` file to see how these are used.
 */

export const cdssChart = getSyncLifecycle(CdssChart, options);

export const cdssDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...dashboardMeta,
    moduleName,
  }),
  options
);

export const cdssReportsLink = getSyncLifecycle(CdssReportsLink, options);
export const cdssManagementLink = getSyncLifecycle(CdssManagementLink, options);
export const cdssArchiveLink = getSyncLifecycle(CdssArchiveLink, options);

export const cdssReportsPage = getSyncLifecycle(CdssReportsPage, options);
export const cdssModificationPage = getSyncLifecycle(
  CdssModificationPage,
  options
);
export const cdssArchivePage = getSyncLifecycle(CdssArchivePage, options);
