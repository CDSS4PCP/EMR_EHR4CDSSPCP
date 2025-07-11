"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = exports.CaseItem = exports.If = void 0;
const expression_1 = require("./expression");
const builder_1 = require("./builder");
const comparison_1 = require("../util/comparison");
// TODO: Spec lists "Conditional", but it's "If" in the XSD
class If extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.condition = (0, builder_1.build)(json.condition);
        this.th = (0, builder_1.build)(json.then);
        this.els = (0, builder_1.build)(json.else);
    }
    async exec(ctx) {
        if (await this.condition.execute(ctx)) {
            return this.th.execute(ctx);
        }
        else {
            return this.els.execute(ctx);
        }
    }
}
exports.If = If;
class CaseItem {
    constructor(json) {
        this.when = (0, builder_1.build)(json.when);
        this.then = (0, builder_1.build)(json.then);
    }
}
exports.CaseItem = CaseItem;
class Case extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.comparand = (0, builder_1.build)(json.comparand);
        this.caseItems = json.caseItem.map((ci) => new CaseItem(ci));
        this.els = (0, builder_1.build)(json.else);
    }
    async exec(ctx) {
        if (this.comparand) {
            return this.exec_selected(ctx);
        }
        else {
            return this.exec_standard(ctx);
        }
    }
    async exec_selected(ctx) {
        const val = await this.comparand.execute(ctx);
        for (const ci of this.caseItems) {
            if ((0, comparison_1.equals)(await ci.when.execute(ctx), val)) {
                return ci.then.execute(ctx);
            }
        }
        return this.els.execute(ctx);
    }
    async exec_standard(ctx) {
        for (const ci of this.caseItems) {
            if (await ci.when.execute(ctx)) {
                return ci.then.execute(ctx);
            }
        }
        return this.els.execute(ctx);
    }
}
exports.Case = Case;
//# sourceMappingURL=conditional.js.map