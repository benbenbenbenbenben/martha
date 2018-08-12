"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ditto_Input_1 = require("./ditto.Input");
exports.Input = ditto_Input_1.Input;
var ditto_Result_1 = require("./ditto.Result");
exports.Result = ditto_Result_1.Result;
var ditto_ResultTokens_1 = require("./ditto.ResultTokens");
exports.ResultTokens = ditto_ResultTokens_1.ResultTokens;
var Ditto = /** @class */ (function () {
    function Ditto() {
    }
    Ditto.flat = function (arr) {
        return arr.reduce(function (a, b) { return a.concat(Array.isArray(b) ? Ditto.flat(b) : b); }, []);
    };
    Ditto.parse = function (source) {
        var input = new ditto_Input_1.Input(source);
        return function () {
            var rules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rules[_i] = arguments[_i];
            }
            for (var _a = 0, rules_1 = rules; _a < rules_1.length; _a++) {
                var rule = rules_1[_a];
                if (Ditto.parserule(input, rule) === false) {
                    break;
                }
            }
            return null;
        };
    };
    Ditto.parserule = function (input, rule) {
        if (rule.breakonentry) {
            // tslint:disable-next-line:no-debugger
            debugger;
        }
        var tokens = new ditto_ResultTokens_1.ResultTokens();
        var ref = input.begin(tokens);
        var x;
        var matches = [];
        for (var _i = 0, rule_1 = rule; _i < rule_1.length; _i++) {
            var predicate = rule_1[_i];
            x = input.consume(predicate);
            matches.push(x);
            if (x.success === false) {
                break;
            }
        }
        if (x.success === false) {
            input.rewind(ref);
            return false;
        }
        // console.log(JSON.stringify(matches, null, 2));
        input.end();
        if (rule.yielder) {
            rule.yielder(tokens, matches.map(function (match) { return match.yielded; }));
        }
        return true;
        // rule(...matches);
    };
    Ditto.rule = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var predicates = Ditto.ensurePredicates.apply(Ditto, patterns);
        predicates.__rule__ = true;
        predicates.yields = function (handler) {
            predicates.yielder = handler;
            return predicates;
        };
        predicates.passes = function (source, expected) {
            Ditto.tests.push(function () {
                var result = null;
                Ditto.parse(source)(Ditto.rule(predicates).yields(function (r, c) {
                    result = c[0];
                    return null;
                }));
                return { expected: expected, actual: result, source: predicates.toString() };
            });
            return predicates;
        };
        return predicates;
    };
    Ditto.debugrule = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var thisrule = Ditto.rule.apply(Ditto, patterns);
        thisrule.breakonentry = true;
        return thisrule;
    };
    Ditto.ensurePredicates = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return patterns.map(function (pattern) {
            var predicate = null;
            switch (pattern.__proto__.constructor.name) {
                case "String":
                    predicate = function (input) {
                        var ix = input.indexOf(pattern);
                        var success = ix === 0;
                        var startloc = input.location;
                        var endloc = input.location + pattern.length;
                        return {
                            success: success,
                            startloc: startloc,
                            endloc: endloc,
                            value: pattern,
                            children: [],
                            yielded: undefined // pattern
                        };
                    };
                    predicate.toString = function () {
                        return "string:" + pattern;
                    };
                    return predicate;
                case "RegExp":
                    predicate = function (input) {
                        var rxix = input.indexOf(pattern);
                        var success = rxix.index === 0;
                        var startloc = input.location;
                        var endloc = input.location + rxix.length;
                        return {
                            success: success,
                            startloc: startloc,
                            endloc: endloc,
                            value: rxix.value,
                            children: [],
                            yielded: undefined // rxix.value
                        };
                    };
                    predicate.toString = function () {
                        return "regex:" + pattern.toString();
                    };
                    return predicate;
                case "Function":
                    return pattern;
                // subrule case, trampoline time!
                case "Array":
                    predicate = function (input) {
                        if (pattern.breakonentry) {
                            // tslint:disable-next-line:no-debugger
                            debugger;
                        }
                        if (pattern.yielder) {
                            var frozentokens = input.tokens;
                            input.tokens = new ditto_ResultTokens_1.ResultTokens();
                            var result = Ditto.all.apply(Ditto, pattern)(input);
                            if (result.success) {
                                var subruleyield = pattern.yielder(input.tokens, result.yielded);
                                result.yielded = subruleyield;
                            }
                            input.tokens = frozentokens;
                            return result;
                        }
                        else {
                            return Ditto.all.apply(Ditto, pattern)(input);
                        }
                    };
                    predicate.toString = function () {
                        return "pred:" + pattern.map(function (p) { return p.toString(); }).join("/");
                    };
                    return predicate;
                default:
                    throw new Error("oops");
            }
        });
    };
    Ditto.all = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return function (input) {
            var location = input.location;
            var consumed = [];
            var fault = false;
            for (var _i = 0, _a = Ditto.ensurePredicates.apply(Ditto, patterns); _i < _a.length; _i++) {
                var pattern = _a[_i];
                var nxt = input.consume(pattern);
                if (nxt.success) {
                    consumed.push(nxt);
                }
                else {
                    input.rewind(location);
                    // input.unconsume(...consumed);
                    fault = true;
                    break;
                }
            }
            if (fault) {
                return ditto_Result_1.Result.fault(input);
            }
            else {
                return ditto_Result_1.Result.composite.apply(ditto_Result_1.Result, consumed);
            }
        };
    };
    Ditto.optional = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return function (input) {
            var outcome = Ditto.all.apply(Ditto, patterns)(input);
            if (outcome.success) {
                return outcome;
            }
            else {
                return ditto_Result_1.Result.pass(input);
            }
        };
    };
    Ditto.either = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return function (input) {
            var outcome = ditto_Result_1.Result.fault(input);
            for (var _i = 0, _a = Ditto.ensurePredicates.apply(Ditto, patterns); _i < _a.length; _i++) {
                var pattern = _a[_i];
                var current = input.consume(pattern);
                if (current.success) {
                    outcome = current;
                    break;
                }
            }
            return outcome;
        };
    };
    Ditto.many = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var many = function (input) {
            var location;
            var consumed = [];
            var current;
            var nothingleft = false;
            while (true) {
                location = input.location;
                current = Ditto.all.apply(Ditto, patterns)(input);
                if (current.success) {
                    consumed.push(current);
                }
                else {
                    nothingleft = true;
                }
                // stalled
                if (input.location === location || nothingleft) {
                    break;
                }
            }
            if (consumed.length === 0) {
                consumed = [ditto_Result_1.Result.pass(input)];
            }
            return ditto_Result_1.Result.composite.apply(ditto_Result_1.Result, consumed);
        };
        many.toString = function () {
            return "many:" + patterns.map(function (p) { return p.toString(); }).join("/");
        };
        return many;
    };
    Ditto.token = function (name, pattern) {
        var func = Ditto.ensurePredicates(pattern);
        func[0].__token__ = name;
        return func[0];
    };
    Ditto.tests = [];
    return Ditto;
}());
exports.Ditto = Ditto;
//# sourceMappingURL=ditto.js.map