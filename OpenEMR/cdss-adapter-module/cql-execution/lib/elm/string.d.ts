import { Expression } from './expression';
import { Context } from '../runtime/context';
export declare class Concatenate extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Combine extends Expression {
    source: any;
    separator: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Split extends Expression {
    stringToSplit: any;
    separator: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class SplitOnMatches extends Expression {
    stringToSplit: any;
    separatorPattern: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Upper extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Lower extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class PositionOf extends Expression {
    pattern: any;
    string: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class LastPositionOf extends Expression {
    pattern: any;
    string: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Matches extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class Substring extends Expression {
    stringToSub: any;
    startIndex: any;
    length: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class StartsWith extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class EndsWith extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class ReplaceMatches extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
