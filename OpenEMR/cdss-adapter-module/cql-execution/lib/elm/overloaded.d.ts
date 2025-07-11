import { Expression } from './expression';
import { Context } from '../runtime/context';
export declare class Equal extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Equivalent extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class NotEqual extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class Union extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
    listTypeArgs(): boolean | undefined;
}
export declare class Except extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Intersect extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Indexer extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class In extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Contains extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Includes extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class IncludedIn extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ProperIncludes extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ProperIncludedIn extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Length extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class After extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Before extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class SameAs extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class SameOrAfter extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class SameOrBefore extends Expression {
    precision?: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Precision extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
