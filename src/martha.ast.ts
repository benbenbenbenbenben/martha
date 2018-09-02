/// <reference path="tibu.d.ts">
import { Tibu, Result, ResultTokens, Input, IRule, IToken, Pattern, IRuleAction } from "tibu";
const { parse, token, rule, all, many, optional, either } = Tibu;

import { Emit, MethodAccess, Literal, Reference, Assignment, PlusEq, MinusEq, MultEq, DivEq, ModEq, ShREq, ShLEq, AmpEq, CaretEq, PipeEq, PowerEq, Mult, Power, Div, Mod, Plus, Minus, ShiftLeft, ShiftRight, Lt, Lte, Gt, Gte, EqEq, NotEq, Amp, Caret, Pipe, AmpAmp, PipePipe, MinusMinus, PlusPlus, Plus_Prefix, Minus_Prefix, Exc, Tilde, Splat, TypeOf, AddrOf, SizeOf, StateOf, SwapTo, New, Delete, Return, Arrow, Dot, ConditionalDot, PlusPlus_Postfix, MinusMinus_Postfix, Dot_Prefix, ReturnDef, ArgumentDef, Statement, MethodDef, List, MacroDef, ImportDef, TypeDef, Lambda } from "./martha.emit";
import { Op, Mcro } from "./martha.grammar";
const emit = Emit.Emit

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

const isa = (T:any) => (x:any): boolean => {
    return x instanceof T
}

const named = (cst:any[], name:string) => {
    const fcst = flat(cst)
    return fcst.find(x => x.named === name)
}

class AST {
    static anyaccess(result:ResultTokens, cst:any):any {
        return emit(MethodAccess, {
            ispublic: !!result.one("public"),
            isprivate: !!result.one("private"),
            isinternal: !!result.one("internal"),
            isprotected: !!result.one("protected")
        })
    }

    static prefixop(result:ResultTokens, cst:any):any {
        return { op: "prefix", parameters: [result.tokens[0].name] };
    }

    static postfixop(result:ResultTokens, cst:any):any {
        return { op: "postfix", parameters: [result.tokens[0].name] };
    }

    static argumentsspec(result:ResultTokens, cst:any):any {
        let modcst = flat(cst)
        if (result.tokens.length) {
            if (result.one("dot")) {
                if (modcst[0] instanceof Reference) {
                    modcst[0].name = `this.${modcst[0].name}`
                } // TODO: else error case
            } else {
                modcst.unshift({ op: result.tokens[0].name })
                modcst.unshift(emit<Reference>(Reference,{name:"this"}))
            }
        }
        return modcst
    }

    static argumentdef(result:ResultTokens, cst:any):any {
        return emit(ArgumentDef, {
                type: result.one("typename"),
                name: result.one("varname"),
                spec: cst ? flat(flat(cst).filter(isa(Statement)).map(x => x.statement)) : [],
            })
    }

    static argumentdefs(result:ResultTokens, cst:any):any {
        return {
            op: "argdefs",
            parameters: flat(cst)
        }
    }

    static returndef(result:ResultTokens, cst:any):ReturnDef {
        return emit(ReturnDef, { 
            type: result.one("typename"),
            spec: cst ? flat(flat(cst).filter(isa(Statement)).map(x => x.statement)) : [] 
        })
    }

    static methoddef(result:ResultTokens, cst:any):MethodDef {
        return emit(MethodDef, {
            name: result.one("ctor") || result.one("name"),
            access: cst && flat(cst).find(x => x instanceof MethodAccess),
            async: result.get("async") !== null,
            atomic: result.get("atomic") !== null,
            critical: result.get("critical") !== null,
            arguments: cst ? flat(flat(cst).filter((x:any) => x.op == "argdefs").map((x:any) => x.parameters)) : [],
            body: cst ? flat(cst).filter((x:any) => x instanceof Statement) : [],
            return: cst && flat(cst).find((x:any) => x instanceof ReturnDef),
        })
    }

