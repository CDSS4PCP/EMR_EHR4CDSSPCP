import { Expression } from './expression';
import { Context } from '../runtime/context';
export declare class Retrieve extends Expression {
    datatype: string;
    templateId?: string;
    codeProperty?: string;
    codes?: Expression | null;
    dateProperty?: string;
    dateRange?: Expression | null;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
    recordMatchesCodesOrVS(record: any, codes: any): any;
}
