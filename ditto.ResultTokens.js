"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResultTokens = /** @class */ (function () {
    function ResultTokens() {
        this.tokens = [];
    }
    ResultTokens.prototype.push = function (name, result) {
        this.tokens.push({ name: name, result: result });
        return this.tokens.length;
    };
    ResultTokens.prototype.dropafter = function (end) {
        while (this.tokens.length > 0) {
            var temp = this.tokens.pop();
            if (temp.result.endloc > end) {
                continue;
            }
            else {
                this.tokens.push(temp);
                break;
            }
        }
    };
    ResultTokens.prototype.one = function (name) {
        var r = this.get(name);
        if (r !== null) {
            return r[0];
        }
        return null;
    };
    ResultTokens.prototype.get = function (name) {
        var target = this.tokens.filter(function (t) { return t.name === name; });
        if (target.length > 0) {
            return target.map(function (r) { return r.result.value; });
        }
        else {
            return null;
        }
    };
    ResultTokens.prototype.raw = function (name) {
        return { name: name, raw: this.tokens.map(function (t) { return t.result.value; }).join() };
    };
    return ResultTokens;
}());
exports.ResultTokens = ResultTokens;
//# sourceMappingURL=ditto.ResultTokens.js.map