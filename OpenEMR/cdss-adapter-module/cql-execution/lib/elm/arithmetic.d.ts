import { Expression } from './expression';
import { Quantity } from '../datatypes/quantity';
import { Context } from '../runtime/context';
import { DateTime } from '../datatypes/datetime';
export declare class Add extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Subtract extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Multiply extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Divide extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class TruncatedDivide extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare class Modulo extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Ceiling extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare class Floor extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare class Truncate extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare class Abs extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | Quantity | null>;
}
export declare class Negate extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | Quantity | null>;
}
export declare class Round extends Expression {
    precision: any;
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare class Ln extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Exp extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare class Log extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Power extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class MinValue extends Expression {
    static readonly MIN_VALUES: {
        '{urn:hl7-org:elm-types:r1}Integer': number;
        '{urn:hl7-org:elm-types:r1}Decimal': number;
        '{urn:hl7-org:elm-types:r1}DateTime': DateTime | null;
        '{urn:hl7-org:elm-types:r1}Date': import("../datatypes/datetime").Date | null;
        '{urn:hl7-org:elm-types:r1}Time': DateTime | undefined;
    };
    valueType: keyof typeof MinValue.MIN_VALUES;
    constructor(json: any);
    exec(ctx: Context): Promise<number | DateTime | import("../datatypes/datetime").Date | null | undefined>;
}
export declare class MaxValue extends Expression {
    static readonly MAX_VALUES: {
        '{urn:hl7-org:elm-types:r1}Integer': number;
        '{urn:hl7-org:elm-types:r1}Decimal': number;
        '{urn:hl7-org:elm-types:r1}DateTime': DateTime | null;
        '{urn:hl7-org:elm-types:r1}Date': import("../datatypes/datetime").Date | null;
        '{urn:hl7-org:elm-types:r1}Time': DateTime | undefined;
    };
    valueType: keyof typeof MaxValue.MAX_VALUES;
    constructor(json: any);
    exec(ctx: Context): Promise<number | DateTime | import("../datatypes/datetime").Date | null | undefined>;
}
export declare class Successor extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Predecessor extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
