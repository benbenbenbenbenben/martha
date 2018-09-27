/// <reference path="tibu.d.ts">
import { Tibu, Result, ResultTokens, Input, IRule, IToken, Pattern, IRuleAction } from "tibu";
const { parse, token, rule, all, many, optional, either } = Tibu;

import { Emit, MethodAccess, Literal, Reference, Assignment, PlusEq, MinusEq, MultEq, DivEq, ModEq, ShREq, ShLEq, AmpEq, CaretEq, PipeEq, PowerEq, Mult, Power, Div, Mod, Plus, Minus, ShiftLeft, ShiftRight, Lt, Lte, Gt, Gte, EqEq, NotEq, Amp, Caret, Pipe, AmpAmp, PipePipe, MinusMinus, PlusPlus, Plus_Prefix, Minus_Prefix, Exc, Tilde, Splat, TypeOf, AddrOf, SizeOf, StateOf, SwapTo, New, Delete, Return, Arrow, Dot, ConditionalDot, PlusPlus_Postfix, MinusMinus_Postfix, Dot_Prefix, ReturnDef, ArgumentDef, Statement, MethodDef, List, MacroDef, ImportDef, TypeDef, Lambda, Range, TypeRef, ColonBin, QuesBin, ExcBin, IfExp, Attribute, MacroRuleDef, MemberDef, Token, Apply, BracketParen, BracketArray, BracketCurly } from "./martha.emit";
import { Op, Mcro } from "./martha.grammar";
const emit = Emit.Emit

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

const isa = (T:any) => (x:any): boolean => {
    return x instanceof T
}

const namedmany = (cst:any[], name:string) => {
    const fcst = flat(cst)
    return fcst.filter(x => x.named === name)
}

