import { Context } from '../runtime/context';
import { Direction } from '../util/util';
import { Expression, UnimplementedExpression } from './expression';
export declare class AliasedQuerySource {
    alias: any;
    expression: any;
    constructor(json: any);
}
export declare class LetClause {
    identifier: string;
    expression: any;
    constructor(json: any);
}
export declare class With extends Expression {
    alias: any;
    expression: any;
    suchThat: Expression;
    constructor(json: any);
    exec(ctx: Context): Promise<boolean>;
}
export declare class Without extends With {
    constructor(json: any);
    exec(ctx: Context): Promise<boolean>;
}
export declare class Sort extends UnimplementedExpression {
}
export declare class ByDirection extends Expression {
    direction: Direction;
    low_order: number;
    high_order: number;
    constructor(json: any);
    exec(ctx: Context, a: any, b: any): Promise<number>;
}
export declare class ByExpression extends Expression {
    expression: any;
    direction: Direction;
    low_order: number;
    high_order: number;
    constructor(json: any);
    exec(ctx: Context, a: any, b: any): Promise<number>;
}
export declare class ByColumn extends ByExpression {
    constructor(json: any);
}
export declare class ReturnClause {
    expression: any;
    distinct: boolean;
    constructor(json: any);
}
export declare class SortClause {
    by: any;
    constructor(json: any);
    sort(ctx: Context, values: any[]): Promise<any[]>;
}
declare class AggregateClause extends Expression {
    identifier: string;
    expression: any;
    starting: any;
    distinct: boolean;
    constructor(json: any);
    aggregate(returnedValues: any, ctx: Context): Promise<any>;
}
export declare class Query extends Expression {
    sources: AliasedQuerySource[];
    letClauses: LetClause[];
    relationship: Expression[];
    where: any;
    returnClause: ReturnClause | null;
    aggregateClause: AggregateClause | null;
    aliases: any;
    sortClause: SortClause | null;
    constructor(json: any);
    isDistinct(): boolean;
    exec(ctx: Context): Promise<any>;
}
export declare class AliasRef extends Expression {
    name: string;
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class QueryLetRef extends AliasRef {
    constructor(json: any);
}
export {};
