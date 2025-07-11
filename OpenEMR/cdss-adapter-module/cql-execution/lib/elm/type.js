"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleTypeSpecifier = exports.NamedTypeSpecifier = exports.ListTypeSpecifier = exports.IntervalTypeSpecifier = exports.Is = exports.CanConvertQuantity = exports.ConvertQuantity = exports.ConvertsToTime = exports.ConvertsToString = exports.ConvertsToRatio = exports.ConvertsToQuantity = exports.ConvertsToInteger = exports.ConvertsToDecimal = exports.ConvertsToDateTime = exports.ConvertsToDate = exports.ConvertsToBoolean = exports.Convert = exports.ToTime = exports.ToString = exports.ToRatio = exports.ToQuantity = exports.ToInteger = exports.ToDecimal = exports.ToDateTime = exports.ToDate = exports.ToConcept = exports.ToBoolean = exports.As = void 0;
const expression_1 = require("./expression");
const datetime_1 = require("../datatypes/datetime");
const clinical_1 = require("../datatypes/clinical");
const quantity_1 = require("../datatypes/quantity");
const math_1 = require("../util/math");
const util_1 = require("../util/util");
const ratio_1 = require("../datatypes/ratio");
const uncertainty_1 = require("../datatypes/uncertainty");
// TODO: Casting and Conversion needs unit tests!
class As extends expression_1.Expression {
    constructor(json) {
        super(json);
        if (json.asTypeSpecifier) {
            this.asTypeSpecifier = json.asTypeSpecifier;
        }
        else if (json.asType) {
            // convert it to a NamedTypedSpecifier
            this.asTypeSpecifier = {
                name: json.asType,
                type: 'NamedTypeSpecifier'
            };
        }
        this.strict = json.strict != null ? json.strict : false;
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        // If it is null, return null
        if (arg == null) {
            return null;
        }
        if (ctx.matchesTypeSpecifier(arg, this.asTypeSpecifier)) {
            // TODO: request patient source to change type identification
            return arg;
        }
        else if (this.strict) {
            const argTypeString = specifierToString(guessSpecifierType(arg));
            const asTypeString = specifierToString(this.asTypeSpecifier);
            throw new Error(`Cannot cast ${argTypeString} as ${asTypeString}`);
        }
        else {
            return null;
        }
    }
}
exports.As = As;
class ToBoolean extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            const strArg = arg.toString().toLowerCase();
            if (['true', 't', 'yes', 'y', '1'].includes(strArg)) {
                return true;
            }
            else if (['false', 'f', 'no', 'n', '0'].includes(strArg)) {
                return false;
            }
        }
        return null;
    }
}
exports.ToBoolean = ToBoolean;
class ToConcept extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            return new clinical_1.Concept([arg], arg.display);
        }
        else {
            return null;
        }
    }
}
exports.ToConcept = ToConcept;
class ToDate extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        else if (arg.isDateTime) {
            return arg.getDate();
        }
        else {
            return datetime_1.Date.parse(arg.toString());
        }
    }
}
exports.ToDate = ToDate;
class ToDateTime extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg == null) {
            return null;
        }
        else if (arg.isDate) {
            return arg.getDateTime();
        }
        else {
            return datetime_1.DateTime.parse(arg.toString());
        }
    }
}
exports.ToDateTime = ToDateTime;
class ToDecimal extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            if (arg.isUncertainty) {
                const low = (0, math_1.limitDecimalPrecision)(parseFloat(arg.low.toString()));
                const high = (0, math_1.limitDecimalPrecision)(parseFloat(arg.high.toString()));
                return new uncertainty_1.Uncertainty(low, high);
            }
            else {
                const decimal = (0, math_1.limitDecimalPrecision)(parseFloat(arg.toString()));
                if ((0, math_1.isValidDecimal)(decimal)) {
                    return decimal;
                }
            }
        }
        return null;
    }
}
exports.ToDecimal = ToDecimal;
class ToInteger extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (typeof arg === 'string') {
            const integer = parseInt(arg);
            if ((0, math_1.isValidInteger)(integer)) {
                return integer;
            }
        }
        else if (typeof arg === 'boolean') {
            return arg ? 1 : 0;
        }
        return null;
    }
}
exports.ToInteger = ToInteger;
class ToQuantity extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return this.convertValue(await this.execArgs(ctx));
    }
    convertValue(val) {
        if (val == null) {
            return null;
        }
        else if (typeof val === 'number') {
            return new quantity_1.Quantity(val, '1');
        }
        else if (val.isRatio) {
            // numerator and denominator are guaranteed non-null
            return val.numerator.dividedBy(val.denominator);
        }
        else if (val.isUncertainty) {
            return new uncertainty_1.Uncertainty(this.convertValue(val.low), this.convertValue(val.high));
        }
        else {
            // it's a string or something else we'll try to parse as a string
            return (0, quantity_1.parseQuantity)(val.toString());
        }
    }
}
exports.ToQuantity = ToQuantity;
class ToRatio extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            // Argument will be of form '<quantity>:<quantity>'
            let denominator, numerator;
            try {
                // String will be split into an array. Numerator will be at index 1, Denominator will be at index 4
                const splitRatioString = arg
                    .toString()
                    .match(/^(\d+(\.\d+)?\s*('.+')?)\s*:\s*(\d+(\.\d+)?\s*('.+')?)$/);
                if (splitRatioString == null) {
                    return null;
                }
                numerator = (0, quantity_1.parseQuantity)(splitRatioString[1]);
                denominator = (0, quantity_1.parseQuantity)(splitRatioString[4]);
            }
            catch (error) {
                // If the input string is not formatted correctly, or cannot be
                // interpreted as a valid Quantity value, the result is null.
                return null;
            }
            // The value element of a Quantity must be present.
            if (numerator == null || denominator == null) {
                return null;
            }
            return new ratio_1.Ratio(numerator, denominator);
        }
        else {
            return null;
        }
    }
}
exports.ToRatio = ToRatio;
class ToString extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            return arg.toString();
        }
        else {
            return null;
        }
    }
}
exports.ToString = ToString;
class ToTime extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            const timeString = arg.toString();
            // Return null if string doesn't represent a valid ISO-8601 Time
            // hh:mm:ss.fff or hh:mm:ss.fff
            const matches = /^T?((\d{2})(:(\d{2})(:(\d{2})(\.(\d+))?)?)?)?(Z|(([+-])(\d{2})(:?(\d{2}))?))?$/.exec(timeString);
            if (matches == null) {
                return null;
            }
            let hours = matches[2];
            let minutes = matches[4];
            let seconds = matches[6];
            // Validate h/m/s if they exist, but allow null
            if (hours != null) {
                if (hours < 0 || hours > 23) {
                    return null;
                }
                hours = parseInt(hours, 10);
            }
            if (minutes != null) {
                if (minutes < 0 || minutes > 59) {
                    return null;
                }
                minutes = parseInt(minutes, 10);
            }
            if (seconds != null) {
                if (seconds < 0 || seconds > 59) {
                    return null;
                }
                seconds = parseInt(seconds, 10);
            }
            let milliseconds = matches[8];
            if (milliseconds != null) {
                milliseconds = parseInt((0, util_1.normalizeMillisecondsField)(milliseconds));
            }
            // Time is implemented as Datetime with year 0, month 1, day 1 and null timezoneOffset
            return new datetime_1.DateTime(0, 1, 1, hours, minutes, seconds, milliseconds, null);
        }
        else {
            return null;
        }
    }
}
exports.ToTime = ToTime;
class Convert extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
        this.toType = json.toType;
    }
    async exec(ctx) {
        switch (this.toType) {
            case '{urn:hl7-org:elm-types:r1}Boolean':
                return new ToBoolean({ type: 'ToBoolean', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}Concept':
                return new ToConcept({ type: 'ToConcept', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}Decimal':
                return new ToDecimal({ type: 'ToDecimal', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}Integer':
                return new ToInteger({ type: 'ToInteger', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}String':
                return new ToString({ type: 'ToString', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}Quantity':
                return new ToQuantity({ type: 'ToQuantity', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}DateTime':
                return new ToDateTime({ type: 'ToDateTime', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}Date':
                return new ToDate({ type: 'ToDate', operand: this.operand }).execute(ctx);
            case '{urn:hl7-org:elm-types:r1}Time':
                return new ToTime({ type: 'ToTime', operand: this.operand }).execute(ctx);
            default:
                return this.execArgs(ctx);
        }
    }
}
exports.Convert = Convert;
class ConvertsToBoolean extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToBoolean, this.operand, ctx);
        }
    }
}
exports.ConvertsToBoolean = ConvertsToBoolean;
class ConvertsToDate extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToDate, this.operand, ctx);
        }
    }
}
exports.ConvertsToDate = ConvertsToDate;
class ConvertsToDateTime extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToDateTime, this.operand, ctx);
        }
    }
}
exports.ConvertsToDateTime = ConvertsToDateTime;
class ConvertsToDecimal extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToDecimal, this.operand, ctx);
        }
    }
}
exports.ConvertsToDecimal = ConvertsToDecimal;
class ConvertsToInteger extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToInteger, this.operand, ctx);
        }
    }
}
exports.ConvertsToInteger = ConvertsToInteger;
class ConvertsToQuantity extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToQuantity, this.operand, ctx);
        }
    }
}
exports.ConvertsToQuantity = ConvertsToQuantity;
class ConvertsToRatio extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToRatio, this.operand, ctx);
        }
    }
}
exports.ConvertsToRatio = ConvertsToRatio;
class ConvertsToString extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToString, this.operand, ctx);
        }
    }
}
exports.ConvertsToString = ConvertsToString;
class ConvertsToTime extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.operand = json.operand;
    }
    async exec(ctx) {
        const operatorValue = await this.execArgs(ctx);
        if (operatorValue === null) {
            return null;
        }
        else {
            return canConvertToType(ToTime, this.operand, ctx);
        }
    }
}
exports.ConvertsToTime = ConvertsToTime;
async function canConvertToType(ConversionClass, operand, ctx) {
    try {
        const expression = new ConversionClass({ type: ConversionClass.name, operand: operand });
        const value = await expression.execute(ctx);
        if (value != null) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        return false;
    }
}
class ConvertQuantity extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [quantity, newUnit] = await this.execArgs(ctx);
        if (quantity != null && newUnit != null) {
            try {
                return quantity.convertUnit(newUnit);
            }
            catch (error) {
                // Cannot convert input to target unit, spec says to return null
                return null;
            }
        }
    }
}
exports.ConvertQuantity = ConvertQuantity;
class CanConvertQuantity extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [quantity, newUnit] = await this.execArgs(ctx);
        if (quantity != null && newUnit != null) {
            try {
                quantity.convertUnit(newUnit);
                return true;
            }
            catch (error) {
                return false;
            }
        }
        return null;
    }
}
exports.CanConvertQuantity = CanConvertQuantity;
class Is extends expression_1.Expression {
    constructor(json) {
        super(json);
        if (json.isTypeSpecifier) {
            this.isTypeSpecifier = json.isTypeSpecifier;
        }
        else if (json.isType) {
            // Convert it to a NamedTypeSpecifier
            this.isTypeSpecifier = {
                name: json.isType,
                type: 'NamedTypeSpecifier'
            };
        }
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg === null) {
            return false;
        }
        if (typeof arg._is !== 'function' && !isSystemType(this.isTypeSpecifier)) {
            // We need an _is implementation in order to check non System types
            throw new Error(`Patient Source does not support Is operation for localId: ${this.localId}`);
        }
        return ctx.matchesTypeSpecifier(arg, this.isTypeSpecifier);
    }
}
exports.Is = Is;
function isSystemType(spec) {
    switch (spec.type) {
        case 'NamedTypeSpecifier':
            return spec.name.startsWith('{urn:hl7-org:elm-types:r1}');
        case 'ListTypeSpecifier':
            return isSystemType(spec.elementType);
        case 'TupleTypeSpecifier':
            return spec.element.every((e) => isSystemType(e.elementType));
        case 'IntervalTypeSpecifier':
            return isSystemType(spec.pointType);
        case 'ChoiceTypeSpecifier':
            return spec.choice.every((c) => isSystemType(c));
        default:
            return false;
    }
}
function specifierToString(spec) {
    if (typeof spec === 'string') {
        return spec;
    }
    else if (spec == null || spec.type == null) {
        return '';
    }
    switch (spec.type) {
        case 'NamedTypeSpecifier':
            return spec.name;
        case 'ListTypeSpecifier':
            return `List<${specifierToString(spec.elementType)}>`;
        case 'TupleTypeSpecifier':
            return `Tuple<${spec.element
                .map((e) => `${e.name} ${specifierToString(e.elementType)}`)
                .join(', ')}>`;
        case 'IntervalTypeSpecifier':
            return `Interval<${specifierToString(spec.pointType)}>`;
        case 'ChoiceTypeSpecifier':
            return `Choice<${spec.choice.map((c) => specifierToString(c)).join(', ')}>`;
        default:
            return JSON.stringify(spec);
    }
}
function guessSpecifierType(val) {
    if (val == null) {
        return 'Null';
    }
    const typeHierarchy = typeof val._typeHierarchy === 'function' && val._typeHierarchy();
    if (typeHierarchy && typeHierarchy.length > 0) {
        return typeHierarchy[0];
    }
    else if (typeof val === 'boolean') {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}Boolean' };
    }
    else if (typeof val === 'number' && Math.floor(val) === val) {
        // it could still be a decimal, but we have to just take our best guess!
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}Integer' };
    }
    else if (typeof val === 'number') {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}Decimal' };
    }
    else if (typeof val === 'string') {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}String' };
    }
    else if (val.isConcept) {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}Concept' };
    }
    else if (val.isCode) {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}Code' };
    }
    else if (val.isDate) {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}Date' };
    }
    else if (val.isTime && val.isTime()) {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}Time' };
    }
    else if (val.isDateTime) {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}DateTime' };
    }
    else if (val.isQuantity) {
        return { type: 'NamedTypeSpecifier', name: '{urn:hl7-org:elm-types:r1}DateTime' };
    }
    else if (Array.isArray(val)) {
        // Get unique types from the array (by converting to string and putting in a Set)
        const typesAsStrings = Array.from(new Set(val.map(v => JSON.stringify(guessSpecifierType(v)))));
        const types = typesAsStrings.map(ts => (/^{/.test(ts) ? JSON.parse(ts) : ts));
        return {
            type: 'ListTypeSpecifier',
            elementType: types.length == 1 ? types[0] : { type: 'ChoiceTypeSpecifier', choice: types }
        };
    }
    else if (val.isInterval) {
        return {
            type: 'IntervalTypeSpecifier',
            pointType: val.pointType
        };
    }
    else if (typeof val === 'object' && Object.keys(val).length > 0) {
        return {
            type: 'TupleTypeSpecifier',
            element: Object.keys(val).map(k => ({ name: k, elementType: guessSpecifierType(val[k]) }))
        };
    }
    return 'Unknown';
}
class IntervalTypeSpecifier extends expression_1.UnimplementedExpression {
}
exports.IntervalTypeSpecifier = IntervalTypeSpecifier;
class ListTypeSpecifier extends expression_1.UnimplementedExpression {
}
exports.ListTypeSpecifier = ListTypeSpecifier;
class NamedTypeSpecifier extends expression_1.UnimplementedExpression {
}
exports.NamedTypeSpecifier = NamedTypeSpecifier;
class TupleTypeSpecifier extends expression_1.UnimplementedExpression {
}
exports.TupleTypeSpecifier = TupleTypeSpecifier;
//# sourceMappingURL=type.js.map