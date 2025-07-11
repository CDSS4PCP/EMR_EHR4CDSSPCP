"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Precision = exports.SameOrBefore = exports.SameOrAfter = exports.SameAs = exports.Before = exports.After = exports.Length = exports.ProperIncludedIn = exports.ProperIncludes = exports.IncludedIn = exports.Includes = exports.Contains = exports.In = exports.Indexer = exports.Intersect = exports.Except = exports.Union = exports.NotEqual = exports.Equivalent = exports.Equal = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const expression_1 = require("./expression");
const logic_1 = require("../datatypes/logic");
const datetime_1 = require("../datatypes/datetime");
const util_1 = require("../util/util");
const comparison_1 = require("../util/comparison");
const DT = __importStar(require("./datetime"));
const LIST = __importStar(require("./list"));
const IVL = __importStar(require("./interval"));
class Equal extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args[0] == null || args[1] == null) {
            return null;
        }
        // @ts-ignore
        return (0, comparison_1.equals)(...args);
    }
}
exports.Equal = Equal;
class Equivalent extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [a, b] = await this.execArgs(ctx);
        if (a == null && b == null) {
            return true;
        }
        else if (a == null || b == null) {
            return false;
        }
        else {
            return (0, comparison_1.equivalent)(a, b);
        }
    }
}
exports.Equivalent = Equivalent;
class NotEqual extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args[0] == null || args[1] == null) {
            return null;
        }
        // @ts-ignore
        return logic_1.ThreeValuedLogic.not((0, comparison_1.equals)(...(await this.execArgs(ctx))));
    }
}
exports.NotEqual = NotEqual;
class Union extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [a, b] = await this.execArgs(ctx);
        if (a == null && b == null) {
            return this.listTypeArgs() ? [] : null;
        }
        if (a == null || b == null) {
            const notNull = a || b;
            if ((0, util_1.typeIsArray)(notNull)) {
                return notNull;
            }
            else {
                return null;
            }
        }
        const lib = (0, util_1.typeIsArray)(a) ? LIST : IVL;
        return lib.doUnion(a, b);
    }
    listTypeArgs() {
        var _a;
        return (_a = this.args) === null || _a === void 0 ? void 0 : _a.some((arg) => {
            return arg.asTypeSpecifier != null && arg.asTypeSpecifier.type === 'ListTypeSpecifier';
        });
    }
}
exports.Union = Union;
class Except extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [a, b] = await this.execArgs(ctx);
        if (a == null) {
            return null;
        }
        if (b == null) {
            return (0, util_1.typeIsArray)(a) ? a : null;
        }
        const lib = (0, util_1.typeIsArray)(a) ? LIST : IVL;
        return lib.doExcept(a, b);
    }
}
exports.Except = Except;
class Intersect extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [a, b] = await this.execArgs(ctx);
        if (a == null || b == null) {
            return null;
        }
        const lib = (0, util_1.typeIsArray)(a) ? LIST : IVL;
        return lib.doIntersect(a, b);
    }
}
exports.Intersect = Intersect;
class Indexer extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [operand, index] = await this.execArgs(ctx);
        if (operand == null || index == null) {
            return null;
        }
        if (index < 0 || index >= operand.length) {
            return null;
        }
        return operand[index];
    }
}
exports.Indexer = Indexer;
class In extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [item, container] = await this.execArgs(ctx);
        if (item == null) {
            return null;
        }
        if (container == null) {
            return false;
        }
        const lib = (0, util_1.typeIsArray)(container) ? LIST : IVL;
        return lib.doContains(container, item, this.precision);
    }
}
exports.In = In;
class Contains extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [container, item] = await this.execArgs(ctx);
        if (container == null) {
            return false;
        }
        if (item == null) {
            return null;
        }
        const lib = (0, util_1.typeIsArray)(container) ? LIST : IVL;
        return lib.doContains(container, item, this.precision);
    }
}
exports.Contains = Contains;
class Includes extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [container, contained] = await this.execArgs(ctx);
        if (container == null || contained == null) {
            return null;
        }
        const lib = (0, util_1.typeIsArray)(container) ? LIST : IVL;
        return lib.doIncludes(container, contained, this.precision);
    }
}
exports.Includes = Includes;
class IncludedIn extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [contained, container] = await this.execArgs(ctx);
        if (container == null || contained == null) {
            return null;
        }
        const lib = (0, util_1.typeIsArray)(container) ? LIST : IVL;
        return lib.doIncludes(container, contained, this.precision);
    }
}
exports.IncludedIn = IncludedIn;
class ProperIncludes extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [container, contained] = await this.execArgs(ctx);
        if (container == null || contained == null) {
            return null;
        }
        const lib = (0, util_1.typeIsArray)(container) ? LIST : IVL;
        return lib.doProperIncludes(container, contained, this.precision);
    }
}
exports.ProperIncludes = ProperIncludes;
class ProperIncludedIn extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [contained, container] = await this.execArgs(ctx);
        if (container == null || contained == null) {
            return null;
        }
        const lib = (0, util_1.typeIsArray)(container) ? LIST : IVL;
        return lib.doProperIncludes(container, contained, this.precision);
    }
}
exports.ProperIncludedIn = ProperIncludedIn;
class Length extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            return arg.length;
        }
        else if (this.arg.asTypeSpecifier.type === 'ListTypeSpecifier') {
            return 0;
        }
        else {
            return null;
        }
    }
}
exports.Length = Length;
class After extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [a, b] = await this.execArgs(ctx);
        if (a == null || b == null) {
            return null;
        }
        const lib = a instanceof datetime_1.DateTime ? DT : IVL;
        return lib.doAfter(a, b, this.precision);
    }
}
exports.After = After;
class Before extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision != null ? json.precision.toLowerCase() : undefined;
    }
    async exec(ctx) {
        const [a, b] = await this.execArgs(ctx);
        if (a == null || b == null) {
            return null;
        }
        const lib = a instanceof datetime_1.DateTime ? DT : IVL;
        return lib.doBefore(a, b, this.precision);
    }
}
exports.Before = Before;
class SameAs extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const [a, b] = await this.execArgs(ctx);
        if (a != null && b != null) {
            return a.sameAs(b, this.precision != null ? this.precision.toLowerCase() : undefined);
        }
        else {
            return null;
        }
    }
}
exports.SameAs = SameAs;
class SameOrAfter extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const [d1, d2] = await this.execArgs(ctx);
        if (d1 != null && d2 != null) {
            return d1.sameOrAfter(d2, this.precision != null ? this.precision.toLowerCase() : undefined);
        }
        else {
            return null;
        }
    }
}
exports.SameOrAfter = SameOrAfter;
class SameOrBefore extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const [d1, d2] = await this.execArgs(ctx);
        if (d1 != null && d2 != null) {
            return d1.sameOrBefore(d2, this.precision != null ? this.precision.toLowerCase() : undefined);
        }
        else {
            return null;
        }
    }
}
exports.SameOrBefore = SameOrBefore;
// Implemented for DateTime, Date, and Time but not for Decimal yet
class Precision extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        // Since we can't extend UnimplementedExpression directly for this overloaded function,
        // we have to copy the error to throw here if we are not using the correct type
        if (!arg.getPrecisionValue) {
            throw new Error(`Unimplemented Expression: Precision`);
        }
        return arg.getPrecisionValue();
    }
}
exports.Precision = Precision;
//# sourceMappingURL=overloaded.js.map