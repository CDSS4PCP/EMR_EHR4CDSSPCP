import { Expression } from './expression';
import * as DT from '../datatypes/datatypes';
import { Context } from '../runtime/context';
export declare class DateTime extends Expression {
    json: any;
    static readonly PROPERTIES: string[];
    constructor(json: any);
    exec(ctx: Context): Promise<DT.DateTime>;
}
export declare class Date extends Expression {
    json: any;
    static readonly PROPERTIES: string[];
    constructor(json: any);
    exec(ctx: Context): Promise<DT.Date>;
}
export declare class Time extends Expression {
    static readonly PROPERTIES: string[];
    constructor(json: any);
    exec(ctx: Context): Promise<DT.DateTime>;
}
export declare class Today extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<DT.Date>;
}
export declare class Now extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<DT.DateTime>;
}
export declare class TimeOfDay extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<DT.DateTime>;
}
export declare class DateTimeComponentFrom extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class DateFrom extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class TimeFrom extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class TimezoneOffsetFrom extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare function doAfter(a: any, b: any, precision: any): any;
export declare function doBefore(a: any, b: any, precision: any): any;
export declare class DifferenceBetween extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class DurationBetween extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
