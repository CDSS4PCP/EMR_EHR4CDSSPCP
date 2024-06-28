import Immutable from 'immutable';
declare type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export declare type NormalizedKey = Primitive | Immutable.Collection<NormalizedKey, unknown>;
/**
 * Provide a unique key for an object to be used for value equality
 * A key is normalized such that representations for quantities, dates, intervals, etc. are comparable.
 */
export declare const toNormalizedKey: (js: any) => NormalizedKey;
export {};
