import { expect } from "chai";
import "mocha";
import { AST } from "../martha.ast";
import { Tibu, ResultTokens, Result } from "tibu";
import { MethodAccess, Emit, Reference, Literal, Assignment, Plus, Mult, Minus, Gt, Dot_Prefix, ReturnDef, ArgumentDef, Lt, Statement, MethodDef, Dot, TypeDef, Token, MemberDef, TypeRef } from "../martha.emit";
import { ParserContext } from "../martha.grammar";
const { parse, rule, either, many, all, optional } = Tibu;

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

const parserContext = new ParserContext()
const Def = parserContext.def
const Stmt = parserContext.stmt

describe('syntax.m', () => {
    it('accepts type:\n    Binary\nwith:\n    object: left\n    object: right\n', () => {
        // input
        let input = 'type Binary:\n    object: left\n    object: right\n'
        let proc = false
        // output
        let output = (r:ResultTokens, c:any) => {
            expect(flat(c)).to.deep.eq(
                [ Emit.Emit(TypeDef, {
                    name: Emit.Emit(Token, { value: "Binary", index: 5 }),
                    members: [
                        Emit.Emit(MemberDef, {
                            type: Emit.Emit(TypeRef, {
                                nameref: [
                                    Emit.Emit(Reference, {
                                        name:
                                        Emit.Emit(Token, {value:"object", index:0})
                                    })
                                ],
                            }),
                            name: { value: "left", index: 0 }
                        })
                    ]
                }) ] )
            proc = true
        }
        parse(input)(rule(Def.typedef).yields(output))
        expect(proc).to.be.eq(true)
    })
})