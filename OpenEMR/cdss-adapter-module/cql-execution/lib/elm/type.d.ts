import { Context } from '../runtime/context';
import { Expression, UnimplementedExpression } from './expression';
import { DateTime } from '../datatypes/datetime';
import { Concept } from '../datatypes/clinical';
import { Ratio } from '../datatypes/ratio';
export declare class As extends Expression {
    asTypeSpecifier: any;
    strict: boolean;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ToBoolean extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ToConcept extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<Concept | null>;
}
export declare class ToDate extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ToDateTime extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ToDecimal extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ToInteger extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare class ToQuantity extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
    convertValue(val: any): any;
}
export declare class ToRatio extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<Ratio | null>;
}
export declare class ToString extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ToTime extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<DateTime | null>;
}
export declare class Convert extends Expression {
    operand: any;
    toType: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ConvertsToBoolean extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToDate extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToDateTime extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToDecimal extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToInteger extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToQuantity extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToRatio extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToString extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertsToTime extends Expression {
    operand: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ConvertQuantity extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class CanConvertQuantity extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class Is extends Expression {
    isTypeSpecifier: any;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean>;
}
export declare class IntervalTypeSpecifier extends UnimplementedExpression {
}
export declare class ListTypeSpecifier extends UnimplementedExpression {
}
export declare class NamedTypeSpecifier extends UnimplementedExpression {
}
export declare class TupleTypeSpecifier extends UnimplementedExpression {
}
