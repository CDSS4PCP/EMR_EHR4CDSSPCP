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
exports.Predecessor = exports.Successor = exports.MaxValue = exports.MinValue = exports.Power = exports.Log = exports.Exp = exports.Ln = exports.Round = exports.Negate = exports.Abs = exports.Truncate = exports.Floor = exports.Ceiling = exports.Modulo = exports.TruncatedDivide = exports.Divide = exports.Multiply = exports.Subtract = exports.Add = void 0;
const expression_1 = require("./expression");
const MathUtil = __importStar(require("../util/math"));
const quantity_1 = require("../datatypes/quantity");
const uncertainty_1 = require("../datatypes/uncertainty");
const builder_1 = require("./builder");
class Add extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const sum = args.reduce((x, y) => {
            if (x.isUncertainty && !y.isUncertainty) {
                y = new uncertainty_1.Uncertainty(y, y);
            }
            else if (y.isUncertainty && !x.isUncertainty) {
                x = new uncertainty_1.Uncertainty(x, x);
            }
            if (x.isQuantity || x.isDateTime || x.isDate || (x.isTime && x.isTime())) {
                return (0, quantity_1.doAddition)(x, y);
            }
            else if (x.isUncertainty && y.isUncertainty) {
                if (x.low.isQuantity ||
                    x.low.isDateTime ||
                    x.low.isDate ||
                    (x.low.isTime && x.low.isTime())) {
                    return new uncertainty_1.Uncertainty((0, quantity_1.doAddition)(x.low, y.low), (0, quantity_1.doAddition)(x.high, y.high));
                }
                else {
                    return new uncertainty_1.Uncertainty(x.low + y.low, x.high + y.high);
                }
            }
            else {
                return x + y;
            }
        });
        if (MathUtil.overflowsOrUnderflows(sum)) {
            return null;
        }
        return sum;
    }
}
exports.Add = Add;
class Subtract extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const difference = args.reduce((x, y) => {
            if (x.isUncertainty && !y.isUncertainty) {
                y = new uncertainty_1.Uncertainty(y, y);
            }
            else if (y.isUncertainty && !x.isUncertainty) {
                x = new uncertainty_1.Uncertainty(x, x);
            }
            if (x.isQuantity || x.isDateTime || x.isDate) {
                return (0, quantity_1.doSubtraction)(x, y);
            }
            else if (x.isUncertainty && y.isUncertainty) {
                if (x.low.isQuantity || x.low.isDateTime || x.low.isDate) {
                    return new uncertainty_1.Uncertainty((0, quantity_1.doSubtraction)(x.low, y.high), (0, quantity_1.doSubtraction)(x.high, y.low));
                }
                else {
                    return new uncertainty_1.Uncertainty(x.low - y.high, x.high - y.low);
                }
            }
            else {
                return x - y;
            }
        });
        if (MathUtil.overflowsOrUnderflows(difference)) {
            return null;
        }
        return difference;
    }
}
exports.Subtract = Subtract;
class Multiply extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const product = args.reduce((x, y) => {
            if (x.isUncertainty && !y.isUncertainty) {
                y = new uncertainty_1.Uncertainty(y, y);
            }
            else if (y.isUncertainty && !x.isUncertainty) {
                x = new uncertainty_1.Uncertainty(x, x);
            }
            if (x.isQuantity || y.isQuantity) {
                return (0, quantity_1.doMultiplication)(x, y);
            }
            else if (x.isUncertainty && y.isUncertainty) {
                if (x.low.isQuantity) {
                    return new uncertainty_1.Uncertainty((0, quantity_1.doMultiplication)(x.low, y.low), (0, quantity_1.doMultiplication)(x.high, y.high));
                }
                else {
                    return new uncertainty_1.Uncertainty(x.low * y.low, x.high * y.high);
                }
            }
            else {
                return x * y;
            }
        });
        if (MathUtil.overflowsOrUnderflows(product)) {
            return null;
        }
        return product;
    }
}
exports.Multiply = Multiply;
class Divide extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const quotient = args.reduce((x, y) => {
            if (x.isUncertainty && !y.isUncertainty) {
                y = new uncertainty_1.Uncertainty(y, y);
            }
            else if (y.isUncertainty && !x.isUncertainty) {
                x = new uncertainty_1.Uncertainty(x, x);
            }
            if (x.isQuantity) {
                return (0, quantity_1.doDivision)(x, y);
            }
            else if (x.isUncertainty && y.isUncertainty) {
                if (x.low.isQuantity) {
                    return new uncertainty_1.Uncertainty((0, quantity_1.doDivision)(x.low, y.high), (0, quantity_1.doDivision)(x.high, y.low));
                }
                else {
                    return new uncertainty_1.Uncertainty(x.low / y.high, x.high / y.low);
                }
            }
            else {
                return x / y;
            }
        });
        // Note, anything divided by 0 is Infinity in Javascript, which will be
        // considered as overflow by this check.
        if (MathUtil.overflowsOrUnderflows(quotient)) {
            return null;
        }
        return quotient;
    }
}
exports.Divide = Divide;
class TruncatedDivide extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const quotient = args.reduce((x, y) => x / y);
        const truncatedQuotient = quotient >= 0 ? Math.floor(quotient) : Math.ceil(quotient);
        if (MathUtil.overflowsOrUnderflows(truncatedQuotient)) {
            return null;
        }
        return truncatedQuotient;
    }
}
exports.TruncatedDivide = TruncatedDivide;
class Modulo extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const modulo = args.reduce((x, y) => x % y);
        return MathUtil.decimalOrNull(modulo);
    }
}
exports.Modulo = Modulo;
class Ceiling extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        return Math.ceil(arg);
    }
}
exports.Ceiling = Ceiling;
class Floor extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        return Math.floor(arg);
    }
}
exports.Floor = Floor;
class Truncate extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        return arg >= 0 ? Math.floor(arg) : Math.ceil(arg);
    }
}
exports.Truncate = Truncate;
class Abs extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        else if (arg.isQuantity) {
            return new quantity_1.Quantity(Math.abs(arg.value), arg.unit);
        }
        else {
            return Math.abs(arg);
        }
    }
}
exports.Abs = Abs;
class Negate extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        else if (arg.isQuantity) {
            return new quantity_1.Quantity(arg.value * -1, arg.unit);
        }
        else {
            return arg * -1;
        }
    }
}
exports.Negate = Negate;
class Round extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = (0, builder_1.build)(json.precision);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        const dec = this.precision != null ? await this.precision.execute(ctx) : 0;
        return Math.round(arg * Math.pow(10, dec)) / Math.pow(10, dec);
    }
}
exports.Round = Round;
class Ln extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        const ln = Math.log(arg);
        return MathUtil.decimalOrNull(ln);
    }
}
exports.Ln = Ln;
class Exp extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        const power = Math.exp(arg);
        if (MathUtil.overflowsOrUnderflows(power)) {
            return null;
        }
        return power;
    }
}
exports.Exp = Exp;
class Log extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const log = args.reduce((x, y) => Math.log(x) / Math.log(y));
        return MathUtil.decimalOrNull(log);
    }
}
exports.Log = Log;
class Power extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args == null || args.some((x) => x == null)) {
            return null;
        }
        const power = args.reduce((x, y) => Math.pow(x, y));
        if (MathUtil.overflowsOrUnderflows(power)) {
            return null;
        }
        return power;
    }
}
exports.Power = Power;
class MinValue extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.valueType = json.valueType;
    }
    async exec(ctx) {
        if (MinValue.MIN_VALUES[this.valueType]) {
            if (this.valueType === '{urn:hl7-org:elm-types:r1}DateTime') {
                const minDateTime = MinValue.MIN_VALUES[this.valueType].copy();
                minDateTime.timezoneOffset = ctx.getTimezoneOffset();
                return minDateTime;
            }
            else {
                return MinValue.MIN_VALUES[this.valueType];
            }
        }
        else {
            throw new Error(`Minimum not supported for ${this.valueType}`);
        }
    }
}
exports.MinValue = MinValue;
MinValue.MIN_VALUES = {
    '{urn:hl7-org:elm-types:r1}Integer': MathUtil.MIN_INT_VALUE,
    '{urn:hl7-org:elm-types:r1}Decimal': MathUtil.MIN_FLOAT_VALUE,
    '{urn:hl7-org:elm-types:r1}DateTime': MathUtil.MIN_DATETIME_VALUE,
    '{urn:hl7-org:elm-types:r1}Date': MathUtil.MIN_DATE_VALUE,
    '{urn:hl7-org:elm-types:r1}Time': MathUtil.MIN_TIME_VALUE
};
class MaxValue extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.valueType = json.valueType;
    }
    async exec(ctx) {
        if (MaxValue.MAX_VALUES[this.valueType] != null) {
            if (this.valueType === '{urn:hl7-org:elm-types:r1}DateTime') {
                const maxDateTime = MaxValue.MAX_VALUES[this.valueType].copy();
                maxDateTime.timezoneOffset = ctx.getTimezoneOffset();
                return maxDateTime;
            }
            else {
                return MaxValue.MAX_VALUES[this.valueType];
            }
        }
        else {
            throw new Error(`Maximum not supported for ${this.valueType}`);
        }
    }
}
exports.MaxValue = MaxValue;
MaxValue.MAX_VALUES = {
    '{urn:hl7-org:elm-types:r1}Integer': MathUtil.MAX_INT_VALUE,
    '{urn:hl7-org:elm-types:r1}Decimal': MathUtil.MAX_FLOAT_VALUE,
    '{urn:hl7-org:elm-types:r1}DateTime': MathUtil.MAX_DATETIME_VALUE,
    '{urn:hl7-org:elm-types:r1}Date': MathUtil.MAX_DATE_VALUE,
    '{urn:hl7-org:elm-types:r1}Time': MathUtil.MAX_TIME_VALUE
};
class Successor extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        let successor = null;
        try {
            // MathUtil.successor throws on overflow, and the exception is used in
            // the logic for evaluating `meets`, so it can't be changed to just return null
            successor = MathUtil.successor(arg);
        }
        catch (e) {
            if (e instanceof MathUtil.OverFlowException) {
                return null;
            }
        }
        if (MathUtil.overflowsOrUnderflows(successor)) {
            return null;
        }
        return successor;
    }
}
exports.Successor = Successor;
class Predecessor extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        let predecessor = null;
        try {
            // MathUtil.predecessor throws on underflow, and the exception is used in
            // the logic for evaluating `meets`, so it can't be changed to just return null
            predecessor = MathUtil.predecessor(arg);
        }
        catch (e) {
            if (e instanceof MathUtil.OverFlowException) {
                return null;
            }
        }
        if (MathUtil.overflowsOrUnderflows(predecessor)) {
            return null;
        }
        return predecessor;
    }
}
exports.Predecessor = Predecessor;
//# sourceMappingURL=arithmetic.js.map