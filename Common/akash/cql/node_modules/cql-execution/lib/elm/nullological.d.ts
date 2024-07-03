import { Context } from '../runtime/context';
import { Expression } from './expression';
export declare class Null extends Expression {
    constructor(json: any);
    exec(_ctx: Context): Promise<any>;
}
export declare class IsNull extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean>;
}
export declare class Coalesce extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
