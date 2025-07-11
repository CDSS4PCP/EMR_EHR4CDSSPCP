import { Expression } from './expression';
import { Quantity } from '../datatypes/datatypes';
import { Context } from '../runtime/context';
declare class AggregateExpression extends Expression {
    source: any;
    constructor(json: any);
}
export declare class Count extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<number>;
}
export declare class Sum extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Min extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Max extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class Avg extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | Quantity | null>;
}
export declare class Median extends AggregateExpression {
    constructor(json: number);
    exec(ctx: Context): Promise<any>;
}
export declare class Mode extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
    mode(arr: any[]): any[];
}
declare type StatisticType = 'standard_deviation' | 'population_deviation' | 'standard_variance' | 'population_variance';
export declare class StdDev extends AggregateExpression {
    type: StatisticType;
    constructor(json: any);
    exec(ctx: Context): Promise<number | Quantity | null | undefined>;
    standardDeviation(list: any[]): number | undefined;
    stats(list: any[]): {
        standard_variance: number;
        population_variance: number;
        standard_deviation: number;
        population_deviation: number;
    };
}
export declare class Product extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class GeometricMean extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<number | Quantity | null>;
}
export declare class PopulationStdDev extends StdDev {
    constructor(json: any);
}
export declare class Variance extends StdDev {
    constructor(json: any);
}
export declare class PopulationVariance extends StdDev {
    constructor(json: any);
}
export declare class AllTrue extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export declare class AnyTrue extends AggregateExpression {
    constructor(json: any);
    exec(ctx: Context): Promise<any>;
}
export {};
