"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleElementDefinition = exports.TupleElement = exports.Tuple = exports.Property = void 0;
const expression_1 = require("./expression");
const builder_1 = require("./builder");
class Property extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.scope = json.scope;
        this.source = (0, builder_1.build)(json.source);
        this.path = json.path;
    }
    async exec(ctx) {
        let obj = this.scope != null ? ctx.get(this.scope) : this.source;
        if (obj instanceof expression_1.Expression) {
            obj = await obj.execute(ctx);
        }
        let val = getPropertyFromObject(obj, this.path);
        if (val == null) {
            const parts = this.path.split('.');
            let curr_obj = obj;
            for (const part of parts) {
                const _obj = getPropertyFromObject(curr_obj, part);
                curr_obj = _obj instanceof Function ? _obj.call(curr_obj) : _obj;
            }
            val = curr_obj != null ? curr_obj : null; // convert undefined to null
        }
        if (val instanceof Function) {
            return val.call(obj);
        }
        else {
            return val;
        }
    }
}
exports.Property = Property;
function getPropertyFromObject(obj, path) {
    let val;
    if (obj != null) {
        val = obj[path];
        if (val === undefined && typeof obj.get === 'function') {
            val = obj.get(path);
        }
    }
    return val;
}
class Tuple extends expression_1.Expression {
    constructor(json) {
        super(json);
        const elements = json.element != null ? json.element : [];
        this.elements = elements.map((el) => {
            return {
                name: el.name,
                value: (0, builder_1.build)(el.value)
            };
        });
    }
    get isTuple() {
        return true;
    }
    async exec(ctx) {
        const val = {};
        for (const el of this.elements) {
            val[el.name] = el.value != null ? await el.value.execute(ctx) : undefined;
        }
        return val;
    }
}
exports.Tuple = Tuple;
class TupleElement extends expression_1.UnimplementedExpression {
}
exports.TupleElement = TupleElement;
class TupleElementDefinition extends expression_1.UnimplementedExpression {
}
exports.TupleElementDefinition = TupleElementDefinition;
//# sourceMappingURL=structured.js.map