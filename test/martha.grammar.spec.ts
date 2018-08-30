import { expect } from "chai";
import "mocha";
import { AST } from "../martha.ast";
import { Tibu, ResultTokens, Result } from "tibu";
import { Mod, Def, Exp, Stmt } from "../martha.grammar";
import { MethodAccess, Emit, Reference, Literal, Assignment, Plus, Mult, Minus, Gt, Dot_Prefix, ReturnDef, ArgumentDef, Lt, Statement, MethodDef } from "../martha.emit";
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
    describe('argumentspec', () => {
        it("accepts {.x}", () => {
            // input
            let input = "{.x}"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    { statement: 
                        Emit.Emit(Dot_Prefix, { value:
                            Emit.Emit(Reference, {name:"x"})
                        })
                    }
                 ])
            }
            parse(input)(rule(Def.argumentspec).yields(output))
         })
         it("accepts {.x.y}", () => {
             // input
             let input = "{.x.y}"
             // output
             let output = (r:ResultTokens, c:any) => {
                 expect(flat(c)).to.deep.eq([
                     Emit.Emit(Statement, { statement: 
                        Emit.Emit(Dot_Prefix, { value:
                            Emit.Emit<Reference>(Reference, {name:"x.y"})
                        })
                    })
                 ])
             }
             parse(input)(rule(Def.argumentspec).yields(output))
          })
          it("accepts {this.x > y}", () =>{
              // input
             let input = "{this.x > y}"
             // output
             let output = (r:ResultTokens, c:any) => {
                 expect(flat(c)).to.deep.eq([
                    Emit.Emit(Statement, { statement:
                            Emit.Emit(Gt, {
                                left: Emit.Emit<Reference>(Reference, {name:"this.x"}),
                                right: Emit.Emit<Reference>(Reference, {name:"y"}),
                            })
                        })
                 ])
             }
             parse(input)(rule(Def.argumentspec).yields(output))
          })
          it("accepts {.x > 10}", () =>{
             // input
            let input = "{.x > 10}"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    { statement: 
                            Emit.Emit(Gt, {
                                left: Emit.Emit(Dot_Prefix, { value:
                                        Emit.Emit(Reference, {name:"x"})
                                    }
                                ),
                                right: Emit.Emit(Literal, {type:"integer", value:"10"}),
                            })      
                        }
                 ])
            }
            parse(input)(rule(Def.argumentspec).yields(output))
        })
        it('accepts {func}', () => {
            // input
            let input = "{func}"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    { statement:
                        Emit.Emit(Reference, {name:"func"})
                    }
                ])
                expect(r.tokens.length).to.eq(0)
            }
            parse(input)(rule(Def.argumentspec).yields(output))
        })        
    })
    describe('argumentdef', () => {
        it('accepts Type:name', () => {
            // input
            let input = "Type:name"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    {
                        type: "Type",
                        name: "name",
                        spec: [],
                    }
                ])
                expect(r.tokens.length === 2)
            }
            parse(input)(rule(Def.argumentdef).yields(output))
        })
    })
    describe('argumentdef', () => {
        it('accepts Type:name{.x > 10}', () => {
            // input
            let input = "Type:name{.x > 10}"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    {
                        type: "Type",
                        name: "name",
                        spec: [
                            Emit.Emit(Gt, { 
                                left:
                                Emit.Emit(Dot_Prefix, { value: 
                                    Emit.Emit<Reference>(Reference, {name:"x"}),
                                }),
                                right:
                                Emit.Emit<Literal>(Literal, {type:"integer", value:"10"})
                            })
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
            expect(flat(c)).to.deep.eq([
                Emit.Emit(ReturnDef, { type: "void", spec: [] })                
            ])
            expect(r.tokens.length).to.eq(0)
        }
        parse(input)(rule(Def.returndef).yields(output))
    })
    it('accepts int{> 10}', () => {
        // input
        let input = 'void{> 10}'
        let proc = false
        // output
        let output = (r:ResultTokens, c:any) => {
            expect(flat(c)).to.deep.eq([
                Emit.Emit(ReturnDef, { 
                    type: "void", 
                    spec: [Emit.Emit(Gt, {
                        left: Emit.Emit<Reference>(Reference, {name:"this"}),
                        right: Emit.Emit<Literal>(Literal, {type:"integer",value:"10"})
                    })] 
                })
            ])
            expect(r.tokens.length).to.eq(0)
            proc = true
        }
        parse(input)(rule(Def.returndef).yields(output))
        expect(proc).to.be.eq(true)
    })
    describe('argumentdefs', () => {
        it('accepts T:x, U:y, V:z{> x}', () => {
            // input
            let input = 'T:x, U:y, V:z{> x}'
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{
                    op: 'argdefs',
                    parameters: [
                        { type:"T", name:"x", spec: [] },
                        { type:"U", name:"y", spec: [] },
                        { type:"V", name:"z", spec: [
                            Emit.Emit(Gt, {
                                left: Emit.Emit(Reference, { name: "this" }),
                                right: Emit.Emit(Reference, { name: "x" })
                            })
                        ] },
                    ]
                }])
                expect(r.tokens.length).to.eq(0)
            }
            parse(input)(rule(Def.argumentdefs).yields(output))
        })
    })
    describe('methoddef', () => {
        it('accepts constructor:', () => {
            // input
            let input = 'constructor:'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{
                    name: "constructor",
                    access: undefined,
                    async: false,
                    atomic: false,
                    critical: false,
                    arguments: [],
                    body: [],
                    return: undefined
                }])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Def.methoddef).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts constructor(int:x):', () => {
            // input
            let proc = false
            let input = 'constructor(int:x):'
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{
                    name: "constructor",
                    access: undefined,
                    async: false,
                    atomic: false,
                    critical: false,
                    arguments: [
                        Emit.Emit(ArgumentDef, {
                            name: "x",
                            type:"int",
                            spec: []
                        })
                    ],
                    body: [],
                    return: undefined
                }])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Def.methoddef).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts void func(Y:x, U:u, P:j{.len < u}):', () => {
            // input
            let proc = false
            let input = 'public void foo(Y:x, U:u, P:j{.len < i}):'
            // output
            let output = (r:ResultTokens, c:any) => { 
                expect(flat(c)).to.deep.eq([{
                    name: "foo",
                    access: Emit.Emit(MethodAccess, {ispublic: true}),
                    async: false,
                    atomic: false,
                    critical: false,
                    arguments: [
                        { type: "Y", name: "x", spec: [] },
                        { type: "U", name: "u", spec: [] },
                        { type: "P", name: "j", spec: [
                            Emit.Emit(Lt, { 
                                left:
                                Emit.Emit(Dot_Prefix, { value:
                                    Emit.Emit(Reference, {name:"len"}),
                                }),
                                right: 
                                Emit.Emit(Reference, {name:"i"}),
                            })
                        ]},
                    ],
                    body: [

                    ],
                    return: Emit.Emit(ReturnDef, { type: "void", spec: [] })
                }])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Def.methoddef).yields(output))
            expect(proc).to.eq(true)
        })
        it('accepts int{> 0} func(int:x{> 0}, int:y{> x}):\n    return x + y + 1', () => {
            // input
            let input = 'int{> 0} func(int:x{> 0}, int:y{> x}):\n    return x + y + 1'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    Emit.Emit(MethodDef, {
                        name: "func",
                        access: undefined,
                        async: false,
                        atomic: false,
                        critical: false,
                        arguments: [
                            Emit.Emit(ArgumentDef, {
                                type:"int",
                                name:"x",
                                spec:[
                                    {left:{name:"this"}, right:{type:"integer", value:"0"}}
                                ]
                            }),Emit.Emit(ArgumentDef, {
                                type:"int",
                                name:"y",
                                spec:[
                                    {left:{name:"this"}, right:{name:"x"}}
                                ]
                            }),
                        ],
                        body: [
                            {
                              "statement": {
                                "left": {
                                  "left": {
                                    "apply": {
                                      "name": "x"
                                    },
                                    "to": {
                                      "name": "return"
                                    }
                                  },
                                  "right": {
                                    "name": "y"
                                  }
                                },
                                "right": {
                                  "type": "integer",
                                  "value": "1"
                                }
                              }
                            }
                          ],
                        return: Emit.Emit(ReturnDef, {
                            type:"int",
                            spec: [
                                Emit.Emit(Gt, {
                                    left: Emit.Emit(Reference, {name:"this"}),
                                    right: Emit.Emit(Literal, {type:"integer", value:"0"})
                                })
                            ]
                        })
                    })
                ])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Def.methoddef).yields(output))
            expect(proc).to.be.eq(true)
        })
    })
})

