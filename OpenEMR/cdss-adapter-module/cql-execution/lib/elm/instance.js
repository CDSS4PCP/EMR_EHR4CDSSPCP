"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
const expression_1 = require("./expression");
const quantity_1 = require("../datatypes/quantity");
const datatypes_1 = require("../datatypes/datatypes");
const builder_1 = require("./builder");
class Element {
    constructor(json) {
        this.name = json.name;
        this.value = (0, builder_1.build)(json.value);
    }
    async exec(ctx) {
        return this.value != null ? this.value.execute(ctx) : undefined;
    }
}
class Instance extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.classType = json.classType;
        this.element = json.element.map((child) => new Element(child));
    }
    async exec(ctx) {
        const obj = {};
        for (const el of this.element) {
            obj[el.name] = await el.exec(ctx);
        }
        switch (this.classType) {
            case '{urn:hl7-org:elm-types:r1}Quantity':
                return new quantity_1.Quantity(obj.value, obj.unit);
            case '{urn:hl7-org:elm-types:r1}Code':
                return new datatypes_1.Code(obj.code, obj.system, obj.version, obj.display);
            case '{urn:hl7-org:elm-types:r1}Concept':
                return new datatypes_1.Concept(obj.codes, obj.display);
            default:
                return obj;
        }
    }
}
exports.Instance = Instance;
//# sourceMappingURL=instance.js.map