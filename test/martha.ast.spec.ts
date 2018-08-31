import { expect } from "chai";
import "mocha";
import { AST } from "../src/martha.ast";
import { Tibu, ResultTokens, Result } from "tibu";
import { Def, Exp, Stmt, Ctx } from "../src/martha.grammar";
import { MethodAccess, Emit, Reference, Literal, Assignment, Plus, Mult, Minus, Gt, Dot_Prefix, ReturnDef, ArgumentDef, Lt, Statement, MethodDef, Dot } from "../src/martha.emit";
const { parse, rule, either, many, all, optional } = Tibu;

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

describe('syntax.m', () => {
    it('accepts type:\n    Binary\nwith:\n    object: left\n    object: right\n', () => {
        // setup
        let def = new Def(
            new Ctx()
        )
        // input
        let input = 'type:\n    Binary\nwith:\n    object: left\n    object: right\n'
        let proc = false
        // output
        let output = (r:ResultTokens, c:any) => {
            expect(flat(c)).to.deep.eq(
                [ { name: 'Binary',
                    members: 
                     [ { type: 'object', name: 'left' },
                       { type: 'object', name: 'right' } ] } ] )
            proc = true
        }
        parse(input)(rule(Def.typedef).yields(output))
        expect(proc).to.be.eq(true)
    })
})