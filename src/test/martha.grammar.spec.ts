import { expect } from "chai";
import "mocha";
import { AST } from "../martha.ast";
import { Tibu, ResultTokens, Result } from "tibu";
import { MethodAccess, Emit, Reference, Literal, Assignment, Plus, Mult, Minus, Gt, Dot_Prefix, ReturnDef, ArgumentDef, Lt, Statement, MethodDef, Dot, TypeDef, Div, Token, TypeRef, MemberDef, MacroDef, MacroRuleDef, Apply, BracketParen } from "../martha.emit";
import { ParserContext } from "../martha.grammar";
const { parse, rule, either, many, all, optional } = Tibu;

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

const parserContext = new ParserContext()
const Def = parserContext.def
const Stmt = parserContext.stmt

describe("types", () => {
     // type name
     describe("basic types", () => {
        it("should parse type name", () => {
            expect(Tibu.parse(`Foo`)(Def.typedef_name)).to.deep.eq([{
                    typename:[
                        {value:"Foo", index:0}
                    ]
            }]);
        });
        it("should parse a base type name", () => {
            expect(Tibu.parse(`Bar`)(Def.typedef_basetype)[0].cst).to.deep.eq([[{
                __TYPE__: 'TypeRef',
                nameref: [ { __TYPE__: 'Reference', name: { value: 'Bar', index: 0 } } ],
                types: [],
                indexer: []
            }]]);
        });
        it("should parse a type member", () => {
            expect(Tibu.parse(`Type: Member`)(Def.typedef_member)).to.deep.eq([[{
                __TYPE__: 'MemberDef',
                type: 
                { 
                    __TYPE__: 'TypeRef',
                    nameref: [ { __TYPE__: 'Reference', name: { value: 'Type', index: 0 } } ],
                    types: [],
                    indexer: [] 
                },
                name: { value: 'Member', index: 6 },
                getter: [],
                setter: [] 
            }]]);
        });
        it("should parse a type with a base type", () => {
            expect(Tibu.parse(`type Foo is Bar:`)(Def.typedef)).to.deep.eq([[
                Emit.Emit(TypeDef, {
                    name: { value: "Foo", index: 5 },
                    basetype: Emit.Emit(TypeRef, 
                        { 
                            nameref: [
                                Emit.Emit(Reference, { name: { value: "Bar", index: 12 } })
                            ],
                            types: [],
                            indexer: []
                        }
                    ),
                    members: [],
                    methods: []
                })
            ]]);
        });
        it("should parse a basic type", () => {
            expect(Tibu.parse(`type Foo:`)(Def.typedef)).to.deep.eq([[
                Emit.Emit(TypeDef, { 
                    name: {value:"Foo",index:5},
                    basetype:undefined,
                    members:[], 
                    methods:[] 
                })
            ]]);
        });
        it("should parse a basic type with a member variable", () => {
            expect(Tibu.parse(`type Foo is Bar:\n    Party: this`)(Def.typedef))
            .to.deep.eq([[
                Emit.Emit(TypeDef, {
                    name: {value:"Foo", index:5},
                    basetype: Emit.Emit(TypeRef, {
                        nameref: [Emit.Emit(Reference, {name:{value:"Bar", index:12}})],
                        types: [],
                        indexer: []
                    }),
                    members:[
                        Emit.Emit(MemberDef, {
                            type: Emit.Emit(TypeRef, {
                                nameref:[Emit.Emit(Reference,{name:{value:"Party",index:21}})],
                                types: [],
                                indexer: []
                            }),
                            name: {value:"this",index:28},
                            getter:[],
                            setter:[]
                        })
                    ],
                    methods:[]
                }
            )]]);
        });
        it("should parse a 1+n type with member variables", () => {
            expect(Tibu.parse(`type Foo, Bar is Base:\n    Addr: addr0, addr1`)(Def.typedefs)).to.deep.eq(
                [[
                    {
                        name:"Foo", basetype:"Base", methods:[], members:[{type:"Addr",name:"addr0"},{type:"Addr",name:"addr1"}]
                    },
                    {
                        name:"Bar", basetype:"Base", methods:[], members:[{type:"Addr",name:"addr0"},{type:"Addr",name:"addr1"}]
                    }
                ]]
            );});
        });
})

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
                console.log(c[0][0])
                expect(flat(c)).to.deep.eq([
                    { statement: [
                            { name: "this.x" }
                        ]
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
                        [{ name: "this.x.y" }]
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
                    Emit.Emit(Statement, { statement:[
                            Emit.Emit(Gt, {
                                left: Emit.Emit<Reference>(Reference, {
                                    name: Emit.Emit(Token, {
                                        value: "this.x",
                                        index: 1
                                    })
                                }),
                                right: Emit.Emit<Reference>(Reference, {
                                    name: Emit.Emit(Token, {
                                        value:"y",
                                        index: 10
                                    })
                                }),
                            })]
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
                    { statement: [
                            Emit.Emit(Gt, {
                                left: Emit.Emit(Reference, {name: {value:"this.x",index:0}}),
                                right: Emit.Emit(Literal, {type:"integer", value:{value:"10",index:10}}),
                            })  
                        ]    
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
                    Emit.Emit(Reference, {name:{value:"func",index:1}})
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
                        __TYPE__:"ArgumentDef",
                        type: [Emit.Emit(TypeRef, {

                        })],
                        name: {name:{value:"name",index:5}},
                        spec: [
                            Emit.Emit(Gt, { 
                                left: Emit.Emit<Reference>(Reference, {name:{value:"this.x",index:10}}),
                                right: Emit.Emit<Literal>(Literal, {type:"integer",value: {value:"10",index:15}})
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
            expect(flat(c)).to.deep.eq([ { __TYPE__: 'ReturnDef',
                type: 
                { __TYPE__: 'TypeRef',
                nameref: [ { __TYPE__: 'Reference', name: { value: 'void', index: 0 } } ],
                indexer: [],
                types: [] },
                spec: [] } 
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
                {
                  "__TYPE__": "ReturnDef",
                  "type": {
                    "__TYPE__": "TypeRef",
                    "nameref": [
                      {
                        "__TYPE__": "Reference",
                        "name": {
                          "value": "void",
                          "index": 0
                        }
                      }
                    ],
                    "types": [],
                    "indexer": []
                  },
                  "spec": [
                    {
                      "__TYPE__": "Gt",
                      "left": {
                        "__TYPE__": "Reference",
                        "name": {
                          "value": "this",
                          "index": 5
                        }
                      },
                      "right": {
                        "__TYPE__": "Literal",
                        "type": "integer",
                        "value": {
                          "value": "10",
                          "index": 7
                        }
                      }
                    }
                  ]
                }
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
                                left: Emit.Emit(Reference, { name:{value:"this",index:0} }),
                                right: Emit.Emit(Reference, { name:{value:"x",index:3} })
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
                expect(flat(c)).to.deep.eq([
                    Emit.Emit(MethodDef, {
                        name: {value:"constructor", index:0},
                        attributes:[],
                        accessors: [],
                        arguments: [],
                        body: [],
                        return: undefined
                    })
                ])
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
                expect(flat(c)).to.deep.eq([
                    Emit.Emit(MethodDef, {
                        name: {value:"constructor", index:0},
                        attributes:[],
                        accessors: [],
                        arguments: [
                            Emit.Emit(ArgumentDef,{
                                name: { value: 'x', index: 16 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"int",index:12}})], 
                                        types: [],
                                        indexer: []
                                    })
                                ],
                                spec: []
                            })
                        ],
                        body: [],
                        return: undefined
                    })
                ])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Def.methoddef).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts void func(Y:x, U:u, P:j{.len < u}):', () => {
            // input
            let proc = false
            let input = 'public void: foo(Y:x, U:u, P:j{.len < i}): pass'
            // output
            let output = (r:ResultTokens, c:any) => { 
                console.log(JSON.stringify(c,null,2))
                expect(flat(c)).to.deep.eq([
                    Emit.Emit(MethodDef, {
                        name: {value:"foo", index:13},
                        attributes:[],
                        accessors: [{value:"public", index:0}],
                        arguments: [
                            Emit.Emit(ArgumentDef,{
                                name: { value: 'x', index: 19 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"Y",index:17}})], 
                                        types: [],
                                        indexer: []
                                    })
                                ],
                                spec: []
                            }),
                            Emit.Emit(ArgumentDef,{
                                name: { value: 'u', index: 24 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"U",index:22}})], 
                                        types: [],
                                        indexer: []
                                    })
                                ],
                                spec: []
                            }),
                            Emit.Emit(ArgumentDef, {
                                name: { value: 'j', index: 29 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"P",index:27}})], 
                                        types: [],
                                        indexer: []
                                    })
                                ],
                                spec: [
                                    Emit.Emit(Statement, {
                                        statement:[
                                            Emit.Emit(Lt, {
                                                left: Emit.Emit(Reference, {name:{value:"this.len",index:31}}),
                                                right: Emit.Emit(Reference, {name:{value:"i",index:38}})
                                            })
                                        ]
                                    })                                    
                                ]
                            })
                        ],
                        body: [
                            Emit.Emit(Statement, {
                                statement: [Emit.Emit(Reference, {
                                    name:{value:"pass", index: 43}
                                })]
                            })
                        ],
                        return: Emit.Emit(ReturnDef, {
                            type: Emit.Emit(TypeRef, {
                                nameref: [
                                    Emit.Emit(Reference, {name:{value:"void", index:7}})
                                ],
                                types: [],
                                indexer: []
                            }),
                            spec: []
                        })
                    })
                ])
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
                ])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Def.methoddef).yields(output))
            expect(proc).to.be.eq(true)
        })
    })
    describe("macrodef", () => {
        it('accepts macro: return when: return $subatom use: Emit.Return($subatom)', () => {
            // input
            let input = `
macro return for statement:
    as return $subatom:
        Emit.Return($subatom)
`.trim()
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    {
                      "__TYPE__": "MacroDef",
                      "name": {
                        "value": "return",
                        "index": 6
                      },
                      "insert": {
                        "value": "statement",
                        "index": 17
                      },
                      "rule":
                        {
                          "__TYPE__": "MacroRuleDef",
                          "rule": [
                            {
                              "__TYPE__": "Statement",
                              "statement": [
                                {
                                  "__TYPE__": "Apply",
                                  "apply": {
                                    "__TYPE__": "Reference",
                                    "name": {
                                      "value": "$subatom",
                                      "index": 42
                                    }
                                  },
                                  "to": {
                                    "__TYPE__": "Reference",
                                    "name": {
                                      "value": "return",
                                      "index": 35
                                    }
                                  }
                                }
                              ]
                            }
                          ],
                          "body": [
                            {
                              "__TYPE__": "Statement",
                              "statement": [
                                {
                                  "__TYPE__": "Apply",
                                  "apply": {
                                    "__TYPE__": "BracketParen",
                                    "statements": [
                                      {
                                        "__TYPE__": "Reference",
                                        "name": {
                                          "value": "$subatom",
                                          "index": 72
                                        }
                                      }
                                    ]
                                  },
                                  "to": {
                                    "__TYPE__": "Reference",
                                    "name": {
                                      "value": "Emit.Return",
                                      "index": 60
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        }
                    }
                  ])
                proc = true
            }
            parse(input)(rule(Def.macrodef).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts macro: foringenerator', () => {
            // input
            let input = 
`macro foringenerator for Statement:
as $atom ($statement for $atom.reference in $atom.range):
    $statement.bind $atom.reference $atom.range.current
    emit(Generator, {
        next = $atom.range.next,
        current = $statement
    })
`    
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([{

                }])
                proc = true
            }
            parse(input)(rule(Def.macrodef).yields(output))
            expect(proc).to.be.eq(true)
        })
    })
})

describe('Exp', () => {
    describe("exp", () => {
        it('accepts if true:\n    pass\nelse if false:\n    pass\nelse if test:\n    pass\nelse:\n    pass', () => {
            // input
            let input = 
`if true:
    passtrue
else if false:
    passfalse
else if alt:
    passalt
else:
    passelse
`
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                console.log(JSON.stringify(c,null,2))
                expect(flat(c)).to.deep.eq([{

                }])
                expect(r.tokens.length).to.eq(1)
                proc = true
            }
            parse(input)(rule(Stmt.statement).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts x + y * x / w - q', () => {
            // input
            let input = 'g + y * x / w - q'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    { __TYPE__: "Statement", statement: [
                        Emit.Emit(Minus, {
                            left: Emit.Emit(Plus, {
                                left: Emit.Emit(Reference, {name: {value:"g", index:0}}),
                                right: Emit.Emit(Div, {
                                    left: Emit.Emit(Mult, {
                                        left: Emit.Emit(Reference, {name:{value:"y",index:4}}),
                                        right: Emit.Emit(Reference, {name:{value:"x",index:8}}),
                                    }),
                                    right: Emit.Emit(Reference, {name:{value:"w",index:12}})
                                })
                            }),
                            right: Emit.Emit(Reference, {name:{value:"q",index:16}})
                        })
                    ]}
                ])
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
                    { __TYPE__:"Statement", statement: 
                        [Emit.Emit<Assignment>(Assignment, {
                            left: Emit.Emit<Reference>(Reference, {name:{value:"a",index:0}}),
                            right: Emit.Emit<Literal>(Literal, {type:"integer",value:{value:"10",index:4}}),
                        
                        })]
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
                expect(flat(c)).to.deep.eq([{
                    __TYPE__:"Statement",
                    statement:[{ __TYPE__:"Plus",
                    left: { __TYPE__:"Reference", name: {value:"a",index:0} },
                    right: {
                        left: {
                            bracketparen: [
                                { left: { name: "b" }, right: { name: "c" }}
                            ]
                        },
                        right: {
                            bracketparen: [
                                { 
                                    left: { name: "a" },
                                    right: {
                                        bracketparen: [
                                            { left: { name: "f"}, right: { name: "i" } }
                                        ]
                                }
                                }
                            ]
                        }
                    }
                }]}])
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
                expect(flat(c)).to.deep.eq([
                    { __TYPE__:"Statement", statement: [ 
                        { 
                            apply: { __TYPE__:"Reference", name: {value:'a',index:7} }, 
                            to: { __TYPE__:"Reference", name: {value:'return',index:0} } 
                        } ] }
                ])
                proc = true
            }
            parse(input)(rule(Stmt.statement).yields(output))
            expect(proc).to.be.eq(true)
        })
    })
})
