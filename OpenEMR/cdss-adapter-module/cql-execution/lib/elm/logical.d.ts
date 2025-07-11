import { Expression } from './expression';
import { Context } from '../runtime/context';
export declare class And extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class Or extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class Not extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class Xor extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean | null>;
}
export declare class IsTrue extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean>;
}
export declare class IsFalse extends Expression {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean>;
}
