"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tibu_1 = require("tibu");
var parse = tibu_1.Tibu.parse, token = tibu_1.Tibu.token, rule = tibu_1.Tibu.rule, all = tibu_1.Tibu.all, many = tibu_1.Tibu.many, optional = tibu_1.Tibu.optional, either = tibu_1.Tibu.either, flat = tibu_1.Tibu.flat;
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
        var types = flat(cst)
            .filter(function (x) { return x; })
            .filter(function (x) { return x.name; })
            .map(function (name) {
            var type = {
                name: name.name[0]
            };
            flat(cst).filter(function (x) { return x; }).forEach(function (part) {
                if (part.basetype) {
                    type.basetype = part.basetype[0];
                }
                if (part.members) {
                    type.members = type.members ? type.members.concat(part.members) : part.members.slice();
                }
            });
            return type;
        });
        return {
            types: flat(types)
        };
    };
    AST.typedef_member = function (result, cst) {
        return {
            members: flat(cst)
                .filter(function (x) { return x; })
                .filter(function (x) { return x.reference; })
                .map(function (x) {
                return {
                    type: result.one("typename"),
                    name: x.reference
                };
            })
        };
    };
    AST.typedef_name = function (result, cst) {
        return {
            name: result.get("typename")
        };
    };
    AST.typedef_basetype = function (result, cst) {
        return {
            basetype: result.get("typename")
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
    AST.reference = function (result, cst) {
        return { reference: result.get("member").join(".") };
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