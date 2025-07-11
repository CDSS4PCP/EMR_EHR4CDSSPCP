"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coalesce = exports.IsNull = exports.Null = void 0;
const expression_1 = require("./expression");
class Null extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(_ctx) {
        return null;
    }
}
exports.Null = Null;
class IsNull extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return (await this.execArgs(ctx)) == null;
    }
}
exports.IsNull = IsNull;
class Coalesce extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        if (this.args) {
            for (const arg of this.args) {
                const result = await arg.execute(ctx);
                // if a single arg that's a list, coalesce over the list
                if (this.args.length === 1 && Array.isArray(result)) {
                    const item = result.find(item => item != null);
                    if (item != null) {
                        return item;
                    }
                }
                else {
                    if (result != null) {
                        return result;
                    }
                }
            }
        }
        return null;
    }
}
exports.Coalesce = Coalesce;
//# sourceMappingURL=nullological.js.map