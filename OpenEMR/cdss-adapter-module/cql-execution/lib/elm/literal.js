"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringLiteral = exports.DecimalLiteral = exports.IntegerLiteral = exports.BooleanLiteral = exports.Literal = void 0;
const expression_1 = require("./expression");
class Literal extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.valueType = json.valueType;
        this.value = json.value;
    }
    static from(json) {
        switch (json.valueType) {
            case '{urn:hl7-org:elm-types:r1}Boolean':
                return new BooleanLiteral(json);
            case '{urn:hl7-org:elm-types:r1}Integer':
                return new IntegerLiteral(json);
            case '{urn:hl7-org:elm-types:r1}Decimal':
                return new DecimalLiteral(json);
            case '{urn:hl7-org:elm-types:r1}String':
                return new StringLiteral(json);
            default:
                return new Literal(json);
        }
    }
    async exec(_ctx) {
        return this.value;
    }
}
exports.Literal = Literal;
// The following are not defined in ELM, but helpful for execution
class BooleanLiteral extends Literal {
    constructor(json) {
        super(json);
        this.value = this.value === 'true';
    }
    // Define a simple getter to allow type-checking of this class without instanceof
    // and in a way that survives minification (as opposed to checking constructor.name)
    get isBooleanLiteral() {
        return true;
    }
    async exec(_ctx) {
        return this.value;
    }
}
exports.BooleanLiteral = BooleanLiteral;
class IntegerLiteral extends Literal {
    constructor(json) {
        super(json);
        this.value = parseInt(this.value, 10);
    }
    // Define a simple getter to allow type-checking of this class without instanceof
    // and in a way that survives minification (as opposed to checking constructor.name)
    get isIntegerLiteral() {
        return true;
    }
    async exec(_ctx) {
        return this.value;
    }
}
exports.IntegerLiteral = IntegerLiteral;
class DecimalLiteral extends Literal {
    constructor(json) {
        super(json);
        this.value = parseFloat(this.value);
    }
    // Define a simple getter to allow type-checking of this class without instanceof
    // and in a way that survives minification (as opposed to checking constructor.name)
    get isDecimalLiteral() {
        return true;
    }
    async exec(_ctx) {
        return this.value;
    }
}
exports.DecimalLiteral = DecimalLiteral;
class StringLiteral extends Literal {
    constructor(json) {
        super(json);
    }
    // Define a simple getter to allow type-checking of this class without instanceof
    // and in a way that survives minification (as opposed to checking constructor.name)
    get isStringLiteral() {
        return true;
    }
    async exec(_ctx) {
        // TODO: Remove these replacements when CQL-to-ELM fixes bug: https://github.com/cqframework/clinical_quality_language/issues/82
        return this.value.replace(/\\'/g, "'").replace(/\\"/g, '"');
    }
}
exports.StringLiteral = StringLiteral;
//# sourceMappingURL=literal.js.map