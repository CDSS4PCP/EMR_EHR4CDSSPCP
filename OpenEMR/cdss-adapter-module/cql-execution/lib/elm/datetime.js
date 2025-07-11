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
exports.DurationBetween = exports.DifferenceBetween = exports.doBefore = exports.doAfter = exports.TimezoneOffsetFrom = exports.TimeFrom = exports.DateFrom = exports.DateTimeComponentFrom = exports.TimeOfDay = exports.Now = exports.Today = exports.Time = exports.Date = exports.DateTime = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const expression_1 = require("./expression");
const builder_1 = require("./builder");
const literal_1 = require("./literal");
const DT = __importStar(require("../datatypes/datatypes"));
class DateTime extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.json = json;
    }
    async exec(ctx) {
        for (const property of DateTime.PROPERTIES) {
            // if json does not contain 'timezoneOffset' set it to the executionDateTime from the context
            if (this.json[property] != null) {
                // @ts-ignore
                this[property] = (0, builder_1.build)(this.json[property]);
            }
            else if (property === 'timezoneOffset' && ctx.getTimezoneOffset() != null) {
                // @ts-ignore
                this[property] = literal_1.Literal.from({
                    type: 'Literal',
                    value: ctx.getTimezoneOffset(),
                    valueType: '{urn:hl7-org:elm-types:r1}Integer'
                });
            }
        }
        const args = await Promise.all(
        // @ts-ignore
        DateTime.PROPERTIES.map(async (p) => (this[p] != null ? this[p].execute(ctx) : undefined)));
        return new DT.DateTime(...args);
    }
}
exports.DateTime = DateTime;
DateTime.PROPERTIES = [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'millisecond',
    'timezoneOffset'
];
class Date extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.json = json;
    }
    async exec(ctx) {
        for (const property of Date.PROPERTIES) {
            if (this.json[property] != null) {
                // @ts-ignore
                this[property] = (0, builder_1.build)(this.json[property]);
            }
        }
        const args = await Promise.all(
        // @ts-ignore
        Date.PROPERTIES.map(async (p) => (this[p] != null ? this[p].execute(ctx) : undefined)));
        return new DT.Date(...args);
    }
}
exports.Date = Date;
Date.PROPERTIES = ['year', 'month', 'day'];
class Time extends expression_1.Expression {
    constructor(json) {
        super(json);
        for (const property of Time.PROPERTIES) {
            if (json[property] != null) {
                // @ts-ignore
                this[property] = (0, builder_1.build)(json[property]);
            }
        }
    }
    async exec(ctx) {
        const args = await Promise.all(
        // @ts-ignore
        Time.PROPERTIES.map(async (p) => (this[p] != null ? this[p].execute(ctx) : undefined)));
        return new DT.DateTime(0, 1, 1, ...args).getTime();
    }
}
exports.Time = Time;
Time.PROPERTIES = ['hour', 'minute', 'second', 'millisecond'];
class Today extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return ctx.getExecutionDateTime().getDate();
    }
}
exports.Today = Today;
class Now extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return ctx.getExecutionDateTime();
    }
}
exports.Now = Now;
class TimeOfDay extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        return ctx.getExecutionDateTime().getTime();
    }
}
exports.TimeOfDay = TimeOfDay;
class DateTimeComponentFrom extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            return arg[this.precision.toLowerCase()];
        }
        else {
            return null;
        }
    }
}
exports.DateTimeComponentFrom = DateTimeComponentFrom;
class DateFrom extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const date = await this.execArgs(ctx);
        if (date != null) {
            return date.getDate();
        }
        else {
            return null;
        }
    }
}
exports.DateFrom = DateFrom;
class TimeFrom extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const date = await this.execArgs(ctx);
        if (date != null) {
            return date.getTime();
        }
        else {
            return null;
        }
    }
}
exports.TimeFrom = TimeFrom;
class TimezoneOffsetFrom extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const date = await this.execArgs(ctx);
        if (date != null) {
            return date.timezoneOffset;
        }
        else {
            return null;
        }
    }
}
exports.TimezoneOffsetFrom = TimezoneOffsetFrom;
// Delegated to by overloaded#After
function doAfter(a, b, precision) {
    return a.after(b, precision);
}
exports.doAfter = doAfter;
// Delegated to by overloaded#Before
function doBefore(a, b, precision) {
    return a.before(b, precision);
}
exports.doBefore = doBefore;
class DifferenceBetween extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        // Check to make sure args exist and that they have differenceBetween functions so that they can be compared to one another
        if (args[0] == null ||
            args[1] == null ||
            typeof args[0].differenceBetween !== 'function' ||
            typeof args[1].differenceBetween !== 'function') {
            return null;
        }
        const result = args[0].differenceBetween(args[1], this.precision != null ? this.precision.toLowerCase() : undefined);
        if (result != null && result.isPoint()) {
            return result.low;
        }
        else {
            return result;
        }
    }
}
exports.DifferenceBetween = DifferenceBetween;
class DurationBetween extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.precision = json.precision;
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        // Check to make sure args exist and that they have durationBetween functions so that they can be compared to one another
        if (args[0] == null ||
            args[1] == null ||
            typeof args[0].durationBetween !== 'function' ||
            typeof args[1].durationBetween !== 'function') {
            return null;
        }
        const result = args[0].durationBetween(args[1], this.precision != null ? this.precision.toLowerCase() : undefined);
        if (result != null && result.isPoint()) {
            return result.low;
        }
        else {
            return result;
        }
    }
}
exports.DurationBetween = DurationBetween;
//# sourceMappingURL=datetime.js.map