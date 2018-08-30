"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tibu_1 = require("tibu");
const { parse, token, rule, all, many, optional, either } = tibu_1.Tibu;
const martha_emit_1 = require("./martha.emit");
const emit = martha_emit_1.Emit.Emit;
const flat = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
        acc.concat(flat(val)) : acc.concat(val), []);
};
class AST {
    static anyaccess(result, cst) {
        return emit(martha_emit_1.MethodAccess, {
            ispublic: !!result.one("public"),
            isprivate: !!result.one("private"),
            isinternal: !!result.one("internal"),
            isprotected: !!result.one("protected")
        });
    }
    static prefixop(result, cst) {
        return { op: "prefix", parameters: [result.tokens[0].name] };
    }
    static postfixop(result, cst) {
        return { op: "postfix", parameters: [result.tokens[0].name] };
    }
    static argumentsspec(result, cst) {
        let modcst = flat(cst);
        if (result.tokens.length) {
            if (result.one("dot")) {
                if (modcst[0] instanceof martha_emit_1.Reference) {
                    modcst[0].name = `this.${modcst[0].name}`;
                } // TODO: else error case
            }
            else {
                modcst.unshift({ op: result.tokens[0].name });
                modcst.unshift(emit(martha_emit_1.Reference, { name: "this" }));
            }
        }
        return { op: "argspec", parameters: [...modcst] };
    }
    static argumentdef(result, cst) {
        return {
            op: "argdef",
            type: result.one("typename"),
            name: result.one("varname"),
            spec: cst ? flat(cst) : [],
        };
    }
    static argumentdefs(result, cst) {
        return {
            op: "argdefs",
            parameters: flat(cst)
        };
    }
    static returndef(result, cst) {
        return {
            op: "returndef",
            parameters: cst
                ? [result.one("typename"), ...flat(cst)]
                : [result.one("typename")]
        };
    }
    static methoddef(result, cst) {
        return {
            def: "method",
            name: result.one("ctor") || result.one("name"),
            access: cst && flat(cst).find(x => x instanceof martha_emit_1.MethodAccess),
            async: result.get("async") !== null,
            atomic: result.get("atomic") !== null,
            critical: result.get("critical") !== null,
            arguments: cst && flat(flat(cst).filter((x) => x.op == "argdefs").map((x) => x.parameters)),
            return: cst && flat(cst).find((x) => x.op === "returndef"),
        };
    }
    static typedef(result, cst) {
        let types = flat(cst)
            .filter(x => x)
            .filter(x => x.name)
            .map((name) => {
            let type = {
                name: name.name[0]
            };
            flat(cst).filter(x => x).forEach(part => {
                if (part.basetype) {
                    type.basetype = part.basetype[0];
                }
                if (part.members) {
                    type.members = type.members ? [...type.members, ...part.members]
                        : [...part.members];
                }
            });
            return type;
        });
        return {
            types: flat(types)
        };
    }
    static typedef_member(result, cst) {
        return {
            members: flat(cst)
                .filter(x => x)
                .filter(x => x.reference)
                .map(x => {
                return {
                    type: result.one("typename"),
                    name: x.reference
                };
            })
        };
    }
    static typedef_name(result, cst) {
        return {
            name: result.get("typename")
        };
    }
    static typedef_basetype(result, cst) {
        return {
            basetype: result.get("typename")
        };
    }
    static atomparen(result, cst) {
        return {
            op: "parenthesis",
            parameters: cst ? flat(cst) : undefined
        };
    }
    static atomcall(result, cst) {
        return {
            op: "call",
            parameters: cst === undefined ? [
                result.get("member")
            ] : [
                result.get("member"),
                ...flat(cst)
            ]
        };
    }
    static atomliteral(result, cst) {
        return emit(martha_emit_1.Literal, {
            type: result.tokens[0].name,
            value: result.tokens[0].result.value
        });
    }
    static atomarrliteral(result, cst) {
        return {
            op: "arrayliteral",
            parameters: cst === undefined ? [] : flat(cst)
        };
    }
    static atomobjliteral(result, cst) {
        return {
            op: "literal",
            parameters: result.get("member")
                ? ["object", ...result.get("member").map((m, i) => { return { op: "assign", parameters: [m, ...flat(cst)[i]] }; })]
                : ["object"]
        };
    }
    static atommember(result, cst) {
        return flat(cst);
    }
    static atom(result, cst) {
        return flat(cst);
    }
    static exp(result, cst) {
        let output;
        if (result.tokens.length) {
            const ext = result.tokens.map((t, i) => [{ op: t.name }, flat(cst)[i + 1]]);
            output = flat([cst[0]].concat(...ext));
        }
        else {
            output = flat(cst);
        }
        if (output.length > 2) {
        }
        return output;
    }
    static flatcst(result, cst) {
        return flat(cst);
    }
    static reference(result, cst) {
        return emit(martha_emit_1.Reference, {
            name: result.get("member").join(".")
        });
    }
}
exports.AST = AST;
//# sourceMappingURL=martha.ast.js.map