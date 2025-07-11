import { Context } from '../runtime/context';
import { Expression } from './expression';
export declare class Message extends Expression {
    source: any;
    condition: any;
    code: any;
    severity: any;
    message: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
