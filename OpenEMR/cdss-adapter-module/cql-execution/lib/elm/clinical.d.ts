import { Expression } from './expression';
import * as dt from '../datatypes/datatypes';
import { Context } from '../runtime/context';
export declare class ValueSetDef extends Expression {
    name: string;
    id: string;
    version?: string;
    constructor(json: any);
    exec(ctx: Context): Promise<dt.ValueSet>;
}
export declare class ValueSetRef extends Expression {
    name: string;
    libraryName: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class AnyInValueSet extends Expression {
    codes: any;
    valueset: ValueSetRef;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class InValueSet extends Expression {
    code: any;
    valueset: ValueSetRef;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class CodeSystemDef extends Expression {
    name: string;
    id: string;
    version: string;
    constructor(json: any);
    exec(_ctx: Context): Promise<dt.CodeSystem>;
}
export declare class CodeDef extends Expression {
    name: string;
    id: string;
    systemName: string;
    display?: string;
    constructor(json: any);
    exec(ctx: Context): Promise<dt.Code>;
}
export declare class CodeRef extends Expression {
    name: string;
    library: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Code extends Expression {
    code: any;
    systemName: string;
    version: string;
    display?: string;
    constructor(json: any);
    get isCode(): boolean;
    exec(ctx: Context): Promise<dt.Code>;
}
export declare class ConceptDef extends Expression {
    name: string;
    codes: any;
    display?: string;
    constructor(json: any);
    exec(ctx: Context): Promise<dt.Concept>;
}
export declare class ConceptRef extends Expression {
    name: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Concept extends Expression {
    codes: any;
    display?: string;
    constructor(json: any);
    get isConcept(): boolean;
    toCode(ctx: Context, code: any): dt.Code;
    exec(ctx: Context): Promise<dt.Concept>;
}
export declare class CalculateAge extends Expression {
    precision: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class CalculateAgeAt extends Expression {
    precision: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