    static typedef(result:ResultTokens, cst:any):any {
        const fcst = flat(cst)
        let types:any[] = fcst
            .filter(x => x)
            .filter(x => x.name)
            .map((name:any) => {
                return [...name.name].map((name:string) => {
                    let type:any = {
                        name
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
                    type.methods = fcst.filter(x => isa(MethodDef)(x))
                    return emit(TypeDef, type);
                })
            }
        );
        return flat(types)
    }

    static typedef_member(result:ResultTokens, cst:any):any {
        return {
            members: flat(cst)
                    .filter(x => isa(Reference)(x))
                    .map(x => {
                        return {
                            type: result.one("typename"),
                            name: x.name
                        };
                    })
        };
    }

    static typedef_name(result:ResultTokens, cst:any):any {
        return {
            name: result.get("typename")
        };
    }

    static typedef_basetype(result:ResultTokens, cst:any):any {
        return {
            basetype: result.get("typename")
        };
    }

    static atomlambdaliteral(result:ResultTokens, cst:any):Lambda {
        const spec = named(cst, "spec")
        const body = named(cst, "body")

        let lambda = emit(Lambda, {
            name: spec.result.tokens[0].result.value,
            access: undefined,
            async: false,
            atomic: false,
            critical: false,
            arguments: [],
            body: flat(body.cst),
            return: emit(ReturnDef, { type: "computed", spec: "computed" })
        })
        
        return lambda
    }

    static atomparen(result:ResultTokens, cst:any):any {
        return {
            op: "parenthesis",
            parameters: cst ? flat(cst) : undefined
        };
    }

    static atomcall(result:ResultTokens, cst:any):any {
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

    static atomliteral(result:ResultTokens, cst:any):any {
        return emit<Literal>(Literal, {
            type: result.tokens[0].name,
            value: result.tokens[0].result.value
        })
    }

    static atomarrliteral(result:ResultTokens, cst:any):any {
        return {
            op:"arrayliteral",
            parameters: cst === undefined ? [] : flat(cst)
        };
    }

    static atomobjliteral(result:ResultTokens, cst:any):any {
        return {
            op:"literal",
            parameters: result.get("member")
            ? ["object", ...result.get("member").map((m:string,i:any) => { return { op:"assign", parameters:[m, ...flat(cst)[i]] };})]
            : ["object"]
        };
    }

    static atommember(result:ResultTokens, cst:any):any {
        return flat(cst);
    }

    static atom(result:ResultTokens, cst:any):any {
        let f = flat(cst)
        if (f.length > 1) {
            //return { apply: f.slice(1), to: f[0] }
            return f.reduce((a,b) => { return { apply: b, to: a } })
        }
        return flat(cst);
    }

    static exp(result:ResultTokens, cst:any):any {
        let output
        if (result.tokens.length) {
            const ext:any = result.tokens.map((t, i) => [{op:t.name}, flat(cst)[i + 1]]);
            output = flat([cst[0]].concat(...ext));
        } else {
            output = flat(cst)
        }
        
        if (output.length > 2) {
            
        }

        return output
    }

    static flatcst(result:ResultTokens, cst:any):any {
        return cst ? flat(cst) : []
    }

    static reference(result:ResultTokens, cst:any):any {
        return emit<Reference>(Reference, {
            name: result.get("member").join(".")
        })
    }

    static push(result:ResultTokens, cst:any):any {
        return "push"
    }

    static pop(result:ResultTokens, cst:any):any {
        return "pop"
    }

    static pushed(result:ResultTokens, cst:any):any {
        console.log(cst)
        let depth = flat(cst).filter(x => x === "push").length
        let r:any = flat(cst).filter(x => x !== "push" && !x.target)
        while (depth--) {
            r = { accessor: r }
        }
        return r
    }

    static popped(result:ResultTokens, cst:any):any {
        let depth = flat(cst).filter(x => x === "pop").length
        return flat(cst).filter(x => x !== "pop")
    }

    static target(result:ResultTokens, cst:any): any {
        return { target: flat(cst) }
    }

    static bracketparen(result:ResultTokens, cst:any):any {
        return { bracketparen: cst ? flat(cst) : [] }
    }
    static bracketarray(result:ResultTokens, cst:any):any {
        return { bracketarray: cst ? flat(cst) : [] }
    }
    static bracketcurly(result:ResultTokens, cst:any):any {
        return { bracketcurly: cst ? flat(cst) : [] }
    }

    static commaexpr(result:ResultTokens, cst:any):any {
        let fcst = flat(cst)
        return fcst
    }

    static calluser(result:ResultTokens, cst:any): any {
        let fcst = flat(cst)
        return { call: fcst[0], with: fcst.slice(1) }
    }

    static call(result:ResultTokens, cst:any):any {
        let fcst = flat(cst)
        return { call: result.tokens[0].name, with: fcst }
    }

    static binaryexpr(result:ResultTokens, cst:any):any {
        if (flat(cst).length === 1)
            return flat(cst)
        if (result.tokens.length < 1) {
            return flat(cst)
        }
        return flat(cst).slice(1).reduce(
            (left, right) => {
                let op = new Op()
                switch(result.tokens[0].name) {
                    case op.dot.__token__: return (isa(Reference)(left) && isa(Reference)(right))
                        ? emit(Reference, { name: `${left.name}.${right.name}`}) 
                        : emit(Dot, { left, right })
                    case op.mult.__token__: return emit(Mult, { left, right })
                    case op.power.__token__: return emit(Power, { left, right })
                    case op.div.__token__: return emit(Div, { left, right })
                    case op.mod.__token__: return emit(Mod, { left, right })
                    case op.plus.__token__: return emit(Plus, { left, right })
                    case op.minus.__token__: return emit(Minus, { left, right })
                    case op.shiftleft.__token__: return emit(ShiftLeft, { left, right })
                    case op.shiftright.__token__: return emit(ShiftRight, { left, right })
                    case op.lt.__token__: return emit(Lt, { left, right })
                    case op.lte.__token__: return emit(Lte, { left, right })
                    case op.gt.__token__: return emit(Gt, { left, right })
                    case op.gte.__token__: return emit(Gte, { left, right })
                    case op.eqeq.__token__: return emit(EqEq, { left, right })
                    case op.noteq.__token__: return emit(NotEq, { left, right })
                    case op.amp.__token__: return emit(Amp, { left, right })
                    case op.caret.__token__: return emit(Caret, { left, right })
                    case op.pipe.__token__: return emit(Pipe, { left, right })
                    case op.ampamp.__token__: return emit(AmpAmp, { left, right })
                    case op.pipepipe.__token__: return emit(PipePipe, { left, right })
                    case op.assign.__token__: return emit(Assignment, { left, right })
                    case op.pluseq.__token__: return emit(PlusEq, { left, right})
                    case op.minuseq.__token__: return emit(MinusEq, { left, right})
                    case op.multeq.__token__: return emit(MultEq, { left, right})
                    case op.diveq.__token__: return emit(DivEq, { left, right})
                    case op.modeq.__token__: return emit(ModEq, { left, right})
                    case op.shreq.__token__: return emit(ShREq, { left, right})
                    case op.shleq.__token__: return emit(ShLEq, { left, right})
                    case op.ampeq.__token__: return emit(AmpEq, { left, right})
                    case op.careteq.__token__: return emit(CaretEq, { left, right})
                    case op.pipeeq.__token__: return emit(PipeEq, { left, right})
                    case op.powereq.__token__: return emit(PowerEq, { left, right})
                }
            }
            , flat(cst)[0]
        )
    }

    static postfixexpr(result:ResultTokens, cst:any):any {    
        if (result.tokens.length) {
            let op = new Op()
            switch(result.tokens[0].name) {
                case op.arrow.__token__: return emit(Arrow, { value: flat(cst)[0]})
                // case op.dot.__token__: return emit(Dot, { value: flat(cst)[0]})
                // case op.conditionaldot.__token__: return emit(ConditionalDot, { value: flat(cst)[0]})
                case op.plusplus.__token__: return emit(PlusPlus_Postfix, { value: flat(cst)[0]})
                case op.minusminus.__token__: return emit(MinusMinus_Postfix, { value: flat(cst)[0]})
            }
        }        
        return flat(cst)
    }

    static prefixexpr(result:ResultTokens, cst:any):any {
        let op = new Op()
        let mcro = new Mcro()
       // return result.tokens.length
        if (result.tokens.length) {
            switch(result.tokens[0].name) {
                case op.plusplus.__token__: return emit(PlusPlus, { value: flat(cst)[0] })
                case op.minusminus.__token__: return emit(MinusMinus, { value: flat(cst)[0] })
                case op.plus.__token__: return emit(Plus_Prefix, { value: flat(cst)[0] })
                case op.minus.__token__: return emit(Minus_Prefix, { value: flat(cst)[0] })
                case op.exc.__token__: return emit(Exc, { value: flat(cst)[0] })
                case op.tilde.__token__: return emit(Tilde, { value: flat(cst)[0] })
                case op.splat.__token__: return emit(Splat, { value: flat(cst)[0] })
                case op.dot.__token__: return emit(Dot_Prefix, { value: flat(cst)[0] })
                case mcro._typeof.__token__: return emit(TypeOf, { value: flat(cst)[0] })
                case mcro._addrof.__token__: return emit(AddrOf, { value: flat(cst)[0] })
                case mcro._sizeof.__token__: return emit(SizeOf, { value: flat(cst)[0] })
                case mcro.stateof.__token__: return emit(StateOf, { value: flat(cst)[0] })
                case mcro.swapto.__token__: return emit(SwapTo, { value: flat(cst)[0] })
                case mcro._new.__token__: return emit(New, { value: flat(cst)[0] })
                case mcro.delete.__token__: return emit(Delete, { value: flat(cst)[0] })
                case mcro.return.__token__: return emit(Return, { value: flat(cst)[0] })
            }
        }
        return flat(cst)
    }

    static thisref(result:ResultTokens, cst:any):any {
        return emit(Reference, { name: "this" })
    }

    static statement(result:ResultTokens, cst:any):any {
        if (cst === undefined) {
            return
        }
        return emit(Statement, { statement: flat(cst) })
    }

    static macrodef(result:ResultTokens, cst:any):any {
        console.log(JSON.stringify(flat(flat(named(cst, "as").cst)), null, 2))
        let fcst = flat(cst)
        let name = fcst.find(x => x.named === "macro").result.one("member") || fcst.find(x => x.named === "macro").result.one("string").match(/.(.*)./)[1]
        let is = flat(fcst.find(x => x.named === "is").cst)[0].statement[0].name
        let as = flat(fcst.find(x => x.named === "as").cst)
        return emit(MacroDef, { name, as })
    }

    static importdef(result:ResultTokens, cst:any):any {
        return emit(ImportDef, { name: flat(cst).find(x => isa(Reference)(x)).name })
    }
}

export {
    AST
};