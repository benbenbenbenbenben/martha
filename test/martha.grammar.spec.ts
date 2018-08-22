import { expect } from "chai";
import "mocha";
import { AST } from "../martha.ast";
import { Tibu, ResultTokens, Result } from "tibu";
import { Mod, Def } from "../martha.grammar";
const { parse, rule, either, many, all, optional } = Tibu;

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

describe("Def", () => {
    /**
     * specpredicate is a argument predicate expression of the form:
     * Type:name{.member}
     * Type:name{.member binaryop expression}
     * Type:name{binaryop expression}
     * Type:name{func} // where func is f(Type)
     */
    describe("specpredicate", () => {
        it("accepts .member access", () => {
           // input
           let input = ".x"
           // output
           let output = (r:ResultTokens, c:any) => {
               expect(flat(c)).to.deep.eq([{reference:'x'}])
               expect(r.tokens.length).to.eq(1)
               expect(r.tokens[0].name).to.eq("dot")
           }
           parse(input)(rule(Def.specpredicate).yields(output))
        })
        it("accepts .member.member access", () => {
            // input
            let input = ".x.y"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{reference:'x.y'}])
                expect(r.tokens.length).to.eq(1)
                expect(r.tokens[0].name).to.eq("dot")
            }
            parse(input)(rule(Def.specpredicate).yields(output))
         })
         it("accepts .member > member", () =>{
             // input
            let input = ".x > y"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{reference:'x'}, {op:"gt"}, {reference:'y'}])
                expect(r.tokens.length).to.eq(1)
                expect(r.tokens[0].name).to.eq("dot")
            }
            parse(input)(rule(Def.specpredicate).yields(output))
         })
         it("accepts .member > literal", () =>{
            // input
           let input = ".x > 10"
           // output
           let output = (r:ResultTokens, c:any) => {
               expect(flat(c)).to.deep.eq([{reference:'x'}, {op:"gt"}, {op:'literal', parameters:["integer","10"]}])
               expect(r.tokens.length).to.eq(1)
               expect(r.tokens[0].name).to.eq("dot")
           }
           parse(input)(rule(Def.specpredicate).yields(output))
        })
        it('accepts func', () => {
            // input
            let input = "func"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{reference:"func"}])
                expect(r.tokens.length).to.eq(0)
            }
            parse(input)(rule(Def.specpredicate).yields(output))
        })
    })
    describe('argumentspec', () => {
        it('accepts {.x > 10}', () => {
            // input 
            let input = "{.x > 10}"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    {
                        op: "argspec",
                        parameters: [
                            {reference:'this.x'},
                            {op:"gt"},
                            {op:'literal', parameters:["integer","10"]}
                        ]
                    }
                ])
                expect(r.tokens.length == 0)
            }
            parse(input)(rule(Def.argumentspec).yields(output))
        })
    })
    describe('argumentdef', () => {
        it('accepts name:Type', () => {
            // input
            let input = "name:Type"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    {
                        op: "argdef",
                        parameters: [
                            "name",
                            "Type",
                        ]
                    }
                ])
                expect(r.tokens.length === 2)
            }
            parse(input)(rule(Def.argumentdef).yields(output))
        })
    })
    describe('argumentdef', () => {
        it('accepts name:Type{.x > 10}', () => {
            // input
            let input = "name:Type{.x > 10}"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    {
                        op: "argdef",
                        parameters: [
                            "name",
                            "Type",
                            {
                                op: "argspec",
                                parameters: [
                                    {reference:'this.x'},
                                    {op:"gt"},
                                    {op:'literal', parameters:["integer","10"]}
                                ]
                            }
                        ]
                    }
                ])
                expect(r.tokens.length === 2)
            }
            parse(input)(rule(Def.argumentdef).yields(output))
        })
    })
    it('accepts void', () => {
        // input
        let input = 'void'
        // output
        let output = (r:ResultTokens, c:any) => {
            expect(flat(c)).to.deep.eq([{
                op: "returndef",
                parameters: [
                    "void"
                ]
            }])
            expect(r.tokens.length).to.eq(0)
        }
        parse(input)(rule(Def.returndef).yields(output))
    })
    it('accepts int{> 10}', () => {
        // input
        let input = 'void{> 10}'
        // output
        let output = (r:ResultTokens, c:any) => {
            expect(flat(c)).to.deep.eq([{
                op: "returndef",
                parameters: [
                    "void",
                    {
                        op: "argspec",
                        parameters: [
                            {reference:'this'},
                            {op:"gt"},
                            {op:'literal', parameters:["integer","10"]}
                        ]
                    }
                ]
            }])
            expect(r.tokens.length).to.eq(0)
        }
        parse(input)(rule(Def.returndef).yields(output))
    })
    describe('argumentdefs', () => {
        it('accepts x:T, y:U, z:V{> x}', () => {
            // input
            let input = 'x:T, y:U, z:V{> x}'
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{
                    op: 'argdefs',
                    parameters: [
                        { op: 'argdef', parameters: [ 'x', 'T' ] },
                        { op: 'argdef', parameters: [ 'y', 'U' ] },
                        { op: 'argdef',
                            parameters: [ 'z', 'V', { op: 'argspec', parameters: [
                                { reference:"this" },
                                { op: "gt" },
                                { reference: "x" }
                            ]}] 
                        }
                    ]
                }])
                expect(r.tokens.length).to.eq(0)
            }
            parse(input)(rule(Def.argumentdefs).yields(output))
        })
    })
})
