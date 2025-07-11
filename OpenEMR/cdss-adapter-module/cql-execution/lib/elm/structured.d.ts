import { Context } from '../runtime/context';
import { Expression, UnimplementedExpression } from './expression';
export declare class Property extends Expression {
    scope: any;
    source: any;
    path: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Tuple extends Expression {
    elements: any[];
    constructor(json: any);
    get isTuple(): boolean;
    exec(ctx: Context): Promise<any>;
}
export declare class TupleElement extends UnimplementedExpression {
}
export declare class TupleElementDefinition extends UnimplementedExpression {
}
