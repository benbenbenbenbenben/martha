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
    it('accepts type:\n    Binary\nwith:\n    left: object\n    right: object\n', () => {
        // input
        let input = 'type Binary =\n    left: object\n    right: object\n'
        let proc = false
        // output
        let output = (r:ResultTokens, c:any) => {
            const actual:TypeDef = flat(c)[0]
            expect(actual.name.value).to.eq("Binary")
            expect(actual.members!.length).to.eq(2)
            expect(actual.members![0].name.value).to.eq("left")
            expect(actual.members![1].name.value).to.eq("right")
            expect(actual.members![0].type!.nameref![0].name.value).to.eq("object")
            expect(actual.members![1].type!.nameref![0].name.value).to.eq("object")
            proc = true
        }
        parse(input)(rule(Def.typedef).yields(output))
        expect(proc).to.be.eq(true)
    })
})