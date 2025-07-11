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
exports.Ratio = void 0;
const expression_1 = require("./expression");
const quantity_1 = require("../datatypes/quantity");
const DT = __importStar(require("../datatypes/datatypes"));
class Ratio extends expression_1.Expression {
    constructor(json) {
        super(json);
        if (json.numerator == null) {
            throw new Error('Cannot create a ratio with an undefined numerator value');
        }
        else {
            this.numerator = new quantity_1.Quantity(json.numerator.value, json.numerator.unit);
        }
        if (json.denominator == null) {
            throw new Error('Cannot create a ratio with an undefined denominator value');
        }
        else {
            this.denominator = new quantity_1.Quantity(json.denominator.value, json.denominator.unit);
        }
    }
    async exec(_ctx) {
        return new DT.Ratio(this.numerator, this.denominator);
    }
}
exports.Ratio = Ratio;
//# sourceMappingURL=ratio.js.map