const named = (cst:any[], name:string) => {
    return namedmany(cst, name).length > 0 ? namedmany(cst, name)[0] : undefined
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
                modcst.unshift(emit<Reference>(Reference,{
                    name:{
                        value:"this", 
                        index:result.tokens[0].result.startloc 
                    }
                }))
            }
        }
        return modcst
    }

    static argumentdef(result:ResultTokens, cst:any):any {        
        let argspec = named(flat(cst), "argspec")
        return emit(ArgumentDef, {
                name: result.one("varname"),
                type: cst ? flat(cst).filter(isa(TypeRef)) : [],
                spec: argspec ? flat(argspec.cst) : []
            })
    }

    static argumentdefs(result:ResultTokens, cst:any):any {
        return {
            op: "argdefs",
            parameters: flat(cst)
        }
    }

    static returndef(result:ResultTokens, cst:any):ReturnDef {
        let argspec = named(flat(cst), "argspec")
        return emit(ReturnDef, { 
            type: flat(cst)[0],
            spec: argspec ? flat(argspec.cst) : [] 
        })
    }

    static methoddef(result:ResultTokens, cst:any):MethodDef {
        let fcst = flat(cst)
        let accessors = named(fcst, "accessors")
        let returndef = cst && flat(cst).find((x:any) => x instanceof ReturnDef)
        return emit(MethodDef, {
            // TODO: new Token s/c because unknown definitily typed behaviour around ||
            name: result.one("ctor") || result.one("name") || new Token(),
            attributes: cst && flat(cst).filter(isa(Attribute)),
            accessors: accessors.result.tokens.map((t:any) => emit(Token, {value:t.result.value, index:t.result.startloc})),
            arguments: cst ? flat(flat(cst).filter((x:any) => x.op == "argdefs").map((x:any) => x.parameters)) : [],
            body: cst ? flat(cst).filter((x:any) => x instanceof Statement) : [],
            return: returndef,
        })
    }

    static typedef(result:ResultTokens, cst:any):any {
        let fcst = flat(cst)
        let basetype = named(fcst, "basetype")
        let types:any[] = fcst
            .filter(x => x)
            .filter(t => t.typename)
            .map((name:any) => {
                return name.typename.map((name:Token) => {
                    let type:TypeDef = {
                        name,
                        basetype: basetype ? flat(basetype.cst)[0] : undefined
                    }
                    type.members = fcst.filter(isa(MemberDef))
                    type.methods = fcst.filter(isa(MethodDef))
                    return emit(TypeDef, type);
                })
            }
        );
        return flat(types)
    }

    static typedef_index(result:ResultTokens, cst:any):TypeRef {
        //console.log(flat(flat(namedmany(cst, "types"))[0].cst))
        let ref = emit(TypeRef, {
            nameref: cst ? flat(namedmany(cst, "name").map(c => c.cst)) : undefined,
            types: cst ? flat(namedmany(cst, "types").map(c => AST.typedef_index(result, c.cst))) : undefined,
            indexer: cst ? flat(namedmany(cst, "indexer").map(c => AST.typedef_index(result, c.cst || []))) : undefined,
        })
        return ref;
        // return cst ? (result.get("typename") || []).concat([{index:flat(cst)}]) : result.get("typename")
    }

    static typedef_type(result:ResultTokens, cst:any):any {
        return AST.typedef_index(result, cst)
    }

    static typedef_member(result:ResultTokens, cst:any):MemberDef[] {
        // TODO: memberdef type
        let fcst = flat(cst).filter(x => x)
        return  fcst
                .filter(isa(Reference))
                .map(x => emit(MemberDef, {
                        type: fcst[0],
                        name: x.name,
                        getter: named(fcst, "getter") ? named(fcst, "getter").cst : [],
                        setter: named(fcst, "setter") ? named(fcst, "setter").cst : [],
                    })
                )
    }

    static typedef_name(result:ResultTokens, cst:any):any {
        return {
            typename: result.get("typename")
        };
    }

    static atomlambdaliteral(result:ResultTokens, cst:any):Lambda {
        const spec = named(cst, "spec")
        const body = named(cst, "body")

        let lambda = emit(Lambda, {
            name: spec.result.tokens[0].result.value,
            accessors: [],
            arguments: [],
            body: flat(body.cst),
            return: emit(ReturnDef, {
                type: emit(TypeRef, {}),
                spec: []
            })
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
            value: { value: result.tokens[0].result.value, index: result.tokens[0].result.startloc }
        })
    }

    static atomarrliteral(result:ResultTokens, cst:any):any {
        return {
            op:"arrayliteral",
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

    static atommember(result:ResultTokens, cst:any):any {
        return flat(cst);
    }

    static atom(result:ResultTokens, cst:any):any {
        let f = flat(cst)
        if (f.length > 1) {
            //return { apply: f.slice(1), to: f[0] }
            return f.reduce((a,b) =>  emit(Apply, { apply: b, to: a }))
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
            name: {
                value: result.get("member")!.map(v => v.value).join("."),
                index: result.one("member")!.index
            }
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
        return emit(BracketParen, {
            statements: cst ? flat(cst) : []
        })
    }
    static bracketarray(result:ResultTokens, cst:any):any {
        return emit(BracketArray, {
            statements: cst ? flat(cst) : []
        })
    }
    static bracketcurly(result:ResultTokens, cst:any):any {
        return emit(BracketCurly, {
            statements: cst ? flat(cst) : []
        })
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
                switch(result.tokens.shift()!.name) {
                    case op.dot.__token__: return (isa(Reference)(left) && isa(Reference)(right))
                        ? emit(Reference, {
                            name: emit(Token, {
                                value: `${left.name.value}.${right.name.value}`,
                                index: left.name.index
                            })
                        }) 
                        : emit(Dot, { left, right })
                    case op.ques.__token__: return emit(QuesBin, { left, right })
                    case op.colon.__token__: return emit(ColonBin, { left, right })
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
                    case op.range.__token__: return emit(Range, { left, right})
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
        return emit(Reference, { 
            name: emit(Token, {
                value: "this", 
                index: result.tokens[0].result.startloc
            }) 
        })
    }

    static statement(result:ResultTokens, cst:any):any {
        if (cst === undefined) {
            return
        }
        return emit(Statement, { statement: flat(cst) })
    }

    static macrodef(result:ResultTokens, cst:any):any {
        let fcst = flat(cst)        
        let name = named(fcst, "name").result.one("member") || named(fcst, "name").result.one("string").match(/.(.*)./)[1] 
        let rules = fcst.filter(isa(MacroRuleDef))

        let macro = emit(MacroDef, { name, rules })
        console.log(macro)
        return macro
    }

    static macrorule(result:ResultTokens, cst:any):any {
        let fcst = flat(cst)
        return emit(MacroRuleDef, { rule: [fcst[0]], body:fcst.slice(1) })
    }

    static importdef(result:ResultTokens, cst:any):any {
        return emit(ImportDef, { name: flat(cst).find(x => isa(Reference)(x)).name })
    }

    static expandmacro(macro:MacroDef):(result:ResultTokens, cst:any) => any {
        return (result:ResultTokens, cst:any) => {
            console.log("### TRAPPED MACRO", result, cst)
            return 1
        }
    }

    static attribute(result:ResultTokens, cst:any):any {
        return emit(Attribute, {
            body: flat(cst)
        })
    }

    static ifexp(result:ResultTokens, cst:any):IfExp {
        let fcst = flat(cst)
        let _if = named(fcst, "if")
        let _else = named(fcst, "else")
        let tif = emit(IfExp, {
            expression: emit(Statement, {statement: [flat(_if.cst)[0]]}),
            body: flat(_if.cst).slice(1).map(e => emit(Statement, {statement:[e]}))
        })
        let _elsifs = namedmany(fcst, "elseif")
                    .map(c => AST.ifexp(result, c.cst))
                    .reduce((pre:IfExp, cur:IfExp) => {
                        pre.altbody = [emit(Statement, {statement:[cur]})]
                        return cur
                    }, tif)
        if (_else)
            _elsifs.altbody = [emit(Statement, {statement:flat(_else.cst)})]
        return tif
    }
}

export {
    AST
};