describe('Exp', () => {
    describe("exp", () => {
        it('accepts x + y * x / w - q', () => {
            // input
            let input = 'x + y * x / w - q'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    { statement: 
                        Emit.Emit(Minus, {
                            left: Emit.Emit(Plus, {
                                left: Emit.Emit(Reference, {name:"x"}),
                                right: Emit.Emit(Plus, {
                                    left: Emit.Emit(Mult, {
                                        left: Emit.Emit(Reference, {name:"y"}),
                                        right: Emit.Emit(Reference, {name:"x"}),
                                    }),
                                    right: Emit.Emit(Reference, {name:"w"})
                                })
                            }),
                            right: Emit.Emit(Reference, {name:"q"})
                        })
                    }])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Stmt.statement).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts a = 10', () => {
            // input
            let input = 'a = 10'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)[0]).to.deep.eq(
                    { statement: 
                        Emit.Emit<Assignment>(Assignment, {
                            left: Emit.Emit<Reference>(Reference, {name:"a"}),
                            right: Emit.Emit<Literal>(Literal, {type:"integer",value:"10"}),
                        
                        })
                    }
                ).and.instanceof(Statement)
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Stmt.statement).yields(output))
            expect(proc).to.to.eq(true)
        })
        it('accepts a + (b * c) * (a - (f * i))', () => {
            // input
            let input = 'a + (b * c) * (a - (f * i))'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{statement:{
                    left: { name: "a" },
                    right: {
                        left: {
                            parenthesis: [
                                { left: { name: "b" }, right: { name: "c" }}
                            ]
                        },
                        right: {
                            parenthesis: [
                                { 
                                    left: { name: "a" },
                                    right: {
                                        parenthesis: [
                                            { left: { name: "f"}, right: { name: "i" } }
                                        ]
                                }
                                }
                            ]
                        }
                    }
                }}])
                proc = true
            }
            parse(input)(rule(Stmt.statement).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts return a', () => {
            // input
            let input = 'return a'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{
                    
                }])
                proc = true
            }
            parse(input)(rule(Stmt.statement).yields(output))
            expect(proc).to.be.eq(true)
        })
    })
})
