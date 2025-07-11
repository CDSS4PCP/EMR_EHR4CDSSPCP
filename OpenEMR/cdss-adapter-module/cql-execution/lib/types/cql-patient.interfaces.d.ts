import { Code, ValueSet } from '../datatypes/clinical';
import { Interval } from '../datatypes/interval';
import { AnyTypeSpecifier } from './type-specifiers.interfaces';
export interface DataProvider {
    currentPatient(): PatientObject | undefined | Promise<PatientObject | undefined>;
    nextPatient(): PatientObject | undefined | Promise<PatientObject | undefined>;
}
export interface RecordObject {
    get(field: any): any;
    getId(): any;
    getCode(field: any): any;
    getDate(field: any): any;
    getDateOrInterval(field: any): any;
    _is?(typeSpecifier: AnyTypeSpecifier): boolean;
    _typeHierarchy?(): AnyTypeSpecifier[];
}
export interface RetrieveDetails {
    datatype: string;
    templateId?: string;
    codeProperty?: string;
    codes?: Code[] | ValueSet;
    dateProperty?: string;
    dateRange?: Interval;
}
export interface PatientObject extends RecordObject {
    findRecords(profile: string | null, retrieveDetails?: RetrieveDetails): RecordObject[] | Promise<RecordObject[]>;
}
