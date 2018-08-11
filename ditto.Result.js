"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result = /** @class */ (function () {
    function Result() {
        this.success = false;
        this.startloc = 0;
        this.endloc = 0;
        this.value = "";
        this.children = [];
        this.yielded = null;
    }
    Result.fault = function (input) {
        return {
            success: false,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: [],
            yielded: undefined
        };
    };
    Result.pass = function (input) {
        return {
            success: true,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: [],
            yielded: undefined,
        };
    };
    Result.composite = function () {
        var results = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            results[_i] = arguments[_i];
        }
        var result = new Result();
        result.success = results.map(function (r) { return r.success; }).reduce(function (p, c) { return p && c; });
        result.children = results;
        result.startloc = results[0].startloc;
        result.endloc = results[results.length - 1].endloc;
        result.yielded = results.map(function (r) { return r.yielded; }).filter(function (y) { return y !== undefined; });
        if (result.yielded.length === 0) {
            result.yielded = undefined;
        }
        return result;
    };
    return Result;
}());
exports.Result = Result;
//# sourceMappingURL=ditto.Result.js.map