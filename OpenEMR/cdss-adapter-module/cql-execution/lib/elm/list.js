"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slice = exports.Last = exports.First = exports.Current = exports.toDistinctList = exports.Distinct = exports.Flatten = exports.ForEach = exports.doProperIncludes = exports.doIncludes = exports.doContains = exports.IndexOf = exports.ToList = exports.SingletonFrom = exports.Filter = exports.Times = exports.doIntersect = exports.doExcept = exports.doUnion = exports.Exists = exports.List = void 0;
const immutable_1 = __importDefault(require("immutable"));
const comparison_1 = require("../util/comparison");
const immutableUtil_1 = require("../util/immutableUtil");
const util_1 = require("../util/util");
const builder_1 = require("./builder");
const expression_1 = require("./expression");
class List extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.elements = (0, builder_1.build)(json.element) || [];
    }
    get isList() {
        return true;
    }
    async exec(ctx) {
        return await Promise.all(this.elements.map(item => item.execute(ctx)));
    }
}
exports.List = List;
class Exists extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const list = await this.execArgs(ctx);
        // if list exists and has non empty length we need to make sure it isnt just full of nulls
        if (list) {
            return list.some((item) => item != null);
        }
        return false;
    }
}
exports.Exists = Exists;
// Equal is completely handled by overloaded#Equal
// NotEqual is completely handled by overloaded#Equal
// Delegated to by overloaded#Union
function doUnion(a, b) {
    const distinct = (0, exports.toDistinctList)(a.concat(b));
    return removeDuplicateNulls(distinct);
}
exports.doUnion = doUnion;
// Delegated to by overloaded#Except
function doExcept(a, b) {
    const distinct = (0, exports.toDistinctList)(a);
    const setList = removeDuplicateNulls(distinct);
    return setList.filter(item => !doContains(b, item, true));
}
exports.doExcept = doExcept;
// Delegated to by overloaded#Intersect
function doIntersect(a, b) {
    const distinct = (0, exports.toDistinctList)(a);
    const setList = removeDuplicateNulls(distinct);
    return setList.filter(item => doContains(b, item, true));
}
exports.doIntersect = doIntersect;
// ELM-only, not a product of CQL
class Times extends expression_1.UnimplementedExpression {
}
exports.Times = Times;
// ELM-only, not a product of CQL
class Filter extends expression_1.UnimplementedExpression {
}
exports.Filter = Filter;
class SingletonFrom extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null && arg.length > 1) {
            throw new Error("IllegalArgument: 'SingletonFrom' requires a 0 or 1 arg array");
        }
        else if (arg != null && arg.length === 1) {
            return arg[0];
        }
        else {
            return null;
        }
    }
}
exports.SingletonFrom = SingletonFrom;
class ToList extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            return [arg];
        }
        else {
            return [];
        }
    }
}
exports.ToList = ToList;
class IndexOf extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.source = (0, builder_1.build)(json.source);
        this.element = (0, builder_1.build)(json.element);
    }
    async exec(ctx) {
        let index;
        const src = await this.source.execute(ctx);
        const el = await this.element.execute(ctx);
        if (src == null || el == null) {
            return null;
        }
        for (let i = 0; i < src.length; i++) {
            const itm = src[i];
            if ((0, comparison_1.equals)(itm, el)) {
                index = i;
                break;
            }
        }
        if (index != null) {
            return index;
        }
        else {
            return -1;
        }
    }
}
exports.IndexOf = IndexOf;
// Indexer is completely handled by overloaded#Indexer
// Delegated to by overloaded#Contains and overloaded#In
function doContains(container, item, nullEquivalence = false) {
    return container.some((element) => (0, comparison_1.equals)(element, item) || (nullEquivalence && element == null && item == null));
}
exports.doContains = doContains;
// Delegated to by overloaded#Includes and overloaded@IncludedIn
function doIncludes(list, sublist) {
    return sublist.every((x) => doContains(list, x));
}
exports.doIncludes = doIncludes;
// Delegated to by overloaded#ProperIncludes and overloaded@ProperIncludedIn
function doProperIncludes(list, sublist) {
    return list.length > sublist.length && doIncludes(list, sublist);
}
exports.doProperIncludes = doProperIncludes;
// ELM-only, not a product of CQL
class ForEach extends expression_1.UnimplementedExpression {
}
exports.ForEach = ForEach;
class Flatten extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if ((0, util_1.typeIsArray)(arg) && arg.every(x => (0, util_1.typeIsArray)(x))) {
            return arg.reduce((x, y) => x.concat(y), []);
        }
        else {
            return arg;
        }
    }
}
exports.Flatten = Flatten;
class Distinct extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const result = await this.execArgs(ctx);
        if (result == null) {
            return null;
        }
        return (0, exports.toDistinctList)(result);
    }
}
exports.Distinct = Distinct;
const toDistinctList = (list) => {
    const list_keys = list.map(immutableUtil_1.toNormalizedKey);
    const set = immutable_1.default.Set().asMutable();
    const distinct = [];
    set.withMutations(y => {
        list_keys.forEach((key, i) => {
            // Check set size
            const setSize = y.count();
            // Attempt to insert
            y.add(key);
            // If inserted, then size will increase; push to distinct
            if (y.count() > setSize) {
                distinct.push(list[i]);
            }
        });
    });
    return distinct;
};
exports.toDistinctList = toDistinctList;
function removeDuplicateNulls(list) {
    // Remove duplicate null elements
    let firstNullFound = false;
    const setList = [];
    for (const item of list) {
        if (item !== null) {
            setList.push(item);
        }
        else if (item === null && !firstNullFound) {
            setList.push(item);
            firstNullFound = true;
        }
    }
    return setList;
}
// ELM-only, not a product of CQL
class Current extends expression_1.UnimplementedExpression {
}
exports.Current = Current;
class First extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.source = (0, builder_1.build)(json.source);
    }
    async exec(ctx) {
        const src = await this.source.exec(ctx);
        if (src != null && (0, util_1.typeIsArray)(src) && src.length > 0) {
            return src[0];
        }
        else {
            return null;
        }
    }
}
exports.First = First;
class Last extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.source = (0, builder_1.build)(json.source);
    }
    async exec(ctx) {
        const src = await this.source.exec(ctx);
        if (src != null && (0, util_1.typeIsArray)(src) && src.length > 0) {
            return src[src.length - 1];
        }
        else {
            return null;
        }
    }
}
exports.Last = Last;
class Slice extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.source = (0, builder_1.build)(json.source);
        this.startIndex = (0, builder_1.build)(json.startIndex);
        this.endIndex = (0, builder_1.build)(json.endIndex);
    }
    async exec(ctx) {
        const src = await this.source.exec(ctx);
        if (src != null && (0, util_1.typeIsArray)(src)) {
            const startIndex = await this.startIndex.exec(ctx);
            const endIndex = await this.endIndex.exec(ctx);
            const start = startIndex != null ? startIndex : 0;
            const end = endIndex != null ? endIndex : src.length;
            if (src.length === 0 || start < 0 || end < 0 || end < start) {
                return [];
            }
            return src.slice(start, end);
        }
        return null;
    }
}
exports.Slice = Slice;
// Length is completely handled by overloaded#Length
//# sourceMappingURL=list.js.map