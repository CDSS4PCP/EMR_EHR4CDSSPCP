"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnimplementedExpression = exports.Expression = void 0;
const util_1 = require("../util/util");
const customErrors_1 = require("../util/customErrors");
const builder_1 = require("./builder");
class Expression {
    constructor(json) {
        if (json.operand != null) {
            const op = (0, builder_1.build)(json.operand);
            if ((0, util_1.typeIsArray)(json.operand)) {
                this.args = op;
            }
            else {
                this.arg = op;
            }
        }
        if (json.localId != null) {
            this.localId = json.localId;
        }
        if (json.locator != null) {
            this.locator = json.locator;
        }
    }
    async execute(ctx) {
        try {
            if (this.localId != null) {
                // Store the localId and result on the root context of this library
                const execValue = await this.exec(ctx);
                ctx.rootContext().setLocalIdWithResult(this.localId, execValue);
                return execValue;
            }
            else {
                // Ensure we await this.exec before returning so AnnotatedError logic gets hit
                const execValue = await this.exec(ctx);
                return execValue;
            }
        }
        catch (e) {
            if (e instanceof customErrors_1.AnnotatedError) {
                throw e;
            }
            const libraryIdentifier = this.getRecursiveLibraryIdentifier(ctx);
            throw new customErrors_1.AnnotatedError(e, this.constructor.name, libraryIdentifier, this.localId, this.locator);
        }
    }
    async exec(_ctx) {
        return this;
    }
    async execArgs(ctx) {
        if (this.args != null) {
            return Promise.all(this.args.map(async (arg) => arg.execute(ctx)));
        }
        else if (this.arg != null) {
            return this.arg.execute(ctx);
        }
        else {
            return null;
        }
    }
    /**
     * Function used in error reporting during execution. Retrieves the source library from
     * the context if it exists, or recursively traverses the context's parents until a source
     * library identifier and version are found.
     */
    getRecursiveLibraryIdentifier(ctx) {
        var _a, _b, _c;
        const identifier = (_c = (_b = (_a = ctx.library) === null || _a === void 0 ? void 0 : _a.source) === null || _b === void 0 ? void 0 : _b.library) === null || _c === void 0 ? void 0 : _c.identifier;
        if (identifier) {
            return `${identifier.id}${identifier.version ? `|${identifier.version}` : ''}`;
        }
        else {
            return ctx.parent ? this.getRecursiveLibraryIdentifier(ctx.parent) : '(unknown)';
        }
    }
}
exports.Expression = Expression;
class UnimplementedExpression extends Expression {
    constructor(json) {
        super(json);
        this.json = json;
    }
    async exec(_ctx) {
        throw new Error(`Unimplemented Expression: ${this.json.type}`);
    }
}
exports.UnimplementedExpression = UnimplementedExpression;
//# sourceMappingURL=expression.js.map