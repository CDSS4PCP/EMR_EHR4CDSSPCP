"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retrieve = void 0;
const expression_1 = require("./expression");
const util_1 = require("../util/util");
const builder_1 = require("./builder");
class Retrieve extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.datatype = json.dataType;
        this.templateId = json.templateId;
        this.codeProperty = json.codeProperty;
        this.codes = (0, builder_1.build)(json.codes);
        this.dateProperty = json.dateProperty;
        this.dateRange = (0, builder_1.build)(json.dateRange);
    }
    async exec(ctx) {
        // Object with retrieve information to pass back to patient source
        // Always assign datatype. Assign codeProperty and dateProperty if present
        const retrieveDetails = Object.assign(Object.assign({ datatype: this.datatype }, (this.codeProperty ? { codeProperty: this.codeProperty } : {})), (this.dateProperty ? { dateProperty: this.dateProperty } : {}));
        if (this.codes) {
            const resolvedCodes = await this.codes.execute(ctx);
            if (resolvedCodes == null) {
                return [];
            }
            retrieveDetails.codes = resolvedCodes;
        }
        if (this.dateRange) {
            retrieveDetails.dateRange = await this.dateRange.execute(ctx);
        }
        if (this.templateId) {
            retrieveDetails.templateId = this.templateId;
        }
        let records = await ctx.findRecords(this.templateId != null ? this.templateId : this.datatype, retrieveDetails);
        if (retrieveDetails.codes) {
            records = records.filter((r) => this.recordMatchesCodesOrVS(r, retrieveDetails.codes));
        }
        if (retrieveDetails.dateRange && this.dateProperty) {
            records = records.filter((r) => { var _a; return (_a = retrieveDetails.dateRange) === null || _a === void 0 ? void 0 : _a.includes(r.getDateOrInterval(this.dateProperty)); });
        }
        if (Array.isArray(records)) {
            ctx.evaluatedRecords.push(...records);
        }
        else {
            ctx.evaluatedRecords.push(records);
        }
        return records;
    }
    recordMatchesCodesOrVS(record, codes) {
        if ((0, util_1.typeIsArray)(codes)) {
            return codes.some(c => c.hasMatch(record.getCode(this.codeProperty)));
        }
        else {
            return codes.hasMatch(record.getCode(this.codeProperty));
        }
    }
}
exports.Retrieve = Retrieve;
//# sourceMappingURL=external.js.map