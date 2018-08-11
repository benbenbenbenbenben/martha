"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ditto_1 = require("./ditto");
var Input = /** @class */ (function () {
    function Input(source) {
        this.tokens = new ditto_1.ResultTokens();
        this.tokenyielders = [];
        this.source = source;
        this.location = 0;
        this.state = 0;
    }
    Input.prototype.indexOf = function (pattern) {
        if (typeof (pattern) === "string") {
            return this.source.substr(this.location).indexOf(pattern);
        }
        else {
            var r = pattern.exec(this.source.substr(this.location));
            if (r === null) {
                return { index: -1 };
            }
            return { value: r[0], index: r.index, length: r[0].length };
        }
    };
    Input.prototype.begin = function (tokens) {
        this.tokens = tokens;
        this.tokenyielders = [];
        return this.location;
    };
    Input.prototype.end = function () {
        // do nothing
    };
    Input.prototype.rewind = function (loc) {
        this.location = loc;
        this.tokens.dropafter(loc);
    };
    Input.prototype.consume = function (predicate) {
        var startloc = this.location;
        var result = predicate(this);
        var output = ditto_1.Result.fault(this);
        if (result.success === false) {
            this.location = startloc;
        }
        else {
            this.location = result.endloc;
            if (predicate.__token__) {
                this.yieldtoken(predicate.__token__, result);
            }
            output = result;
        }
        return output;
    };
    Input.prototype.yieldtoken = function (name, result) {
        this.tokens.push(name, result);
    };
    return Input;
}());
exports.Input = Input;
//# sourceMappingURL=ditto.Input.js.map