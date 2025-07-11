import { Expression } from './expression';
import * as DT from '../datatypes/datatypes';
import { Context } from '../runtime/context';
export declare class Quantity extends Expression {
    value: number;
    unit: any;
    constructor(json: any);
    exec(_ctx: Context): Promise<DT.Quantity>;
}
