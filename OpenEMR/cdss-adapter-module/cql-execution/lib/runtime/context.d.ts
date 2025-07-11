import * as dt from '../datatypes/datatypes';
import { Library } from '../elm/library';
import { PatientObject, RetrieveDetails, TerminologyProvider } from '../types';
import { Parameter } from '../types/runtime.types';
import { MessageListener } from './messageListeners';
export declare class Context {
    parent: any;
    executionDateTime?: dt.DateTime;
    messageListener?: MessageListener;
    private _codeService?;
    private _parameters?;
    context_values: any;
    library_context: any;
    localId_context: any;
    evaluatedRecords: any[];
    constructor(parent: Context | Library, _codeService?: TerminologyProvider | null, _parameters?: Parameter, executionDateTime?: dt.DateTime, messageListener?: MessageListener);
    get parameters(): any;
    set parameters(params: any);
    get codeService(): TerminologyProvider;
    set codeService(cs: TerminologyProvider);
    withParameters(params: Parameter): this;
    withCodeService(cs: TerminologyProvider): this;
    rootContext(): any;
    findRecords(profile: string | null, retrieveDetails?: RetrieveDetails): Promise<any>;
    childContext(context_values?: any): Context;
    getLibraryContext(library: any): any;
    getLocalIdContext(localId: any): Context;
    getParameter(name: string): any;
    getParentParameter(name: string): any;
    getTimezoneOffset(): number | null;
    getExecutionDateTime(): dt.DateTime;
    getMessageListener(): MessageListener;
    getValueSet(name: string, library: any): any;
    getCodeSystem(name: string): any;
    getCode(name: string): any;
    getConcept(name: string): any;
    get(identifier: string): any;
    set(identifier: string, value: any): void;
    setLocalIdWithResult(localId: string, value: any): void;
    getLocalIdResult(localId: string): any;
    getAllLocalIds(): any;
    supportLibraryLocalIds(lib: any, localIdResults: any): void;
    mergeLibraryLocalIdResults(localIdResults: any, libraryId: string, libraryResults: any): void;
    checkParameters(params: Parameter): true | undefined;
    matchesTypeSpecifier(val: any, spec: any): boolean;
    matchesListTypeSpecifier(val: any, spec: any): boolean;
    matchesTupleTypeSpecifier(val: any, spec: any): boolean;
    matchesIntervalTypeSpecifier(val: any, spec: any): boolean;
    matchesChoiceTypeSpecifier(val: any, spec: any): boolean;
    matchesNamedTypeSpecifier(val: any, spec: any): boolean;
    matchesInstanceType(val: any, inst: any): boolean;
    matchesListInstanceType(val: any, list: any): boolean;
    matchesTupleInstanceType(val: any, tpl: any): any;
    matchesIntervalInstanceType(val: any, ivl: any): any;
}
export declare class PatientContext extends Context {
    library: Library;
    patient?: PatientObject | null | undefined;
    constructor(library: Library, patient?: PatientObject | null | undefined, codeService?: TerminologyProvider | null, parameters?: Parameter, executionDateTime?: dt.DateTime, messageListener?: MessageListener);
    rootContext(): this;
    getLibraryContext(library: any): any;
    getLocalIdContext(localId: string): any;
    findRecords(profile: any, retrieveDetails?: RetrieveDetails): Promise<import("../types").RecordObject[] | null | undefined>;
}
export declare class UnfilteredContext extends Context {
    library: Library;
    results: any;
    constructor(library: Library, results: any, codeService?: TerminologyProvider | null, parameters?: Parameter, executionDateTime?: dt.DateTime, messageListener?: MessageListener);
    rootContext(): this;
    findRecords(_template: any): Promise<any>;
    getLibraryContext(_library: any): void;
    get(identifier: string): any;
}
