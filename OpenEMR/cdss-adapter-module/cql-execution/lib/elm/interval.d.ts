import { Expression } from './expression';
import * as dtivl from '../datatypes/interval';
import { Context } from '../runtime/context';
export declare class Interval extends Expression {
    lowClosed: boolean;
    lowClosedExpression: any;
    highClosed: boolean;
    highClosedExpression: any;
    low: any;
    high: any;
    constructor(json: any);
    get isInterval(): boolean;
    exec(ctx: Context): Promise<dtivl.Interval>;
}
export declare function doContains(interval: any, item: any, precision?: any): any;
export declare function doIncludes(interval: any, subinterval: any, precision?: any): any;
export declare function doProperIncludes(interval: any, subinterval: any, precision?: any): any;
export declare function doAfter(a: any, b: any, precision?: any): any;
export declare function doBefore(a: any, b: any, precision?: any): any;
export declare class Meets extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class MeetsAfter extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class MeetsBefore extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Overlaps extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class OverlapsAfter extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class OverlapsBefore extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare function doUnion(a: any, b: any): any;
export declare function doExcept(a: any, b: any): any;
export declare function doIntersect(a: any, b: any): any;
export declare class Width extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Size extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Start extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class End extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Starts extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Ends extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Expand extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<dtivl.Interval[] | null>;
    expandDTishInterval(interval: any, per: any): dtivl.Interval[] | null;
    truncateToPrecision(value: any, unit: any): any;
    expandQuantityInterval(interval: any, per: any): dtivl.Interval[] | null;
    expandNumericInterval(interval: any, per: any): dtivl.Interval[] | null;
    makeNumericIntervalList(low: any, high: any, lowClosed: boolean, highClosed: boolean, perValue: any): dtivl.Interval[];
}
export declare class Collapse extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any[] | null>;
}
