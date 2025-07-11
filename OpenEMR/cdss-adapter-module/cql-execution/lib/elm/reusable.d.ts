import { Context } from '../runtime/context';
import { Expression } from './expression';
import { Parameter } from '../types/runtime.types';
export declare class ExpressionDef extends Expression {
    name: string;
    context: any;
    expression: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ExpressionRef extends Expression {
    name: string;
    library: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class FunctionDef extends Expression {
    name: string;
    expression: any;
    parameters?: Parameter;
    constructor(json: any);
    exec(_ctx: Context): Promise<this>;
}
export declare class FunctionRef extends Expression {
    name: string;
    library: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class OperandRef extends Expression {
    name: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class IdentifierRef extends Expression {
    name: string;
    library: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
