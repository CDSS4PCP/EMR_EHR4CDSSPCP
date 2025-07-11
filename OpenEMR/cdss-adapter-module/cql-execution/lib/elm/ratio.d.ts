import { Expression } from './expression';
import { Quantity } from '../datatypes/quantity';
import * as DT from '../datatypes/datatypes';
import { Context } from '../runtime/context';
export declare class Ratio extends Expression {
    numerator: Quantity;
    denominator: Quantity;
    constructor(json: any);
    exec(_ctx: Context): Promise<DT.Ratio>;
}
