"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreaterOrEqual = exports.Greater = exports.LessOrEqual = exports.Less = void 0;
const expression_1 = require("./expression");
const datatypes_1 = require("../datatypes/datatypes");
// Equal is completely handled by overloaded#Equal
// NotEqual is completely handled by overloaded#Equal
class Less extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = (await this.execArgs(ctx)).map((x) => datatypes_1.Uncertainty.from(x));
        if (args[0] == null || args[1] == null) {
            return null;
        }
        return args[0].lessThan(args[1]);
    }
}
exports.Less = Less;
class LessOrEqual extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = (await this.execArgs(ctx)).map((x) => datatypes_1.Uncertainty.from(x));
        if (args[0] == null || args[1] == null) {
            return null;
        }
        return args[0].lessThanOrEquals(args[1]);
    }
}
exports.LessOrEqual = LessOrEqual;
class Greater extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = (await this.execArgs(ctx)).map((x) => datatypes_1.Uncertainty.from(x));
        if (args[0] == null || args[1] == null) {
            return null;
        }
        return args[0].greaterThan(args[1]);
    }
}
exports.Greater = Greater;
class GreaterOrEqual extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = (await this.execArgs(ctx)).map((x) => datatypes_1.Uncertainty.from(x));
        if (args[0] == null || args[1] == null) {
            return null;
        }
        return args[0].greaterThanOrEquals(args[1]);
    }
}
exports.GreaterOrEqual = GreaterOrEqual;
//# sourceMappingURL=comparison.js.map