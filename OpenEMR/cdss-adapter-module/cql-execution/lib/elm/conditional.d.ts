import { Expression } from './expression';
import { Context } from '../runtime/context';
export declare class If extends Expression {
    condition: any;
    th: any;
    els: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class CaseItem {
    when: any;
    then: any;
    constructor(json: any);
}
export declare class Case extends Expression {
    comparand: any;
    caseItems: CaseItem[];
    els: any;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
    exec_selected(ctx: Context): Promise<any>;
    exec_standard(ctx: Context): Promise<any>;
}
