import { MessageListener } from './messageListeners';
import { Results } from './results';
import { DateTime } from '../datatypes/datetime';
import { Parameter } from '../types/runtime.types';
import { DataProvider, TerminologyProvider } from '../types';
export declare class Executor {
    library: any;
    codeService?: TerminologyProvider | undefined;
    parameters?: Parameter | undefined;
    messageListener: MessageListener;
    constructor(library: any, codeService?: TerminologyProvider | undefined, parameters?: Parameter | undefined, messageListener?: MessageListener);
    withLibrary(lib: any): this;
    withParameters(params: Parameter): this;
    withCodeService(cs: TerminologyProvider): this;
    withMessageListener(ml: MessageListener): this;
    exec_expression(expression: any, patientSource: DataProvider, executionDateTime: DateTime): Promise<Results>;
    exec(patientSource: DataProvider, executionDateTime?: DateTime): Promise<Results>;
    exec_patient_context(patientSource: DataProvider, executionDateTime?: DateTime): Promise<Results>;
}
