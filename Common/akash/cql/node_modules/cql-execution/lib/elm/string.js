"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceMatches = exports.EndsWith = exports.StartsWith = exports.Substring = exports.Matches = exports.LastPositionOf = exports.PositionOf = exports.Lower = exports.Upper = exports.SplitOnMatches = exports.Split = exports.Combine = exports.Concatenate = void 0;
const expression_1 = require("./expression");
const builder_1 = require("./builder");
class Concatenate extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args.some((x) => x == null)) {
            return null;
        }
        else {
            return args.reduce((x, y) => x + y);
        }
    }
}
exports.Concatenate = Concatenate;
class Combine extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.source = (0, builder_1.build)(json.source);
        this.separator = (0, builder_1.build)(json.separator);
    }
    async exec(ctx) {
        const source = await this.source.execute(ctx);
        const separator = this.separator != null ? await this.separator.execute(ctx) : '';
        if (source == null) {
            return null;
        }
        else {
            const filteredArray = source.filter((x) => x != null);
            if (filteredArray.length === 0) {
                return null;
            }
            else {
                return filteredArray.join(separator);
            }
        }
    }
}
exports.Combine = Combine;
class Split extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.stringToSplit = (0, builder_1.build)(json.stringToSplit);
        this.separator = (0, builder_1.build)(json.separator);
    }
    async exec(ctx) {
        const stringToSplit = await this.stringToSplit.execute(ctx);
        const separator = await this.separator.execute(ctx);
        if (stringToSplit && separator) {
            return stringToSplit.split(separator);
        }
        return stringToSplit ? [stringToSplit] : null;
    }
}
exports.Split = Split;
class SplitOnMatches extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.stringToSplit = (0, builder_1.build)(json.stringToSplit);
        this.separatorPattern = (0, builder_1.build)(json.separatorPattern);
    }
    async exec(ctx) {
        const stringToSplit = await this.stringToSplit.execute(ctx);
        const separatorPattern = await this.separatorPattern.execute(ctx);
        if (stringToSplit && separatorPattern) {
            return stringToSplit.split(new RegExp(separatorPattern));
        }
        return stringToSplit ? [stringToSplit] : null;
    }
}
exports.SplitOnMatches = SplitOnMatches;
// Length is completely handled by overloaded#Length
class Upper extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            return arg.toUpperCase();
        }
        else {
            return null;
        }
    }
}
exports.Upper = Upper;
class Lower extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const arg = await this.execArgs(ctx);
        if (arg != null) {
            return arg.toLowerCase();
        }
        else {
            return null;
        }
    }
}
exports.Lower = Lower;
// Indexer is completely handled by overloaded#Indexer
class PositionOf extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.pattern = (0, builder_1.build)(json.pattern);
        this.string = (0, builder_1.build)(json.string);
    }
    async exec(ctx) {
        const pattern = await this.pattern.execute(ctx);
        const string = await this.string.execute(ctx);
        if (pattern == null || string == null) {
            return null;
        }
        else {
            return string.indexOf(pattern);
        }
    }
}
exports.PositionOf = PositionOf;
class LastPositionOf extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.pattern = (0, builder_1.build)(json.pattern);
        this.string = (0, builder_1.build)(json.string);
    }
    async exec(ctx) {
        const pattern = await this.pattern.execute(ctx);
        const string = await this.string.execute(ctx);
        if (pattern == null || string == null) {
            return null;
        }
        else {
            return string.lastIndexOf(pattern);
        }
    }
}
exports.LastPositionOf = LastPositionOf;
class Matches extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const [string, pattern] = await this.execArgs(ctx);
        if (string == null || pattern == null) {
            return null;
        }
        return new RegExp('^' + pattern + '$').test(string);
    }
}
exports.Matches = Matches;
class Substring extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.stringToSub = (0, builder_1.build)(json.stringToSub);
        this.startIndex = (0, builder_1.build)(json.startIndex);
        this.length = (0, builder_1.build)(json['length']);
    }
    async exec(ctx) {
        const stringToSub = await this.stringToSub.execute(ctx);
        const startIndex = await this.startIndex.execute(ctx);
        const length = this.length != null ? await this.length.execute(ctx) : null;
        // According to spec: If stringToSub or startIndex is null, or startIndex is out of range, the result is null.
        if (stringToSub == null ||
            startIndex == null ||
            startIndex < 0 ||
            startIndex >= stringToSub.length) {
            return null;
        }
        else if (length != null) {
            return stringToSub.substr(startIndex, length);
        }
        else {
            return stringToSub.substr(startIndex);
        }
    }
}
exports.Substring = Substring;
class StartsWith extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args.some((x) => x == null)) {
            return null;
        }
        else {
            return args[0].slice(0, args[1].length) === args[1];
        }
    }
}
exports.StartsWith = StartsWith;
class EndsWith extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args.some((x) => x == null)) {
            return null;
        }
        else {
            return args[1] === '' || args[0].slice(-args[1].length) === args[1];
        }
    }
}
exports.EndsWith = EndsWith;
class ReplaceMatches extends expression_1.Expression {
    constructor(json) {
        super(json);
    }
    async exec(ctx) {
        const args = await this.execArgs(ctx);
        if (args.some((x) => x == null)) {
            return null;
        }
        else {
            return args[0].replace(new RegExp(args[1], 'g'), args[2]);
        }
    }
}
exports.ReplaceMatches = ReplaceMatches;
//# sourceMappingURL=string.js.map