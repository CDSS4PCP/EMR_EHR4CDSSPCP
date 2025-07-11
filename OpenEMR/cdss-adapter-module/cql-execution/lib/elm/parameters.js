"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterRef = exports.ParameterDef = void 0;
const expression_1 = require("./expression");
const builder_1 = require("./builder");
class ParameterDef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.default = (0, builder_1.build)(json.default);
        this.parameterTypeSpecifier = json.parameterTypeSpecifier;
    }
    async exec(ctx) {
        // If context parameters contains the name, return value.
        if (ctx && ctx.parameters[this.name] !== undefined) {
            return ctx.parameters[this.name];
            // If the parent context contains the name, return that
        }
        else if (ctx.getParentParameter(this.name) !== undefined) {
            const parentParam = ctx.getParentParameter(this.name);
            return parentParam.default != null ? parentParam.default.execute(ctx) : parentParam;
            // If default type exists, execute the default type
        }
        else if (this.default != null) {
            await this.default.execute(ctx);
        }
    }
}
exports.ParameterDef = ParameterDef;
class ParameterRef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.library = json.libraryName;
    }
    async exec(ctx) {
        ctx = this.library ? ctx.getLibraryContext(this.library) : ctx;
        const param = ctx.getParameter(this.name);
        return param != null ? param.execute(ctx) : undefined;
    }
}
exports.ParameterRef = ParameterRef;
//# sourceMappingURL=parameters.js.map