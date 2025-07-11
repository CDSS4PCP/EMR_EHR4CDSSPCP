import { Expression } from './expression';
import { Context } from '../runtime/context';
export declare class Less extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class LessOrEqual extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Greater extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class GreaterOrEqual extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
