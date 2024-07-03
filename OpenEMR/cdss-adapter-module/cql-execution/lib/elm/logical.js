"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFalse = exports.IsTrue = exports.Xor = exports.Not = exports.Or = exports.And = void 0;
const expression_1 = require("./expression");
const datatypes_1 = require("../datatypes/datatypes");
class And extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return datatypes_1.ThreeValuedLogic.and(...(await this.execArgs(ctx)));
    }
}
exports.And = And;
class Or extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return datatypes_1.ThreeValuedLogic.or(...(await this.execArgs(ctx)));
    }
}
exports.Or = Or;
class Not extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return datatypes_1.ThreeValuedLogic.not(await this.execArgs(ctx));
    }
}
exports.Not = Not;
class Xor extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return datatypes_1.ThreeValuedLogic.xor(...(await this.execArgs(ctx)));
    }
}
exports.Xor = Xor;
class IsTrue extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return true === (await this.execArgs(ctx));
    }
}
exports.IsTrue = IsTrue;
class IsFalse extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return false === (await this.execArgs(ctx));
    }
}
exports.IsFalse = IsFalse;
//# sourceMappingURL=logical.js.map