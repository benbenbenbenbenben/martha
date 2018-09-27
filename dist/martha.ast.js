"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="tibu.d.ts">
const tibu_1 = require("tibu");
const { parse, token, rule, all, many, optional, either } = tibu_1.Tibu;
const martha_emit_1 = require("./martha.emit");
const martha_grammar_1 = require("./martha.grammar");
const emit = martha_emit_1.Emit.Emit;
const flat = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
        acc.concat(flat(val)) : acc.concat(val), []);
};
const isa = (T) => (x) => {
    return x instanceof T;
};
const namedmany = (cst, name) => {
    const fcst = flat(cst);
    return fcst.filter(x => x.named === name);
};
const named = (cst, name) => {
    return namedmany(cst, name).length > 0 ? namedmany(cst, name)[0] : undefined;
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
                modcst.unshift(emit(martha_emit_1.Reference, {
                    name: {
                        value: "this",
                        index: result.tokens[0].result.startloc
                    }
                }));
            }
        }
        return modcst;
    }
    static argumentdef(result, cst) {
        let argspec = named(flat(cst), "argspec");
        return emit(martha_emit_1.ArgumentDef, {
            name: result.one("varname"),
            type: cst ? flat(cst).filter(isa(martha_emit_1.TypeRef)) : [],
            spec: argspec ? flat(argspec.cst) : []
        });
    }
    static argumentdefs(result, cst) {
        return {
            op: "argdefs",
            parameters: flat(cst)
        };
    }
    static returndef(result, cst) {
        let argspec = named(flat(cst), "argspec");
        return emit(martha_emit_1.ReturnDef, {
            type: flat(cst)[0],
            spec: argspec ? flat(argspec.cst) : []
        });
    }
    static methoddef(result, cst) {
        let fcst = flat(cst);
        let accessors = named(fcst, "accessors");
        let returndef = cst && flat(cst).find((x) => x instanceof martha_emit_1.ReturnDef);
        return emit(martha_emit_1.MethodDef, {
            // TODO: new Token s/c because unknown definitily typed behaviour around ||
            name: result.one("ctor") || result.one("name") || new martha_emit_1.Token(),
            attributes: cst && flat(cst).filter(isa(martha_emit_1.Attribute)),
            accessors: accessors.result.tokens.map((t) => emit(martha_emit_1.Token, { value: t.result.value, index: t.result.startloc })),
            arguments: cst ? flat(flat(cst).filter((x) => x.op == "argdefs").map((x) => x.parameters)) : [],
            body: cst ? flat(cst).filter((x) => x instanceof martha_emit_1.Statement) : [],
            return: returndef,
        });
    }
    static typedef(result, cst) {
        let fcst = flat(cst);
        let basetype = named(fcst, "basetype");
        let types = fcst
            .filter(x => x)
            .filter(t => t.typename)
            .map((name) => {
            return name.typename.map((name) => {
                let type = {
                    name,
                    basetype: basetype ? flat(basetype.cst)[0] : undefined
                };
                type.members = fcst.filter(isa(martha_emit_1.MemberDef));
                type.methods = fcst.filter(isa(martha_emit_1.MethodDef));
                return emit(martha_emit_1.TypeDef, type);
            });
        });
        return flat(types);
    }
    static typedef_index(result, cst) {
        //console.log(flat(flat(namedmany(cst, "types"))[0].cst))
        let ref = emit(martha_emit_1.TypeRef, {
            nameref: cst ? flat(namedmany(cst, "name").map(c => c.cst)) : undefined,
            types: cst ? flat(namedmany(cst, "types").map(c => AST.typedef_index(result, c.cst))) : undefined,
            indexer: cst ? flat(namedmany(cst, "indexer").map(c => AST.typedef_index(result, c.cst || []))) : undefined,
        });
        return ref;
        // return cst ? (result.get("typename") || []).concat([{index:flat(cst)}]) : result.get("typename")
    }
    static typedef_type(result, cst) {
        return AST.typedef_index(result, cst);
    }
    static typedef_member(result, cst) {
        // TODO: memberdef type
        let fcst = flat(cst).filter(x => x);
        return fcst
            .filter(isa(martha_emit_1.Reference))
            .map(x => emit(martha_emit_1.MemberDef, {
            type: fcst[0],
            name: x.name,
            getter: named(fcst, "getter") ? named(fcst, "getter").cst : [],
            setter: named(fcst, "setter") ? named(fcst, "setter").cst : [],
        }));
    }
    static typedef_name(result, cst) {
        return {
            typename: result.get("typename")
        };
    }
    static atomlambdaliteral(result, cst) {
        const spec = named(cst, "spec");
        const body = named(cst, "body");
        let lambda = emit(martha_emit_1.Lambda, {
            name: spec.result.tokens[0].result.value,
            accessors: [],
            arguments: [],
            body: flat(body.cst),
            return: emit(martha_emit_1.ReturnDef, {
                type: emit(martha_emit_1.TypeRef, {}),
                spec: []
            })
        });
        return lambda;
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
            value: { value: result.tokens[0].result.value, index: result.tokens[0].result.startloc }
        });
    }
    static atomarrliteral(result, cst) {
        return {
            op: "arrayliteral",
            parameters: cst === undefined ? [] : flat(cst)
        };
    }
    /*
    static atomobjliteral(result:ResultTokens, cst:any):any {
        return {
            op:"literal",
            parameters: result.get("member")
            ? ["object", ...result.get("member").map((m:string,i:any) => { return { op:"assign", parameters:[m, ...flat(cst)[i]] };})]
            : ["object"]
        };
    }
    */
    static atommember(result, cst) {
        return flat(cst);
    }
    static atom(result, cst) {
        let f = flat(cst);
        if (f.length > 1) {
            //return { apply: f.slice(1), to: f[0] }
            return f.reduce((a, b) => emit(martha_emit_1.Apply, { apply: b, to: a }));
        }
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
        return cst ? flat(cst) : [];
    }
    static reference(result, cst) {
        return emit(martha_emit_1.Reference, {
            name: {
                value: result.get("member").map(v => v.value).join("."),
                index: result.one("member").index
            }
        });
    }
    static push(result, cst) {
        return "push";
    }
    static pop(result, cst) {
        return "pop";
    }
    static pushed(result, cst) {
        console.log(cst);
        let depth = flat(cst).filter(x => x === "push").length;
        let r = flat(cst).filter(x => x !== "push" && !x.target);
        while (depth--) {
            r = { accessor: r };
        }
        return r;
    }
    static popped(result, cst) {
        let depth = flat(cst).filter(x => x === "pop").length;
        return flat(cst).filter(x => x !== "pop");
    }
    static target(result, cst) {
        return { target: flat(cst) };
    }
    static bracketparen(result, cst) {
        return emit(martha_emit_1.BracketParen, {
            statements: cst ? flat(cst) : []
        });
    }
    static bracketarray(result, cst) {
        return emit(martha_emit_1.BracketArray, {
            statements: cst ? flat(cst) : []
        });
    }
    static bracketcurly(result, cst) {
        return emit(martha_emit_1.BracketCurly, {
            statements: cst ? flat(cst) : []
        });
    }
    static commaexpr(result, cst) {
        let fcst = flat(cst);
        return fcst;
    }
    static calluser(result, cst) {
        let fcst = flat(cst);
        return { call: fcst[0], with: fcst.slice(1) };
    }
    static call(result, cst) {
        let fcst = flat(cst);
        return { call: result.tokens[0].name, with: fcst };
    }
    static binaryexpr(result, cst) {
        if (flat(cst).length === 1)
            return flat(cst);
        if (result.tokens.length < 1) {
            return flat(cst);
        }
        return flat(cst).slice(1).reduce((left, right) => {
            let op = new martha_grammar_1.Op();
            switch (result.tokens.shift().name) {
                case op.dot.__token__: return (isa(martha_emit_1.Reference)(left) && isa(martha_emit_1.Reference)(right))
                    ? emit(martha_emit_1.Reference, {
                        name: emit(martha_emit_1.Token, {
                            value: `${left.name.value}.${right.name.value}`,
                            index: left.name.index
                        })
                    })
                    : emit(martha_emit_1.Dot, { left, right });
                case op.ques.__token__: return emit(martha_emit_1.QuesBin, { left, right });
                case op.colon.__token__: return emit(martha_emit_1.ColonBin, { left, right });
                case op.mult.__token__: return emit(martha_emit_1.Mult, { left, right });
                case op.power.__token__: return emit(martha_emit_1.Power, { left, right });
                case op.div.__token__: return emit(martha_emit_1.Div, { left, right });
                case op.mod.__token__: return emit(martha_emit_1.Mod, { left, right });
                case op.plus.__token__: return emit(martha_emit_1.Plus, { left, right });
                case op.minus.__token__: return emit(martha_emit_1.Minus, { left, right });
                case op.shiftleft.__token__: return emit(martha_emit_1.ShiftLeft, { left, right });
                case op.shiftright.__token__: return emit(martha_emit_1.ShiftRight, { left, right });
                case op.lt.__token__: return emit(martha_emit_1.Lt, { left, right });
                case op.lte.__token__: return emit(martha_emit_1.Lte, { left, right });
                case op.gt.__token__: return emit(martha_emit_1.Gt, { left, right });
                case op.gte.__token__: return emit(martha_emit_1.Gte, { left, right });
                case op.eqeq.__token__: return emit(martha_emit_1.EqEq, { left, right });
                case op.noteq.__token__: return emit(martha_emit_1.NotEq, { left, right });
                case op.amp.__token__: return emit(martha_emit_1.Amp, { left, right });
                case op.caret.__token__: return emit(martha_emit_1.Caret, { left, right });
                case op.pipe.__token__: return emit(martha_emit_1.Pipe, { left, right });
                case op.ampamp.__token__: return emit(martha_emit_1.AmpAmp, { left, right });
                case op.pipepipe.__token__: return emit(martha_emit_1.PipePipe, { left, right });
                case op.assign.__token__: return emit(martha_emit_1.Assignment, { left, right });
                case op.pluseq.__token__: return emit(martha_emit_1.PlusEq, { left, right });
                case op.minuseq.__token__: return emit(martha_emit_1.MinusEq, { left, right });
                case op.multeq.__token__: return emit(martha_emit_1.MultEq, { left, right });
                case op.diveq.__token__: return emit(martha_emit_1.DivEq, { left, right });
                case op.modeq.__token__: return emit(martha_emit_1.ModEq, { left, right });
                case op.shreq.__token__: return emit(martha_emit_1.ShREq, { left, right });
                case op.shleq.__token__: return emit(martha_emit_1.ShLEq, { left, right });
                case op.ampeq.__token__: return emit(martha_emit_1.AmpEq, { left, right });
                case op.careteq.__token__: return emit(martha_emit_1.CaretEq, { left, right });
                case op.pipeeq.__token__: return emit(martha_emit_1.PipeEq, { left, right });
                case op.powereq.__token__: return emit(martha_emit_1.PowerEq, { left, right });
                case op.range.__token__: return emit(martha_emit_1.Range, { left, right });
            }
        }, flat(cst)[0]);
    }
    static postfixexpr(result, cst) {
        if (result.tokens.length) {
            let op = new martha_grammar_1.Op();
            switch (result.tokens[0].name) {
                case op.arrow.__token__: return emit(martha_emit_1.Arrow, { value: flat(cst)[0] });
                // case op.dot.__token__: return emit(Dot, { value: flat(cst)[0]})
                // case op.conditionaldot.__token__: return emit(ConditionalDot, { value: flat(cst)[0]})
                case op.plusplus.__token__: return emit(martha_emit_1.PlusPlus_Postfix, { value: flat(cst)[0] });
                case op.minusminus.__token__: return emit(martha_emit_1.MinusMinus_Postfix, { value: flat(cst)[0] });
            }
        }
        return flat(cst);
    }
    static prefixexpr(result, cst) {
        let op = new martha_grammar_1.Op();
        let mcro = new martha_grammar_1.Mcro();
        // return result.tokens.length
        if (result.tokens.length) {
            switch (result.tokens[0].name) {
                case op.plusplus.__token__: return emit(martha_emit_1.PlusPlus, { value: flat(cst)[0] });
                case op.minusminus.__token__: return emit(martha_emit_1.MinusMinus, { value: flat(cst)[0] });
                case op.plus.__token__: return emit(martha_emit_1.Plus_Prefix, { value: flat(cst)[0] });
                case op.minus.__token__: return emit(martha_emit_1.Minus_Prefix, { value: flat(cst)[0] });
                case op.exc.__token__: return emit(martha_emit_1.Exc, { value: flat(cst)[0] });
                case op.tilde.__token__: return emit(martha_emit_1.Tilde, { value: flat(cst)[0] });
                case op.splat.__token__: return emit(martha_emit_1.Splat, { value: flat(cst)[0] });
                case op.dot.__token__: return emit(martha_emit_1.Dot_Prefix, { value: flat(cst)[0] });
                case mcro._typeof.__token__: return emit(martha_emit_1.TypeOf, { value: flat(cst)[0] });
                case mcro._addrof.__token__: return emit(martha_emit_1.AddrOf, { value: flat(cst)[0] });
                case mcro._sizeof.__token__: return emit(martha_emit_1.SizeOf, { value: flat(cst)[0] });
                case mcro.stateof.__token__: return emit(martha_emit_1.StateOf, { value: flat(cst)[0] });
                case mcro.swapto.__token__: return emit(martha_emit_1.SwapTo, { value: flat(cst)[0] });
                case mcro._new.__token__: return emit(martha_emit_1.New, { value: flat(cst)[0] });
                case mcro.delete.__token__: return emit(martha_emit_1.Delete, { value: flat(cst)[0] });
                case mcro.return.__token__: return emit(martha_emit_1.Return, { value: flat(cst)[0] });
            }
        }
        return flat(cst);
    }
    static thisref(result, cst) {
        return emit(martha_emit_1.Reference, {
            name: emit(martha_emit_1.Token, {
                value: "this",
                index: result.tokens[0].result.startloc
            })
        });
    }
    static statement(result, cst) {
        if (cst === undefined) {
            return;
        }
        return emit(martha_emit_1.Statement, { statement: flat(cst) });
    }
    static macrodef(result, cst) {
        let fcst = flat(cst);
        let name = named(fcst, "name").result.one("member") || named(fcst, "name").result.one("string").match(/.(.*)./)[1];
        let rules = fcst.filter(isa(martha_emit_1.MacroRuleDef));
        let macro = emit(martha_emit_1.MacroDef, { name, rules });
        console.log(macro);
        return macro;
    }
    static macrorule(result, cst) {
        let fcst = flat(cst);
        return emit(martha_emit_1.MacroRuleDef, { rule: [fcst[0]], body: fcst.slice(1) });
    }
    static importdef(result, cst) {
        return emit(martha_emit_1.ImportDef, { name: flat(cst).find(x => isa(martha_emit_1.Reference)(x)).name });
    }
    static expandmacro(macro) {
        return (result, cst) => {
            console.log("### TRAPPED MACRO", result, cst);
            return 1;
        };
    }
    static attribute(result, cst) {
        return emit(martha_emit_1.Attribute, {
            body: flat(cst)
        });
    }
    static ifexp(result, cst) {
        let fcst = flat(cst);
        let _if = named(fcst, "if");
        let _else = named(fcst, "else");
        let tif = emit(martha_emit_1.IfExp, {
            expression: emit(martha_emit_1.Statement, { statement: [flat(_if.cst)[0]] }),
            body: flat(_if.cst).slice(1).map(e => emit(martha_emit_1.Statement, { statement: [e] }))
        });
        let _elsifs = namedmany(fcst, "elseif")
            .map(c => AST.ifexp(result, c.cst))
            .reduce((pre, cur) => {
            pre.altbody = [emit(martha_emit_1.Statement, { statement: [cur] })];
            return cur;
        }, tif);
        if (_else)
            _elsifs.altbody = [emit(martha_emit_1.Statement, { statement: flat(_else.cst) })];
        return tif;
    }
}
exports.AST = AST;
//# sourceMappingURL=martha.ast.js.map