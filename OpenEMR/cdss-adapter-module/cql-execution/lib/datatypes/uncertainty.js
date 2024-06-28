"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uncertainty = void 0;
const comparison_1 = require("../util/comparison");
const logic_1 = require("./logic");
class Uncertainty {
    constructor(low = null, high) {
        this.low = low;
        this.high = high;
        const gt = (a, b) => {
            if (typeof a !== typeof b || (a === null || a === void 0 ? void 0 : a.constructor) !== (b === null || b === void 0 ? void 0 : b.constructor)) {
                // TODO: This should probably throw rather than return false.
                // Uncertainties with different types probably shouldn't be supported.
                return false;
            }
            if (typeof a.after === 'function') {
                return a.after(b);
            }
            else {
                return a > b;
            }
        };
        const isNonEnumerable = (val) => val != null && (val.isCode || val.isConcept || val.isValueSet);
        if (typeof this.high === 'undefined') {
            this.high = this.low;
        }
        if (isNonEnumerable(this.low) || isNonEnumerable(this.high)) {
            this.low = this.high = null;
        }
        if (this.low != null && this.high != null && gt(this.low, this.high)) {
            [this.low, this.high] = [this.high, this.low];
        }
    }
    static from(obj) {
        if (obj != null && obj.isUncertainty) {
            return obj;
        }
        else {
            return new Uncertainty(obj);
        }
    }
    get isUncertainty() {
        return true;
    }
    copy() {
        let newLow = this.low;
        let newHigh = this.high;
        if (typeof this.low.copy === 'function') {
            newLow = this.low.copy();
        }
        if (typeof this.high.copy === 'function') {
            newHigh = this.high.copy();
        }
        return new Uncertainty(newLow, newHigh);
    }
    isPoint() {
        var _a, _b;
        // Note: Can't use normal equality, as that fails for Javascript dates
        // TODO: Fix after we don't need to support Javascript date uncertainties anymore
        const lte = (a, b) => {
            if (typeof a !== typeof b || (a === null || a === void 0 ? void 0 : a.constructor) !== (b === null || b === void 0 ? void 0 : b.constructor)) {
                return null;
            }
            if (typeof a.sameOrBefore === 'function') {
                return a.sameOrBefore(b);
            }
            else {
                return a <= b;
            }
        };
        const gte = (a, b) => {
            if (typeof a !== typeof b || (a === null || a === void 0 ? void 0 : a.constructor) !== (b === null || b === void 0 ? void 0 : b.constructor)) {
                return null;
            }
            if (typeof a.sameOrBefore === 'function') {
                return a.sameOrAfter(b);
            }
            else {
                return a >= b;
            }
        };
        return (this.low != null &&
            this.high != null &&
            ((_a = lte(this.low, this.high)) !== null && _a !== void 0 ? _a : false) &&
            ((_b = gte(this.low, this.high)) !== null && _b !== void 0 ? _b : false));
    }
    equals(other) {
        // if this is a point, and other is not an uncertainty or a point, then we can compare directly
        if (this.isPoint()) {
            if (!(other instanceof Uncertainty)) {
                return (0, comparison_1.equals)(this.low, other);
            }
            if (other.isPoint()) {
                return (0, comparison_1.equals)(this.low, other.low);
            }
        }
        other = Uncertainty.from(other);
        return logic_1.ThreeValuedLogic.not(logic_1.ThreeValuedLogic.or(this.lessThan(other), this.greaterThan(other)));
    }
    lessThan(other) {
        const lt = (a, b) => {
            if (typeof a !== typeof b || (a === null || a === void 0 ? void 0 : a.constructor) !== (b === null || b === void 0 ? void 0 : b.constructor)) {
                return null;
            }
            if (typeof a.before === 'function') {
                return a.before(b);
            }
            else {
                return a < b;
            }
        };
        other = Uncertainty.from(other);
        const bestCase = this.low == null || other.high == null || lt(this.low, other.high);
        const worstCase = this.high != null && other.low != null && lt(this.high, other.low);
        if (bestCase === worstCase) {
            return bestCase;
        }
        else {
            return null;
        }
    }
    greaterThan(other) {
        return Uncertainty.from(other).lessThan(this);
    }
    lessThanOrEquals(other) {
        return logic_1.ThreeValuedLogic.not(this.greaterThan(Uncertainty.from(other)));
    }
    greaterThanOrEquals(other) {
        return logic_1.ThreeValuedLogic.not(this.lessThan(Uncertainty.from(other)));
    }
}
exports.Uncertainty = Uncertainty;
//# sourceMappingURL=uncertainty.js.map