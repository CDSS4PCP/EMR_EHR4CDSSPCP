"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyTrue = exports.AllTrue = exports.PopulationVariance = exports.Variance = exports.PopulationStdDev = exports.GeometricMean = exports.Product = exports.StdDev = exports.Mode = exports.Median = exports.Avg = exports.Max = exports.Min = exports.Sum = exports.Count = void 0;
const expression_1 = require("./expression");
const util_1 = require("../util/util");
const datatypes_1 = require("../datatypes/datatypes");
const exception_1 = require("../datatypes/exception");
const comparison_1 = require("../util/comparison");
const builder_1 = require("./builder");
class AggregateExpression extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.source = (0, builder_1.build)(json.source);
    }
}
class Count extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const items = await this.source.execute(ctx);
        if ((0, util_1.typeIsArray)(items)) {
            return (0, util_1.removeNulls)(items).length;
        }
        return 0;
    }
}
exports.Count = Count;
class Sum extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        let items = await this.source.execute(ctx);
        if (!(0, util_1.typeIsArray)(items)) {
            return null;
        }
        try {
            items = processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (items.length === 0) {
            return null;
        }
        if (hasOnlyQuantities(items)) {
            const values = getValuesFromQuantities(items);
            const sum = values.reduce((x, y) => x + y);
            return new datatypes_1.Quantity(sum, items[0].unit);
        }
        else {
            return items.reduce((x, y) => x + y);
        }
    }
}
exports.Sum = Sum;
class Min extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const list = await this.source.execute(ctx);
        if (list == null) {
            return null;
        }
        const listWithoutNulls = (0, util_1.removeNulls)(list);
        // Check for incompatible units and return null. We don't want to convert
        // the units for Min/Max, so we throw away the converted array if it succeeds
        try {
            processQuantities(list);
        }
        catch (e) {
            return null;
        }
        if (listWithoutNulls.length === 0) {
            return null;
        }
        // We assume the list is an array of all the same type.
        let minimum = listWithoutNulls[0];
        for (const element of listWithoutNulls) {
            if ((0, comparison_1.lessThan)(element, minimum)) {
                minimum = element;
            }
        }
        return minimum;
    }
}
exports.Min = Min;
class Max extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const items = await this.source.execute(ctx);
        if (items == null) {
            return null;
        }
        const listWithoutNulls = (0, util_1.removeNulls)(items);
        // Check for incompatible units and return null. We don't want to convert
        // the units for Min/Max, so we throw away the converted array if it succeeds
        try {
            processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (listWithoutNulls.length === 0) {
            return null;
        }
        // We assume the list is an array of all the same type.
        let maximum = listWithoutNulls[0];
        for (const element of listWithoutNulls) {
            if ((0, comparison_1.greaterThan)(element, maximum)) {
                maximum = element;
            }
        }
        return maximum;
    }
}
exports.Max = Max;
class Avg extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        let items = await this.source.execute(ctx);
        if (!(0, util_1.typeIsArray)(items)) {
            return null;
        }
        try {
            items = processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (items.length === 0) {
            return null;
        }
        if (hasOnlyQuantities(items)) {
            const values = getValuesFromQuantities(items);
            const sum = values.reduce((x, y) => x + y);
            return new datatypes_1.Quantity(sum / values.length, items[0].unit);
        }
        else {
            const sum = items.reduce((x, y) => x + y);
            return sum / items.length;
        }
    }
}
exports.Avg = Avg;
class Median extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        let items = await this.source.execute(ctx);
        if (!(0, util_1.typeIsArray)(items)) {
            return null;
        }
        if (items.length === 0) {
            return null;
        }
        try {
            items = processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (!hasOnlyQuantities(items)) {
            return medianOfNumbers(items);
        }
        const values = getValuesFromQuantities(items);
        const median = medianOfNumbers(values);
        return new datatypes_1.Quantity(median, items[0].unit);
    }
}
exports.Median = Median;
class Mode extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const items = await this.source.execute(ctx);
        if (!(0, util_1.typeIsArray)(items)) {
            return null;
        }
        if (items.length === 0) {
            return null;
        }
        let filtered;
        try {
            filtered = processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (hasOnlyQuantities(filtered)) {
            const values = getValuesFromQuantities(filtered);
            let mode = this.mode(values);
            if (mode.length === 1) {
                mode = mode[0];
            }
            return new datatypes_1.Quantity(mode, items[0].unit);
        }
        else {
            const mode = this.mode(filtered);
            if (mode.length === 1) {
                return mode[0];
            }
            else {
                return mode;
            }
        }
    }
    mode(arr) {
        let max = 0;
        const counts = {};
        let results = [];
        for (const elem of arr) {
            const cnt = (counts[elem] = (counts[elem] != null ? counts[elem] : 0) + 1);
            if (cnt === max && !results.includes(elem)) {
                results.push(elem);
            }
            else if (cnt > max) {
                results = [elem];
                max = cnt;
            }
        }
        return results;
    }
}
exports.Mode = Mode;
class StdDev extends AggregateExpression {
    constructor(json) {
        super(json);
        this.type = 'standard_deviation';
    }
    async exec(ctx) {
        let items = await this.source.execute(ctx);
        if (!(0, util_1.typeIsArray)(items)) {
            return null;
        }
        try {
            items = processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (items.length === 0) {
            return null;
        }
        if (hasOnlyQuantities(items)) {
            const values = getValuesFromQuantities(items);
            const stdDev = this.standardDeviation(values);
            return new datatypes_1.Quantity(stdDev, items[0].unit);
        }
        else {
            return this.standardDeviation(items);
        }
    }
    standardDeviation(list) {
        const val = this.stats(list);
        if (val) {
            return val[this.type];
        }
    }
    stats(list) {
        const sum = list.reduce((x, y) => x + y);
        const mean = sum / list.length;
        let sumOfSquares = 0;
        for (const sq of list) {
            sumOfSquares += Math.pow(sq - mean, 2);
        }
        const std_var = (1 / (list.length - 1)) * sumOfSquares;
        const pop_var = (1 / list.length) * sumOfSquares;
        const std_dev = Math.sqrt(std_var);
        const pop_dev = Math.sqrt(pop_var);
        return {
            standard_variance: std_var,
            population_variance: pop_var,
            standard_deviation: std_dev,
            population_deviation: pop_dev
        };
    }
}
exports.StdDev = StdDev;
class Product extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        let items = await this.source.execute(ctx);
        if (!(0, util_1.typeIsArray)(items)) {
            return null;
        }
        try {
            items = processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (items.length === 0) {
            return null;
        }
        if (hasOnlyQuantities(items)) {
            const values = getValuesFromQuantities(items);
            const product = values.reduce((x, y) => x * y);
            // Units are not multiplied for the geometric product
            return new datatypes_1.Quantity(product, items[0].unit);
        }
        else {
            return items.reduce((x, y) => x * y);
        }
    }
}
exports.Product = Product;
class GeometricMean extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        let items = await this.source.execute(ctx);
        if (!(0, util_1.typeIsArray)(items)) {
            return null;
        }
        try {
            items = processQuantities(items);
        }
        catch (e) {
            return null;
        }
        if (items.length === 0) {
            return null;
        }
        if (hasOnlyQuantities(items)) {
            const values = getValuesFromQuantities(items);
            const product = values.reduce((x, y) => x * y);
            const geoMean = Math.pow(product, 1.0 / items.length);
            return new datatypes_1.Quantity(geoMean, items[0].unit);
        }
        else {
            const product = items.reduce((x, y) => x * y);
            return Math.pow(product, 1.0 / items.length);
        }
    }
}
exports.GeometricMean = GeometricMean;
class PopulationStdDev extends StdDev {
    constructor(json) {
        super(json);
        this.type = 'population_deviation';
    }
}
exports.PopulationStdDev = PopulationStdDev;
class Variance extends StdDev {
    constructor(json) {
        super(json);
        this.type = 'standard_variance';
    }
}
exports.Variance = Variance;
class PopulationVariance extends StdDev {
    constructor(json) {
        super(json);
        this.type = 'population_variance';
    }
}
exports.PopulationVariance = PopulationVariance;
class AllTrue extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const items = await this.source.execute(ctx);
        return (0, util_1.allTrue)((0, util_1.removeNulls)(items));
    }
}
exports.AllTrue = AllTrue;
class AnyTrue extends AggregateExpression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const items = await this.source.execute(ctx);
        return (0, util_1.anyTrue)(items);
    }
}
exports.AnyTrue = AnyTrue;
function processQuantities(values) {
    const items = (0, util_1.removeNulls)(values);
    if (hasOnlyQuantities(items)) {
        return convertAllUnits(items);
    }
    else if (hasSomeQuantities(items)) {
        throw new exception_1.Exception('Cannot perform aggregate operations on mixed values of Quantities and non Quantities');
    }
    else {
        return items;
    }
}
function getValuesFromQuantities(quantities) {
    return quantities.map(quantity => quantity.value);
}
function hasOnlyQuantities(arr) {
    return arr.every(x => x.isQuantity);
}
function hasSomeQuantities(arr) {
    return arr.some(x => x.isQuantity);
}
function convertAllUnits(arr) {
    // convert all quantities in array to match the unit of the first item
    return arr.map(q => q.convertUnit(arr[0].unit));
}
function medianOfNumbers(numbers) {
    const items = (0, util_1.numerical_sort)(numbers, 'asc');
    if (items.length % 2 === 1) {
        // Odd number of items
        return items[(items.length - 1) / 2];
    }
    else {
        // Even number of items
        return (items[items.length / 2 - 1] + items[items.length / 2]) / 2;
    }
}
//# sourceMappingURL=aggregate.js.map