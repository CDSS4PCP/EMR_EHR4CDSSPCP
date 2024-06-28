import { Context } from '../runtime/context';
import { Expression, UnimplementedExpression } from './expression';
export declare class List extends Expression {
    elements: Expression[];
    constructor(json: any);
    get isList(): boolean;
    exec(ctx: Context): Promise<any[]>;
}
export declare class Exists extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare function doUnion(a: any, b: any): any[];
export declare function doExcept(a: any, b: any): any[];
export declare function doIntersect(a: any, b: any): any[];
export declare class Times extends UnimplementedExpression {
}
export declare class Filter extends UnimplementedExpression {
}
export declare class SingletonFrom extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ToList extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any[]>;
}
export declare class IndexOf extends Expression {
    source: Expression;
    element: Expression;
    constructor(json: any);
    exec(ctx: Context): Promise<number | null>;
}
export declare function doContains(container: any[], item: any, nullEquivalence?: boolean): boolean;
export declare function doIncludes(list: any, sublist: any): any;
export declare function doProperIncludes(list: any, sublist: any): any;
export declare class ForEach extends UnimplementedExpression {
}
export declare class Flatten extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Distinct extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<unknown[] | null>;
}
export declare const toDistinctList: (list: unknown[]) => unknown[];
export declare class Current extends UnimplementedExpression {
}
export declare class First extends Expression {
    source: Expression;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Last extends Expression {
    source: Expression;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Slice extends Expression {
    source: Expression;
    startIndex: Expression;
    endIndex: Expression;
    constructor(json: any);
    exec(ctx: Context): Promise<any[] | null>;
}
