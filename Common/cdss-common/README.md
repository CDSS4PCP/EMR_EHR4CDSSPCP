# cdss-common
The common module that is used for CDS (Clinical Decision Support) for the [CDSS4PCP Project](https://cdss4pcp.com/). This Javacript module integrates with target EMRS


## index.js
Defines constants, enums, and utility functions for recording usage of rules, retrieving FHIR resources, and executing CQL rules on FHIR patients.

## Inputs
* Constants for usage status and FHIR resource types
* Endpoints object containing various endpoint configurations
* Utility functions for creating FHIR bundles, getting current timestamp, and fetching resources

## Flow
* Defines constants for usage status and FHIR resource types
* Initializes an endpoints object with various endpoint configurations
*Defines utility functions for creating FHIR bundles, getting current timestamp, and fetching resources

## Outputs
* Constants for usage status and FHIR resource types
* Endpoints object with various endpoint configurations
* Utility functions for creating FHIR bundles, getting current timestamp, and fetching resources


## Dependencies
The project dependencies listed in the JSON code snippet are as follows:

* browserify-fs: A module that provides a fs API for Browserify.
* buffer: A module that provides a global Buffer object.
* cql-exec-fhir: A module for executing CQL against FHIR resources.
* browserfy-cql-exec-vsac: A module for executing CQL with VSAC resources on the clientside. Not available in the NPM registry, but can be found on [github](https://github.com/sorliog/browserfy-cql-exec-vsac).
* cql-execution: A module for executing CQL code.
* fhir: A module for working with FHIR resources.
* lodash: A utility library that provides functions for common programming tasks.
* path-browserify: A module that provides a path API for Browserify.
* process: A global object that provides information about the current Node.js process.
* timers-browserify: A module that provides the timers module for Browserify.
* unit.js: A module for unit testing in JavaScript.
