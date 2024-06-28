"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const expression_1 = require("./expression");
const builder_1 = require("./builder");
class Message extends expression_1.Expression {
    constructor(json) {
        super(json);
        this.source = (0, builder_1.build)(json.source);
        this.condition = (0, builder_1.build)(json.condition);
        this.code = (0, builder_1.build)(json.code);
        this.severity = (0, builder_1.build)(json.severity);
        this.message = (0, builder_1.build)(json.message);
    }
    async exec(ctx) {
        const source = await this.source.execute(ctx);
        const condition = await this.condition.execute(ctx);
        if (condition) {
            const code = await this.code.execute(ctx);
            const severity = await this.severity.execute(ctx);
            const message = await this.message.execute(ctx);
            const listener = ctx.getMessageListener();
            if (listener && typeof listener.onMessage === 'function') {
                listener.onMessage(source, code, severity, message);
            }
        }
        return source;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map