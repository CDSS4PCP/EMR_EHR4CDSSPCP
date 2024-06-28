"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncMergeSort = exports.getTimezoneSeparatorFromString = exports.normalizeMillisecondsField = exports.normalizeMillisecondsFieldInString = exports.jsDate = exports.anyTrue = exports.allTrue = exports.typeIsArray = exports.isNull = exports.numerical_sort = exports.removeNulls = void 0;
function removeNulls(things) {
    return things.filter(x => x != null);
}
exports.removeNulls = removeNulls;
function numerical_sort(things, direction) {
    return things.sort((a, b) => {
        if (direction == null || direction === 'asc' || direction === 'ascending') {
            return a - b;
        }
        else {
            return b - a;
        }
    });
}
exports.numerical_sort = numerical_sort;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
exports.typeIsArray = Array.isArray || (value => ({}.toString.call(value) === '[object Array]'));
function allTrue(things) {
    if ((0, exports.typeIsArray)(things)) {
        return things.every(x => x);
    }
    else {
        return things;
    }
}
exports.allTrue = allTrue;
function anyTrue(things) {
    if ((0, exports.typeIsArray)(things)) {
        return things.some(x => x);
    }
    else {
        return things;
    }
}
exports.anyTrue = anyTrue;
//The export below is to make it easier if js Date is overwritten with CQL Date
exports.jsDate = Date;
function normalizeMillisecondsFieldInString(string, msString) {
    // TODO: verify we are only removing numeral digits
    let timezoneField;
    msString = normalizeMillisecondsField(msString);
    const [beforeMs, msAndAfter] = string.split('.');
    const timezoneSeparator = getTimezoneSeparatorFromString(msAndAfter);
    if (timezoneSeparator) {
        timezoneField = msAndAfter != null ? msAndAfter.split(timezoneSeparator)[1] : undefined;
    }
    if (timezoneField == null) {
        timezoneField = '';
    }
    return (string = beforeMs + '.' + msString + timezoneSeparator + timezoneField);
}
exports.normalizeMillisecondsFieldInString = normalizeMillisecondsFieldInString;
function normalizeMillisecondsField(msString) {
    // fix up milliseconds by padding zeros and/or truncating (5 --> 500, 50 --> 500, 54321 --> 543, etc.)
    return (msString = (msString + '00').substring(0, 3));
}
exports.normalizeMillisecondsField = normalizeMillisecondsField;
function getTimezoneSeparatorFromString(string) {
    if (string != null) {
        let matches = string.match(/-/);
        if (matches && matches.length === 1) {
            return '-';
        }
        matches = string.match(/\+/);
        if (matches && matches.length === 1) {
            return '+';
        }
    }
    return '';
}
exports.getTimezoneSeparatorFromString = getTimezoneSeparatorFromString;
async function asyncMergeSort(arr, compareFn) {
    if (arr.length <= 1) {
        return arr;
    }
    const midpoint = Math.floor(arr.length / 2);
    const left = await asyncMergeSort(arr.slice(0, midpoint), compareFn);
    const right = await asyncMergeSort(arr.slice(midpoint), compareFn);
    return merge(left, right, compareFn);
}
exports.asyncMergeSort = asyncMergeSort;
async function merge(left, right, compareFn) {
    const sorted = [];
    while (left.length > 0 && right.length > 0) {
        if ((await compareFn(left[0], right[0])) <= 0) {
            const sortedElem = left.shift();
            if (sortedElem !== undefined) {
                sorted.push(sortedElem);
            }
        }
        else {
            const sortedElem = right.shift();
            if (sortedElem !== undefined) {
                sorted.push(sortedElem);
            }
        }
    }
    return [...sorted, ...left, ...right];
}
//# sourceMappingURL=util.js.map