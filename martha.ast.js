"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ditto_1 = require("./ditto");
var parse = ditto_1.Ditto.parse, token = ditto_1.Ditto.token, rule = ditto_1.Ditto.rule, all = ditto_1.Ditto.all, many = ditto_1.Ditto.many, optional = ditto_1.Ditto.optional, either = ditto_1.Ditto.either, flat = ditto_1.Ditto.flat;
var AST = /** @class */ (function () {
    function AST() {
    }
    AST.prefixop = function (result, cst) {
        return { op: "prefix", parameters: [result.tokens[0].name] };
    };
    AST.postfixop = function (result, cst) {
        return { op: "postfix", parameters: [result.tokens[0].name] };
    };
    AST.typedef = function (result, cst) {
        var types = cst[0][0][0][0].typenames.map(function (name) {
            var type = {
                name: name
            };
            if (result.one("basetypename")) {
                type.basetype = result.one("basetypename");
            }
            if (cst[1] && cst[1][0]) {
                var f = flat(cst);
                type.members = f.slice(1).filter(function (t) { return t && t.member; });
            }
            return type;
        });
        return {
            types: flat(types)
        };
    };
    AST.typedef_member = function (result, cst) {
        return { member: result.get("member").map(function (name) { return { name: name, type: result.one("typename") }; }) };
    };
    AST.typedef_name = function (result, cst) {
        return {
            typenames: result.get("typename")
        };
    };
    AST.atomparen = function (result, cst) {
        return {
            op: "parenthesis",
            parameters: cst ? flat(cst) : undefined
        };
    };
    AST.atomcall = function (result, cst) {
        return {
            op: "call",
            parameters: cst === undefined ? [
                result.get("member")
            ] : [
                result.get("member")
            ].concat(flat(cst))
        };
    };
    AST.atomliteral = function (result, cst) {
        return {
            op: "literal",
            parameters: [result.tokens[0].name, result.tokens[0].result.value]
        };
    };
    AST.atomarrliteral = function (result, cst) {
        return {
            op: "arrayliteral",
            parameters: cst === undefined ? [] : flat(cst)
        };
    };
    AST.atomobjliteral = function (result, cst) {
        return {
            op: "literal",
            parameters: result.get("member")
                ? ["object"].concat(result.get("member").map(function (m, i) { return { op: "assign", parameters: [m].concat(flat(cst)[i]) }; })) : ["object"]
        };
    };
    AST.atommember = function (result, cst) {
        return {
            op: "reference",
            parameters: result.get("member")
        };
    };
    AST.atom = function (result, cst) {
        return flat(cst);
    };
    AST.exp = function (result, cst) {
        if (result.tokens.length) {
            var ext = result.tokens.map(function (t, i) { return [{ op: t.name }, flat(cst)[i + 1]]; });
            return flat((_a = [cst[0]]).concat.apply(_a, ext));
        }
        return flat(cst);
        var _a;
    };
    AST.flatcst = function (result, cst) {
        return flat(cst);
    };
    AST.trap = function (r, c) {
        console.log(JSON.stringify(r, null, 2));
        console.log(JSON.stringify(c, null, 2));
        // tslint:disable-next-line:no-debugger
        debugger;
    };
    return AST;
}());
exports.AST = AST;
//# sourceMappingURL=martha.ast.js.map