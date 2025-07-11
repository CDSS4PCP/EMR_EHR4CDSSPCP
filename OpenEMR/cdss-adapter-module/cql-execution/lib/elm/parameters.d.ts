import { Context } from '../runtime/context';
import { Expression } from './expression';
export declare class ParameterDef extends Expression {
    name: string;
    default: any;
    parameterTypeSpecifier: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class ParameterRef extends Expression {
    name: string;
    library: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
