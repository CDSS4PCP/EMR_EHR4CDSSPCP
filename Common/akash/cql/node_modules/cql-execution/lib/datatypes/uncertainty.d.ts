export declare class Uncertainty {
    low: any;
    high?: any;
    static from(obj: any): any;
    constructor(low?: any, high?: any);
    get isUncertainty(): boolean;
    copy(): Uncertainty;
    isPoint(): boolean;
    equals(other: any): any;
    lessThan(other: any): any;
    greaterThan(other: any): any;
    lessThanOrEquals(other: any): boolean | null;
    greaterThanOrEquals(other: any): boolean | null;
}
