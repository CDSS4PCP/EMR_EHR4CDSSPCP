import { ValueSet } from '../datatypes/datatypes';
export interface ValueSetDictionary {
    [oid: string]: {
        [version: string]: {
            code: string;
            system: string;
            version?: string;
            display?: string;
        }[];
    };
}
export interface ValueSetObject {
    [oid: string]: {
        [version: string]: ValueSet;
    };
}
export interface TerminologyProvider {
    findValueSetsByOid: (oid: string) => ValueSet[] | Promise<ValueSet[]>;
    findValueSet: (oid: string, version?: string) => ValueSet | Promise<ValueSet> | null;
}
