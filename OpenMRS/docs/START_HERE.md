# OpenMRS CDSS Adapter Guide

Explanation of directory hierarchy. 

### 📄 `START_HERE.md`

* Central hub to begin reading the documentation. Likely includes an overview of the CDSS system and links to the relevant manuals.

---

### 📁 `Installation-Technical`

* **📄 INSTALLATION.md**
  
  * Technical installation instructions for the CDSS system.
  * Likely targets system administrators or developers responsible for deployment and configuration.

---

### 📁 `Installation-User-Friendly`

* **📄 INSTALLATION.md**
  
  * Simplified version of the technical installation guide.
  * Aimed at non-technical users, possibly including clinicians or IT staff with limited technical background.

---

### 📁 `Reports-User-Manual`

* **📄 REPORTS.md**
  
  * Describes how to access and use the reporting features of the CDSS.
  * Covers workflow for generating, viewing, and interpreting clinical reports.

---

### 📁 `Rule-Management-User-Manual`

* **📄 RULE\_MANAGEMENT.md**
  
  * Comprehensive guide for managing clinical decision rules.
  * Includes instructions for uploading, archiving, restoring, and organizing rules.

---

### 📁 `Rule-Modification-Service-Installation`

* **📄 RULE\_MODIFICATION\_SERVICE\_INSTALLATION.md**
  
  * Setup guide for the rule modification service.
  * Details how to enable rule editing via configuration and global property settings.

---

### 📁 `Specifications`

* **📄 Developer-Tips.md**
  
  * Tips and best practices intended for developers.
  * May cover design decisions, coding guidelines, and setup notes for contributing to the system.

---

### 📁 `Using-CDSS-User-Manual`

* **📄 USING\_CDSS.md**
  
  * General user guide for using the CDSS functionality in the OpenMRS UI.
  * Describes how clinicians or users interact with the system during routine use.

## If starting fresh without OpenMRS and CDSS, start with either [Installation-Technical](./Installation-Technical/INSTALLATION.md) or [Installation-User-Friendly](./Installation-User-Friendly/INSTALLATION.md) depending on your comfort level.

---



> ⚠️ **WARNING: CSRF protections must be disabled for `POST` calls. Because of this, the system is NOT suitable for production use in real world scenarios!** *You can disable CSRF protections using [Disable-CSRF.sh for Linux](../utilities/Disable-CSRF.sh) or [Disable-CSRF.sh for Windows](../utilities/Disable-CSRF.ps1)* 










## Rest API documentation
Once OpenMRS is installed and CDSS is installed and running, you can access the Swagger UI API docuemntation with the following:
* [http://localhost/openmrs/cdss/docs.form](http://localhost/openmrs/cdss/docs.form) - The home for Swagger UI for th REST API.
* [http://localhost/openmrs/cdss/docs/rule-service.form](http://localhost/openmrs/cdss/docs/rule-service.form) - The Swagger UI for REST endpoints associated with rules.
* [http://localhost/openmrs/cdss/docs/cdss-service.form](http://localhost/openmrs/cdss/docs/cdss-service.form) - The Swagger UI for REST endpoints for all other actions.
