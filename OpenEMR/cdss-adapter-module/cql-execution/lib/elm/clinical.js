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
exports.CalculateAgeAt = exports.CalculateAge = exports.Concept = exports.ConceptRef = exports.ConceptDef = exports.Code = exports.CodeRef = exports.CodeDef = exports.CodeSystemDef = exports.InValueSet = exports.AnyInValueSet = exports.ValueSetRef = exports.ValueSetDef = void 0;
const expression_1 = require("./expression");
const dt = __importStar(require("../datatypes/datatypes"));
const builder_1 = require("./builder");
class ValueSetDef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.id = json.id;
        this.version = json.version;
    }
    //todo: code systems and versions
    async exec(ctx) {
        const valueset = (await ctx.codeService.findValueSet(this.id, this.version)) ||
            new dt.ValueSet(this.id, this.version);
        ctx.rootContext().set(this.name, valueset);
        return valueset;
    }
}
exports.ValueSetDef = ValueSetDef;
class ValueSetRef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.libraryName = json.libraryName;
    }
    async exec(ctx) {
        // TODO: This calls the code service every time-- should be optimized
        let valueset = ctx.getValueSet(this.name, this.libraryName);
        if (valueset instanceof expression_1.Expression) {
            valueset = await valueset.execute(ctx);
        }
        return valueset;
    }
}
exports.ValueSetRef = ValueSetRef;
class AnyInValueSet extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.codes = (0, builder_1.build)(json.codes);
        this.valueset = new ValueSetRef(json.valueset);
    }
    async exec(ctx) {
        const valueset = await this.valueset.execute(ctx);
        // If the value set reference cannot be resolved, a run-time error is thrown.
        if (valueset == null || !valueset.isValueSet) {
            throw new Error('ValueSet must be provided to InValueSet function');
        }
        const codes = await this.codes.exec(ctx);
        return codes != null && codes.some((code) => valueset.hasMatch(code));
    }
}
exports.AnyInValueSet = AnyInValueSet;
class InValueSet extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.code = (0, builder_1.build)(json.code);
        this.valueset = new ValueSetRef(json.valueset);
    }
    async exec(ctx) {
        // If the code argument is null, the result is false
        if (this.code == null) {
            return false;
        }
        if (this.valueset == null) {
            throw new Error('ValueSet must be provided to InValueSet function');
        }
        const code = await this.code.execute(ctx);
        // spec indicates to return false if code is null, throw error if value set cannot be resolved
        if (code == null) {
            return false;
        }
        const valueset = await this.valueset.execute(ctx);
        if (valueset == null || !valueset.isValueSet) {
            throw new Error('ValueSet must be provided to InValueSet function');
        }
        // If there is a code and valueset return whether or not the valueset has the code
        return valueset.hasMatch(code);
    }
}
exports.InValueSet = InValueSet;
class CodeSystemDef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.id = json.id;
        this.version = json.version;
    }
    async exec(_ctx) {
        return new dt.CodeSystem(this.id, this.version);
    }
}
exports.CodeSystemDef = CodeSystemDef;
class CodeDef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.id = json.id;
        this.systemName = json.codeSystem.name;
        this.display = json.display;
    }
    async exec(ctx) {
        const system = await ctx.getCodeSystem(this.systemName).execute(ctx);
        return new dt.Code(this.id, system.id, system.version, this.display);
    }
}
exports.CodeDef = CodeDef;
class CodeRef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.library = json.libraryName;
    }
    async exec(ctx) {
        ctx = this.library ? ctx.getLibraryContext(this.library) : ctx;
        const codeDef = ctx.getCode(this.name);
        return codeDef ? codeDef.execute(ctx) : undefined;
    }
}
exports.CodeRef = CodeRef;
class Code extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.code = json.code;
        this.systemName = json.system.name;
        this.version = json.version;
        this.display = json.display;
    }
    // Define a simple getter to allow type-checking of this class without instanceof
    // and in a way that survives minification (as opposed to checking constructor.name)
    get isCode() {
        return true;
    }
    async exec(ctx) {
        const system = ctx.getCodeSystem(this.systemName) || {};
        return new dt.Code(this.code, system.id, this.version, this.display);
    }
}
exports.Code = Code;
class ConceptDef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.display = json.display;
        this.codes = json.code;
    }
    async exec(ctx) {
        const codes = await Promise.all(this.codes.map(async (code) => {
            const codeDef = ctx.getCode(code.name);
            return codeDef ? codeDef.execute(ctx) : undefined;
        }));
        return new dt.Concept(codes, this.display);
    }
}
exports.ConceptDef = ConceptDef;
class ConceptRef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
    }
    async exec(ctx) {
        const conceptDef = ctx.getConcept(this.name);
        return conceptDef ? conceptDef.execute(ctx) : undefined;
    }
}
exports.ConceptRef = ConceptRef;
class Concept extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.codes = json.code;
        this.display = json.display;
    }
    // Define a simple getter to allow type-checking of this class without instanceof
    // and in a way that survives minification (as opposed to checking constructor.name)
    get isConcept() {
        return true;
    }
    toCode(ctx, code) {
        const system = ctx.getCodeSystem(code.system.name) || {};
        return new dt.Code(code.code, system.id, code.version, code.display);
    }
    async exec(ctx) {
        const codes = this.codes.map((code) => this.toCode(ctx, code));
        return new dt.Concept(codes, this.display);
    }
}
exports.Concept = Concept;
class CalculateAge extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const birthDate = await this.execArgs(ctx);
        // From the spec: "Note that for AgeInYears and AgeInMonths, the birthDate is specified as a
        // Date and Today() is used to obtain the current date; whereas with the other precisions,
        // birthDate is specified as a DateTime, and Now() is used to obtain the current DateTime."
        // See: https://cql.hl7.org/09-b-cqlreference.html#age
        let asOf;
        if (this.precision.toLowerCase() === dt.DateTime.Unit.YEAR ||
            this.precision.toLowerCase() === dt.DateTime.Unit.MONTH) {
            asOf = dt.DateTime.fromJSDate(ctx.getExecutionDateTime()).getDate();
        }
        else {
            asOf = dt.DateTime.fromJSDate(ctx.getExecutionDateTime());
        }
        return calculateAge(this.precision, birthDate, asOf);
    }
}
exports.CalculateAge = CalculateAge;
class CalculateAgeAt extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const [birthDate, asOf] = await this.execArgs(ctx);
        return calculateAge(this.precision, birthDate, asOf);
    }
}
exports.CalculateAgeAt = CalculateAgeAt;
/**
 * Calculates the age as of a certain date based on the passed in birth date. If the asOf date is
 * a Date, then birth date will be converted to a Date (if necessary) before calculation is
 * performed. If the asOf is a DateTime, then the birth date will be convertedto a DateTime (if
 * necessary) before calculation is performed. The result is an integer or uncertainty specifying
 * the age in the requested precision units.
 * @param precision - the precision as specified in the ELM (e.g., Year, Month, Week, etc.)
 * @param birthDate - the birth date to use for age calculations (may be Date or DateTime)
 * @param asOf - the date on which the age should be calculated (may be Date or DateTime)
 * @returns the age as an integer or uncertainty in the requested precision units
 */
function calculateAge(precision, birthDate, asOf) {
    if (birthDate != null && asOf != null) {
        // Ensure we use like types (Date or DateTime) based on asOf type
        if (asOf.isDate && birthDate.isDateTime) {
            birthDate = birthDate.getDate();
        }
        else if (asOf.isDateTime && birthDate.isDate) {
            birthDate = birthDate.getDateTime();
        }
        const result = birthDate.durationBetween(asOf, precision.toLowerCase());
        if (result === null || result === void 0 ? void 0 : result.isPoint()) {
            return result.low;
        }
        else {
            return result;
        }
    }
    return null;
}
//# sourceMappingURL=clinical.js.map