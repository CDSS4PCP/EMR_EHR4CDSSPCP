"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientSource = exports.Patient = exports.Record = void 0;
const DT = __importStar(require("./datatypes/datatypes"));
class Record {
    constructor(json) {
        this.json = json;
        this.id = this.json.id;
    }
    _is(typeSpecifier) {
        return this._typeHierarchy().some(t => t.type === typeSpecifier.type && t.name == typeSpecifier.name);
    }
    _typeHierarchy() {
        return [
            {
                name: `{https://github.com/cqframework/cql-execution/simple}${this.json.recordType}`,
                type: 'NamedTypeSpecifier'
            },
            {
                name: '{https://github.com/cqframework/cql-execution/simple}Record',
                type: 'NamedTypeSpecifier'
            },
            { name: '{urn:hl7-org:elm-types:r1}Any', type: 'NamedTypeSpecifier' }
        ];
    }
    _recursiveGet(field) {
        if (field != null && field.indexOf('.') >= 0) {
            const [root, rest] = field.split('.', 2);
            return new Record(this._recursiveGet(root))._recursiveGet(rest);
        }
        return this.json[field];
    }
    get(field) {
        // the model should return the correct type for the field. For this simple model example,
        // we just cheat and use the shape of the value to determine it. Real implementations should
        // have a more sophisticated approach
        const value = this._recursiveGet(field);
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}(T[\d\-.]+)?/.test(value)) {
            return this.getDate(field);
        }
        if (value != null && typeof value === 'object' && value.code != null && value.system != null) {
            return this.getCode(field);
        }
        if (value != null && typeof value === 'object' && (value.low != null || value.high != null)) {
            return this.getInterval(field);
        }
        return value;
    }
    getId() {
        return this.id;
    }
    getDate(field) {
        const val = this._recursiveGet(field);
        if (val != null) {
            return DT.DateTime.parse(val);
        }
        else {
            return null;
        }
    }
    getInterval(field) {
        const val = this._recursiveGet(field);
        if (val != null && typeof val === 'object') {
            const low = val.low != null ? DT.DateTime.parse(val.low) : null;
            const high = val.high != null ? DT.DateTime.parse(val.high) : null;
            return new DT.Interval(low, high);
        }
    }
    getDateOrInterval(field) {
        const val = this._recursiveGet(field);
        if (val != null && typeof val === 'object') {
            return this.getInterval(field);
        }
        else {
            return this.getDate(field);
        }
    }
    getCode(field) {
        const val = this._recursiveGet(field);
        if (val != null && typeof val === 'object') {
            return new DT.Code(val.code, val.system, val.version);
        }
    }
}
exports.Record = Record;
class Patient extends Record {
    constructor(json) {
        super(json);
        this.name = json.name;
        this.gender = json.gender;
        this.birthDate = json.birthDate != null ? DT.DateTime.parse(json.birthDate) : undefined;
        this.records = {};
        (json.records || []).forEach((r) => {
            if (this.records[r.recordType] == null) {
                this.records[r.recordType] = [];
            }
            this.records[r.recordType].push(new Record(r));
        });
    }
    findRecords(profile) {
        if (profile == null) {
            return [];
        }
        const match = profile.match(/(\{https:\/\/github\.com\/cqframework\/cql-execution\/simple\})?(.*)/);
        if (match == null) {
            return [];
        }
        const recordType = match[2];
        if (recordType === 'Patient') {
            return [this];
        }
        else {
            return this.records[recordType] || [];
        }
    }
}
exports.Patient = Patient;
class PatientSource {
    constructor(patients) {
        this.patients = patients;
        this.nextPatient();
    }
    currentPatient() {
        return this.current;
    }
    nextPatient() {
        const currentJSON = this.patients.shift();
        this.current = currentJSON ? new Patient(currentJSON) : undefined;
        return this.current;
    }
}
exports.PatientSource = PatientSource;
//# sourceMappingURL=cql-patient.js.map