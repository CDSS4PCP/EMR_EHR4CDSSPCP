"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
const messageListeners_1 = require("./messageListeners");
const results_1 = require("./results");
const context_1 = require("./context");
class Executor {
    constructor(library, codeService, parameters, messageListener = new messageListeners_1.NullMessageListener()) {
        this.library = library;
        this.codeService = codeService;
        this.parameters = parameters;
        this.messageListener = messageListener;
    }
    withLibrary(lib) {
        this.library = lib;
        return this;
    }
    withParameters(params) {
        this.parameters = params != null ? params : {};
        return this;
    }
    withCodeService(cs) {
        this.codeService = cs;
        return this;
    }
    withMessageListener(ml) {
        this.messageListener = ml;
        return this;
    }
    async exec_expression(expression, patientSource, executionDateTime) {
        const r = new results_1.Results();
        const expr = this.library.expressions[expression];
        if (expr != null) {
            // NOTE: Using await to support async data providers whose implementations return promise
            // await has no effect on functions that don't return promises, so it is safe to use in all cases
            let currentPatient = await patientSource.currentPatient();
            while (currentPatient) {
                const patient_ctx = new context_1.PatientContext(this.library, currentPatient, this.codeService, this.parameters, executionDateTime, this.messageListener);
                r.recordPatientResults(patient_ctx, { [expression]: expr.execute(patient_ctx) });
                currentPatient = await patientSource.nextPatient();
            }
        }
        return r;
    }
    async exec(patientSource, executionDateTime) {
        const r = await this.exec_patient_context(patientSource, executionDateTime);
        const unfilteredContext = new context_1.UnfilteredContext(this.library, r, this.codeService, this.parameters, executionDateTime, this.messageListener);
        const resultMap = {};
        for (const key in this.library.expressions) {
            const expr = this.library.expressions[key];
            if (expr.context === 'Unfiltered') {
                resultMap[key] = await expr.exec(unfilteredContext);
            }
        }
        r.recordUnfilteredResults(resultMap);
        return r;
    }
    async exec_patient_context(patientSource, executionDateTime) {
        const r = new results_1.Results();
        // NOTE: Using await to support async data providers whose implementations return promise
        // await has no effect on functions that don't return promises, so it is safe to use in all cases
        let currentPatient = await patientSource.currentPatient();
        while (currentPatient) {
            const patient_ctx = new context_1.PatientContext(this.library, currentPatient, this.codeService, this.parameters, executionDateTime, this.messageListener);
            const resultMap = {};
            for (const key in this.library.expressions) {
                const expr = this.library.expressions[key];
                if (expr.context === 'Patient') {
                    resultMap[key] = await expr.execute(patient_ctx);
                }
            }
            r.recordPatientResults(patient_ctx, resultMap);
            currentPatient = await patientSource.nextPatient();
        }
        return r;
    }
}
exports.Executor = Executor;
//# sourceMappingURL=executor.js.map