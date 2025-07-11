import { Expression } from './expression';
import { Context } from '../runtime/context';
declare class Element {
    name: string;
    value: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Instance extends Expression {
    classType: string;
    element: Element[];
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export {};
