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
exports.Quantity = void 0;
const expression_1 = require("./expression");
const DT = __importStar(require("../datatypes/datatypes"));
// Unit conversation is currently implemented on for time duration comparison operations
// TODO: Implement unit conversation for time duration mathematical operations
class Quantity extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.value = parseFloat(json.value);
        this.unit = json.unit;
    }
    async exec(_ctx) {
        return new DT.Quantity(this.value, this.unit);
    }
}
exports.Quantity = Quantity;
//# sourceMappingURL=quantity.js.map