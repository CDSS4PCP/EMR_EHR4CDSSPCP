import { Context } from '../runtime/context';
import { Expression } from './expression';
export declare class Literal extends Expression {
    valueType: string;
    value: any;
    static from(json: any): Literal;
    constructor(json: any);
    exec(_ctx: Context): Promise<any>;
}
export declare class BooleanLiteral extends Literal {
    constructor(json: any);
    get isBooleanLiteral(): boolean;
    exec(_ctx: Context): Promise<any>;
}
export declare class IntegerLiteral extends Literal {
    constructor(json: any);
    get isIntegerLiteral(): boolean;
    exec(_ctx: Context): Promise<any>;
}
export declare class DecimalLiteral extends Literal {
    constructor(json: any);
    get isDecimalLiteral(): boolean;
    exec(_ctx: Context): Promise<any>;
}
export declare class StringLiteral extends Literal {
    constructor(json: any);
    get isStringLiteral(): boolean;
    exec(_ctx: Context): Promise<any>;
}
