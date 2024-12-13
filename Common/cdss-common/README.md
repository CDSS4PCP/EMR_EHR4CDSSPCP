# cdss-common

The common module that is used for CDS (Clinical Decision Support) for the [CDSS4PCP Project](https://cdss4pcp.com/).
This Javacript module integrates with target EMRS

## cdss-module.js

Defines constants, enums, and utility functions for recording usage of rules, retrieving FHIR resources, and executing
CQL rules on FHIR patients. Utilizes Node.JS.

## index.js

Defines clientside functionality for CDSS including the endpoints map

## Dependencies

The project dependencies listed in the JSON code snippet are as follows:

* browserify-fs: A module that provides a fs API for Browserify.
* buffer: A module that provides a global Buffer object.
* cql-exec-fhir: A module for executing CQL against FHIR resources.
* browserfy-cql-exec-vsac: A module for executing CQL with VSAC resources on the clientside. Not available in the NPM
  registry, but can be found on [github](https://github.com/sorliog/browserfy-cql-exec-vsac).
* cql-execution: A module for executing CQL code.
* fhir: A module for working with FHIR resources.
* lodash: A utility library that provides functions for common programming tasks.
* path-browserify: A module that provides a path API for clientside.
* process: A global object that provides information about the current Node.js process.
* timers-browserify: A module that provides the timers module for Browserify.
* unit.js: A module for unit testing in JavaScript.

## Testing and Compiling

The workflow for compiling  `cdss-common` is as follows:

1. Lint to fix style issues
2. Test `cdss-module.js` using Jest
3. Compile the project into a single Javascript file with `webpack`
4. Test the compiled file using Unit.js

`package.json` contains scripts to do this workflow automatically. Simply run `npm run all` to execute the entire
workflow.

## Webpack configuration

`cdss-common` uses webpack for compiling into a single Javascript file. This Javascript file needs to run on thh
clientside, so webpack is also responsible for making `cdss-common` work in the clientside. Webpack needs to be properly
configured to do this, the configuration is in `webpack.config.js`.
