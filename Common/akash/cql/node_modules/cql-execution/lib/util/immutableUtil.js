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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNormalizedKey = void 0;
const ucum = __importStar(require("@lhncbc/ucum-lhc"));
const immutable_1 = __importDefault(require("immutable"));
const datatypes_1 = require("../datatypes/datatypes");
const math_1 = require("./math");
const units_1 = require("./units");
const ucumUtilInstance = ucum.UcumLhcUtils.getInstance();
/**
 * Provide a unique key for an object to be used for value equality
 * A key is normalized such that representations for quantities, dates, intervals, etc. are comparable.
 */
const toNormalizedKey = (js) => {
    var _a, _b, _c, _d, _e;
    // This is necessary because of the oddities of CQL
    // It allows ignoring non-set values in tuples to be compared correctly with set as null values in tuples
    if (js === null || js === undefined) {
        return null;
    }
    // Handle the edge case of functions
    if (typeof js === 'function') {
        return immutable_1.default.Map({
            name: js.toString(),
            __instance: 'JS.Function'
        });
    }
    // Simple return non-objects
    if (typeof js !== 'object') {
        return js;
    }
    // Handle objects - normalize as necessary to generate unique keys
    switch (js.constructor) {
        case Array:
            return immutable_1.default.Seq(js)
                .map((x) => (0, exports.toNormalizedKey)(x))
                .toList();
        case datatypes_1.Code:
            return immutable_1.default.Map({
                code: (0, exports.toNormalizedKey)(js.code),
                system: (0, exports.toNormalizedKey)(js.system),
                version: (0, exports.toNormalizedKey)(js.version),
                display: (0, exports.toNormalizedKey)(js.display),
                __instance: js.constructor
            });
        case Date:
            return immutable_1.default.Map({
                epochMs: js.getTime(),
                __instance: js.constructor
            });
        case datatypes_1.DateTime:
            if (typeof js.timezoneOffset === 'number' && js.timezoneOffset !== 0) {
                return immutable_1.default.Seq(js.convertToTimezoneOffset(0))
                    .map((x) => (0, exports.toNormalizedKey)(x))
                    .toMap()
                    .set('__instance', js.constructor);
            }
            else {
                return immutable_1.default.Seq(js)
                    .map((x) => (0, exports.toNormalizedKey)(x))
                    .toMap()
                    .set('__instance', js.constructor);
            }
        case datatypes_1.Interval:
            return immutable_1.default.Seq(js.toClosed())
                .map((x) => (0, exports.toNormalizedKey)(x))
                .toMap()
                .set('__instance', js.constructor);
        case datatypes_1.Quantity:
            if (!js.unit) {
                return immutable_1.default.Map({
                    value: (_a = js.value) !== null && _a !== void 0 ? _a : null,
                    unit: null,
                    __instance: js.constructor
                });
            }
            // Get the normalized base unit
            const baseUnitKey = ucumUtilInstance.commensurablesList(js.unit)[0];
            if (!baseUnitKey) {
                // No units found - normalization not possible and use provided values
                return immutable_1.default.Map({
                    value: (_b = js.value) !== null && _b !== void 0 ? _b : null,
                    unit: (_c = js.unit) !== null && _c !== void 0 ? _c : null,
                    __instance: js.constructor
                });
            }
            else {
                // Unit was found - convert to baseUnit and normalize
                const baseUnitKeyCode = baseUnitKey[0].csCode_;
                const conversionValue = (0, units_1.convertUnit)(js.value, js.unit, baseUnitKeyCode);
                const finalValue = conversionValue ? (0, math_1.decimalAdjust)('round', conversionValue, -8) : null;
                return immutable_1.default.Map({
                    value: finalValue !== null && finalValue !== void 0 ? finalValue : null,
                    unit: baseUnitKeyCode !== null && baseUnitKeyCode !== void 0 ? baseUnitKeyCode : null,
                    __instance: js.constructor
                });
            }
        case datatypes_1.Ratio:
            return immutable_1.default.Map({
                numerator: (0, exports.toNormalizedKey)(js.numerator),
                denominator: (0, exports.toNormalizedKey)(js.denominator),
                __instance: js.constructor
            });
        case RegExp:
            return immutable_1.default.Map({
                source: (0, exports.toNormalizedKey)(js.source),
                global: (0, exports.toNormalizedKey)(js.global),
                ignoreCase: (0, exports.toNormalizedKey)(js.ignoreCase),
                multiline: (0, exports.toNormalizedKey)(js.multiline),
                __instance: js.constructor
            });
        case datatypes_1.Uncertainty:
            if (js.isPoint()) {
                return (0, exports.toNormalizedKey)(js.low);
            }
            else {
                return immutable_1.default.Seq(js)
                    .map((x) => (0, exports.toNormalizedKey)(x))
                    .toMap()
                    .set('__instance', js.constructor);
            }
        default:
            // If the object is a model object (e.g. FHIRObject) with a _typeHierarchy function,
            // then use the typeHierarchy information for the __instance value.
            // Otherwise, use the constructor for the __instance value.
            return immutable_1.default.Seq(js)
                .map((x) => (0, exports.toNormalizedKey)(x))
                .toMap()
                .set('__instance', (_e = (0, exports.toNormalizedKey)((_d = js._typeHierarchy) === null || _d === void 0 ? void 0 : _d.call(js))) !== null && _e !== void 0 ? _e : js.constructor);
    }
};
exports.toNormalizedKey = toNormalizedKey;
//# sourceMappingURL=immutableUtil.js.map