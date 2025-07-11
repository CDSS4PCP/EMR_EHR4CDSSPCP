"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryLetRef = exports.AliasRef = exports.Query = exports.SortClause = exports.ReturnClause = exports.ByColumn = exports.ByExpression = exports.ByDirection = exports.Sort = exports.Without = exports.With = exports.LetClause = exports.AliasedQuerySource = void 0;
const util_1 = require("../util/util");
const builder_1 = require("./builder");
const expression_1 = require("./expression");
const list_1 = require("./list");
class AliasedQuerySource {
    constructor(json) {
        this.alias = json.alias;
        this.expression = (0, builder_1.build)(json.expression);
    }
}
exports.AliasedQuerySource = AliasedQuerySource;
class LetClause {
    constructor(json) {
        this.identifier = json.identifier;
        this.expression = (0, builder_1.build)(json.expression);
    }
}
exports.LetClause = LetClause;
class With extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.alias = json.alias;
        this.expression = (0, builder_1.build)(json.expression);
        this.suchThat = (0, builder_1.build)(json.suchThat);
    }
    async exec(ctx) {
        let records = await this.expression.execute(ctx);
        if (!(0, util_1.typeIsArray)(records)) {
            records = [records];
        }
        const returns = [];
        for (const rec of records) {
            const childCtx = ctx.childContext();
            childCtx.set(this.alias, rec);
            returns.push(await this.suchThat.execute(childCtx));
        }
        return returns.some((x) => x);
    }
}
exports.With = With;
class Without extends With {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return !(await super.exec(ctx));
    }
}
exports.Without = Without;
// ELM-only, not a product of CQL
class Sort extends expression_1.UnimplementedExpression {
}
exports.Sort = Sort;
class ByDirection extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.direction = json.direction;
        this.low_order = this.direction === 'asc' || this.direction === 'ascending' ? -1 : 1;
        this.high_order = this.low_order * -1;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async exec(ctx, a, b) {
        if (a === b) {
            return 0;
        }
        else if (a.isQuantity && b.isQuantity) {
            if (a.before(b)) {
                return this.low_order;
            }
            else {
                return this.high_order;
            }
        }
        else if (a < b) {
            return this.low_order;
        }
        else {
            return this.high_order;
        }
    }
}
exports.ByDirection = ByDirection;
class ByExpression extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.expression = (0, builder_1.build)(json.expression);
        this.direction = json.direction;
        this.low_order = this.direction === 'asc' || this.direction === 'ascending' ? -1 : 1;
        this.high_order = this.low_order * -1;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async exec(ctx, a, b) {
        let sctx = ctx.childContext(a);
        const a_val = await this.expression.execute(sctx);
        sctx = ctx.childContext(b);
        const b_val = await this.expression.execute(sctx);
        if (a_val === b_val || (a_val == null && b_val == null)) {
            return 0;
        }
        else if (a_val == null || b_val == null) {
            return a_val == null ? this.low_order : this.high_order;
        }
        else if (a_val.isQuantity && b_val.isQuantity) {
            return a_val.before(b_val) ? this.low_order : this.high_order;
        }
        else {
            return a_val < b_val ? this.low_order : this.high_order;
        }
    }
}
exports.ByExpression = ByExpression;
class ByColumn extends ByExpression {
    constructor(json) {
        super(json);
        this.expression = (0, builder_1.build)({
            name: json.path,
            type: 'IdentifierRef'
        });
    }
}
exports.ByColumn = ByColumn;
class ReturnClause {
    constructor(json) {
        this.expression = (0, builder_1.build)(json.expression);
        this.distinct = json.distinct != null ? json.distinct : true;
    }
}
exports.ReturnClause = ReturnClause;
class SortClause {
    constructor(json) {
        this.by = (0, builder_1.build)(json != null ? json.by : undefined);
    }
    async sort(ctx, values) {
        if (this.by) {
            return (0, util_1.asyncMergeSort)(values, async (a, b) => {
                let order = 0;
                for (const item of this.by) {
                    // Do not use execute here because the value of the sort order is not important.
                    order = await item.exec(ctx, a, b);
                    if (order !== 0) {
                        break;
                    }
                }
                return order;
            });
        }
        return values;
    }
}
exports.SortClause = SortClause;
class AggregateClause extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.identifier = json.identifier;
        this.expression = (0, builder_1.build)(json.expression);
        this.starting = json.starting ? (0, builder_1.build)(json.starting) : null;
        this.distinct = json.distinct != null ? json.distinct : true;
    }
    async aggregate(returnedValues, ctx) {
        let aggregateValue = this.starting != null ? await this.starting.exec(ctx) : null;
        for (const contextValues of returnedValues) {
            const childContext = ctx.childContext(contextValues);
            childContext.set(this.identifier, aggregateValue);
            aggregateValue = await this.expression.exec(childContext);
        }
        return aggregateValue;
    }
}
class Query extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.sources = json.source.map((s) => new AliasedQuerySource(s));
        this.aliases = json.source.map((s) => s.alias);
        this.letClauses = json.let != null ? json.let.map((d) => new LetClause(d)) : [];
        this.relationship = json.relationship != null ? (0, builder_1.build)(json.relationship) : [];
        this.where = (0, builder_1.build)(json.where);
        this.returnClause = json.return != null ? new ReturnClause(json.return) : null;
        this.aggregateClause = json.aggregate != null ? new AggregateClause(json.aggregate) : null;
        this.sortClause = json.sort != null ? new SortClause(json.sort) : null;
    }
    isDistinct() {
        if (this.aggregateClause != null && this.aggregateClause.distinct != null) {
            return this.aggregateClause.distinct;
        }
        else if (this.returnClause != null && this.returnClause.distinct != null) {
            return this.returnClause.distinct;
        }
        return true;
    }
    async exec(ctx) {
        let sourceResults = await Promise.all(this.sources.map(s => s.expression.execute(ctx)));
        // If every source is null, the result is null
        // See: https://jira.hl7.org/browse/FHIR-40225
        if (sourceResults.every(r => r == null)) {
            return null;
        }
        const isList = sourceResults.some(r => Array.isArray(r));
        // For ease of processing, convert all the sources to lists and
        // convert nulls to empty lists (we already handled the ALL null case)
        sourceResults = sourceResults.map(r => {
            if (r == null) {
                return [];
            }
            else if (Array.isArray(r)) {
                return r;
            }
            else {
                return [r];
            }
        });
        // Iterate over the cartesian product of the sources.
        // See: https://cql.hl7.org/03-developersguide.html#multi-source-queries
        const cartesian = cartesianProductOf(sourceResults);
        let returnedValues = [];
        for (const combo of cartesian) {
            const rctx = ctx.childContext();
            combo.forEach((r, i) => rctx.set(this.aliases[i], r));
            for (const def of this.letClauses) {
                rctx.set(def.identifier, await def.expression.execute(rctx));
            }
            const relations = [];
            for (const rel of this.relationship) {
                const child_ctx = rctx.childContext();
                relations.push(await rel.execute(child_ctx));
            }
            const passed = (0, util_1.allTrue)(relations) && (this.where ? await this.where.execute(rctx) : true);
            if (passed) {
                if (this.returnClause != null) {
                    const val = await this.returnClause.expression.execute(rctx);
                    returnedValues.push(val);
                }
                else {
                    if (this.aliases.length === 1 && this.aggregateClause == null) {
                        returnedValues.push(rctx.get(this.aliases[0]));
                    }
                    else {
                        returnedValues.push(rctx.context_values);
                    }
                }
            }
        }
        if (this.isDistinct()) {
            returnedValues = (0, list_1.toDistinctList)(returnedValues);
        }
        if (this.aggregateClause != null) {
            returnedValues = await this.aggregateClause.aggregate(returnedValues, ctx);
        }
        if (this.sortClause != null) {
            returnedValues = await this.sortClause.sort(ctx, returnedValues);
        }
        if (isList || this.aggregateClause != null) {
            return returnedValues;
        }
        else {
            return returnedValues[0];
        }
    }
}
exports.Query = Query;
class AliasRef extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.name = json.name;
    }
    async exec(ctx) {
        return ctx != null ? ctx.get(this.name) : undefined;
    }
}
exports.AliasRef = AliasRef;
class QueryLetRef extends AliasRef {
    constructor(json) {
        super(json);
    }
}
exports.QueryLetRef = QueryLetRef;
// cartesianProductOf function based on Chris West's function:
// https://cwestblog.com/2011/05/02/cartesian-product-of-multiple-arrays/
function cartesianProductOf(sources) {
    return sources.reduce((a, b) => {
        const ret = [];
        a.forEach(a => {
            b.forEach(b => {
                ret.push(a.concat([b]));
            });
        });
        return ret;
    }, [[]]);
}
//# sourceMappingURL=query.js.map