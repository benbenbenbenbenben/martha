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
                callreturn: undefined,
                nameref: [ { __TYPE__: 'Reference', name: { value: 'Bar', index: 0 } } ],
                types: [],
                indexer: []
            }]]);
        });
        it("should parse a type member", () => {
            expect(Tibu.parse(`Member: Type`)(Def.typedef_member_dec)).to.deep.eq([[{
                __TYPE__: 'MemberDef',
                type: 
                { 
                    __TYPE__: 'TypeRef',
                    callreturn: undefined,
                    nameref: [ { __TYPE__: 'Reference', name: { value: 'Type', index: 8 } } ],
                    types: [],
                    indexer: [] 
                },
                name: { value: 'Member', index: 0 },
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
                            typeargs: [],
                            indexargs: []
                        }
                    ),
                    members: [],
                    states: undefined
                })
            ]]);
        });
        it("should parse a basic type", () => {
            expect(Tibu.parse(`type Foo:`)(Def.typedef)).to.deep.eq([[
                Emit.Emit(TypeDef, { 
                    name: {value:"Foo",index:5},
                    basetype:undefined,
                    members:[], 
                    states: undefined
                })
            ]]);
        });
        it("should parse a basic type with a member variable", () => {
            expect(Tibu.parse(`type Foo is Bar:\n    this: Party`)(Def.typedef))
            .to.deep.eq([[
                Emit.Emit(TypeDef, {
                    name: {value:"Foo", index:5},
                    basetype: Emit.Emit(TypeRef, {
                        nameref: [Emit.Emit(Reference, {name:{value:"Bar", index:12}})],
                        typeargs: [],
                        indexargs: []
                    }),
                    members:[
                        Emit.Emit(MemberDef, {
                            type: Emit.Emit(TypeRef, {
                                nameref:[Emit.Emit(Reference,{name:{value:"Party",index:27}})],
                                typeargs: [],
                                indexargs: []
                            }),
                            name: {value:"this",index:21},
                            getter:[],
                            setter:[]
                        })
                    ],
                    states: undefined
                }
            )]]);
        });
        it("should parse a 1+n type with member variables", () => {
            expect(Tibu.parse(`type Foo, Bar is Base:\n    addr0, addr1: Addr`)(Def.typedefs)).to.deep.eq(
                [
                    [
                       {
                          __TYPE__:'TypeDef',
                          name:{
                             value:'Foo',
                             index:5
                          },
                          basetype:{
                             __TYPE__:'TypeRef',
                             callreturn:undefined,
                             nameref:[
                                {
                                   __TYPE__:'Reference',
                                   name:{
                                      value:'Base',
                                      index:17
                                   }
                                }
                             ],
                             types:[
                 
                             ],
                             indexer:[
                 
                             ]
                          },
                          members:[
                             {
                                __TYPE__:'MemberDef',
                                type:{
                                   __TYPE__:'TypeRef',
                                   callreturn:undefined,
                                   nameref:[
                                      {
                                         __TYPE__:'Reference',
                                         name:{
                                            value:'Addr',
                                            index:41
                                         }
                                      }
                                   ],
                                   types:[
                 
                                   ],
                                   indexer:[
                 
                                   ]
                                },
                                name:{
                                   value:'addr0',
                                   index:27
                                },
                                getter:[
                 
                                ],
                                setter:[
                 
                                ]
                             },
                             {
                                __TYPE__:'MemberDef',
                                type:{
                                   __TYPE__:'TypeRef',
                                   callreturn:undefined,
                                   nameref:[
                                      {
                                         __TYPE__:'Reference',
                                         name:{
                                            value:'Addr',
                                            index:41
                                         }
                                      }
                                   ],
                                   types:[
                 
                                   ],
                                   indexer:[
                 
                                   ]
                                },
                                name:{
                                   value:'addr1',
                                   index:34
                                },
                                getter:[
                 
                                ],
                                setter:[
                 
                                ]
                             }
                          ],
                          methods:[
                 
                          ],
                          states:undefined
                       },
                       {
                          __TYPE__:'TypeDef',
                          name:{
                             value:'Bar',
                             index:10
                          },
                          basetype:{
                             __TYPE__:'TypeRef',
                             callreturn:undefined,
                             nameref:[
                                {
                                   __TYPE__:'Reference',
                                   name:{
                                      value:'Base',
                                      index:17
                                   }
                                }
                             ],
                             types:[
                 
                             ],
                             indexer:[
                 
                             ]
                          },
                          members:[
                             {
                                __TYPE__:'MemberDef',
                                type:{
                                   __TYPE__:'TypeRef',
                                   callreturn:undefined,
                                   nameref:[
                                      {
                                         __TYPE__:'Reference',
                                         name:{
                                            value:'Addr',
                                            index:41
                                         }
                                      }
                                   ],
                                   types:[
                 
                                   ],
                                   indexer:[
                 
                                   ]
                                },
                                name:{
                                   value:'addr0',
                                   index:27
                                },
                                getter:[
                 
                                ],
                                setter:[
                 
                                ]
                             },
                             {
                                __TYPE__:'MemberDef',
                                type:{
                                   __TYPE__:'TypeRef',
                                   callreturn:undefined,
                                   nameref:[
                                      {
                                         __TYPE__:'Reference',
                                         name:{
                                            value:'Addr',
                                            index:41
                                         }
                                      }
                                   ],
                                   types:[
                 
                                   ],
                                   indexer:[
                 
                                   ]
                                },
                                name:{
                                   value:'addr1',
                                   index:34
                                },
                                getter:[
                 
                                ],
                                setter:[
                 
                                ]
                             }
                          ],
                          methods:[
                 
                          ],
                          states:undefined
                       }
                    ]
                 ]
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
                // TODO: why does this need JSON stringify??
                expect(JSON.stringify(flat(c))).to.deep.eq(
                    JSON.stringify([
                        {
                          "named": "argspec",
                          "result": {
                            "tokens": [
                              {
                                "name": "spec",
                                "result": {
                                  "success": true,
                                  "startloc": 1,
                                  "endloc": 1,
                                  "value": "",
                                  "children": [],
                                  yielded: undefined
                                }
                              }
                            ]
                          },
                          "cst": [
                            {
                              "__TYPE__": "Statement",
                              "statement": [
                                {
                                  "__TYPE__": "Reference",
                                  "name": {
                                    "value": "this.x",
                                    "index": 1
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ])
                )
            }
            parse(input)(rule(Def.argumentspec).yields(output))
         })
         it("accepts {.x.y}", () => {
             // input
             let input = "{.x.y}"
             // output
             let output = (r:ResultTokens, c:any) => {
                 expect(JSON.stringify(flat(c))).to.deep.eq(
                    JSON.stringify([ { named: 'argspec',
                    result: 
                     { tokens: 
                        [ { name: 'spec',
                            result: 
                             { success: true,
                               startloc: 1,
                               endloc: 1,
                               value: '',
                               children: [],
                               yielded: undefined } } ] },
                    cst: 
                     [ { __TYPE__: 'Statement',
                         statement: [ { __TYPE__: 'Reference', name: { value: 'this.x.y', index: 1 } } ] } ] } ])
                 )
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
                expect(flat(c)).to.deep.eq(
                    [ { named: 'argspec',
    result: 
     { tokens: 
        [ { name: 'spec',
            result: 
             { success: true,
               startloc: 1,
               endloc: 1,
               value: '',
               children: [],
               yielded: undefined } } ] },
    cst: 
     [ { __TYPE__: 'Statement',
         statement: [ { __TYPE__: 'Reference', name: { value: 'func', index: 1 } } ] } ] } ]
                )
                expect(r.tokens.length).to.eq(0)
            }
            parse(input)(rule(Def.argumentspec).yields(output))
        })        
    })
    describe('argumentdef', () => {
        it('accepts Type:name', () => {
            // input
            let input = "name:Type"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq(
                    [ { __TYPE__: 'ArgumentDef',
                    name: { value: 'name', index: 0 },
                    type: 
                    [ { __TYPE__: 'TypeRef',
                        callreturn: undefined,
                        nameref: [ { __TYPE__: 'Reference', name: { value: 'Type', index: 5 } } ],
                        types: [],
                        indexer: [] } ],
                    spec: [] } ]
                )
                expect(r.tokens.length === 2)
            }
            parse(input)(rule(Def.argumentdef).yields(output))
        })
    })
    describe('argumentdef', () => {
        it('accepts Type:name{.x > 10}', () => {
            // input
            let input = "name:Type{.x > 10}"
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq(
                    [ { __TYPE__: 'ArgumentDef',
                    name: { value: 'name', index: 0 },
                    type: 
                    [ { __TYPE__: 'TypeRef',
                        callreturn: undefined,
                        nameref: [ { __TYPE__: 'Reference', name: { value: 'Type', index: 5 } } ],
                        types: [],
                        indexer: [] } ],
                    spec: 
                    [ { __TYPE__: 'Statement',
                        statement: 
                        [ { __TYPE__: 'Gt',
                            left: { __TYPE__: 'Reference', name: { value: 'this.x', index: 10 } },
                            right: 
                            { __TYPE__: 'Literal',
                                type: 'integer',
                                value: { value: '10', index: 15 } } } ] } ] } ]
                )
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
                callreturn: undefined,
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
        let input = 'int{> 10}'
        let proc = false
        // output
        let output = (r:ResultTokens, c:any) => {
            expect(flat(c)).to.deep.eq(
                [ { __TYPE__: 'ReturnDef',
    type: 
     { __TYPE__: 'TypeRef',
       callreturn: undefined,
       nameref: [ { __TYPE__: 'Reference', name: { value: 'int', index: 0 } } ],
       types: [],
       indexer: [] },
    spec: 
     [ { __TYPE__: 'Statement',
         statement: 
          [ { __TYPE__: 'Gt',
              left: { __TYPE__: 'Reference', name: { value: 'this', index: 4 } },
              right: 
               { __TYPE__: 'Literal',
                 type: 'integer',
                 value: { value: '10', index: 6 } } } ] } ] } ]
            )
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
            let input = 'new -> bar'
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    Emit.Emit(MethodDef, {
                        name: {name:{value:"constructor", index:0}},
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
            parse(input)(rule(Def.typedef_member_dec).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts constructor(x:int):', () => {
            // input
            let proc = false
            let input = 'constructor(x:int):'
            // output
            let output = (r:ResultTokens, c:any) => {
                expect(flat(c)).to.deep.eq([
                    Emit.Emit(MethodDef, {
                        name: {name: {value:"constructor", index:0} },
                        attributes:[],
                        accessors: [],
                        arguments: [
                            Emit.Emit(ArgumentDef,{
                                name: { value: 'x', index: 12 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"int",index:14}})], 
                                        typeargs: [],
                                        indexargs: []
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
            parse(input)(rule(Def.typedef_member_dec).yields(output))
            expect(proc).to.be.eq(true)
        })
        it('accepts void func(x:Y, u:U, j:P{.len < i}):', () => {
            // input
            let proc = false
            let input = 'public void foo(x:Y, u:U, j:P{.len < i}) = pass'
            // output
            let output = (r:ResultTokens, c:any) => { 
                console.log(JSON.stringify(c,null,2))
                expect(flat(c)).to.deep.eq([
                    Emit.Emit(MethodDef, {
                        name: {name:{value:"foo", index:12}},
                        attributes:[],
                        accessors: [{value:"public", index:0}],
                        arguments: [
                            Emit.Emit(ArgumentDef,{
                                name: { value: 'x', index: 16 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"Y",index:18}})], 
                                        typeargs: [],
                                        indexargs: []
                                    })
                                ],
                                spec: []
                            }),
                            Emit.Emit(ArgumentDef,{
                                name: { value: 'u', index: 21 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"U",index:23}})], 
                                        typeargs: [],
                                        indexargs: []
                                    })
                                ],
                                spec: []
                            }),
                            Emit.Emit(ArgumentDef, {
                                name: { value: 'j', index: 26 },
                                type: [
                                    Emit.Emit(TypeRef, { 
                                        nameref: [Emit.Emit(Reference, {name:{value:"P",index:28}})], 
                                        typeargs: [],
                                        indexargs: []
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
                                    name:{value:"pass", index: 42}
                                })]
                            })
                        ],
                        return: Emit.Emit(ReturnDef, {
                            type: Emit.Emit(TypeRef, {
                                nameref: [
                                    Emit.Emit(Reference, {name:{value:"void", index:7}})
                                ],
                                typeargs: [],
                                indexargs: []
                            }),
                            spec: []
                        })
                    })
                ])
                expect(r.tokens.length).to.eq(0)
                proc = true
            }
            parse(input)(rule(Def.typedef_member).yields(output))
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
            parse(input)(rule(Def.typedef_member_dec).yields(output))
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
                      insert:
                      { 
                          __TYPE__: 'Reference',
                          name: {
                            value: 'statement', 
                            index: 17 
                          } 
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
            let input = `
macro foringenerator for $statement:
as $statement for $atom.reference in $atom.range:
    emit <[
        () => for $atom.reference in $atom.range: yield $statement
    ]>
`    
            let proc = false
            // output
            let output = (r:ResultTokens, c:any) => {
                c[0].rule /*?*/
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
                expect(flat(c)).to.deep.eq(
                    [ { __TYPE__: 'Statement',
    statement: 
     [ { __TYPE__: 'Apply',
         apply: { __TYPE__: 'Reference', name: { value: 'a', index: 7 } },
         to: { __TYPE__: 'Reference', name: { value: 'return', index: 0 } } } ] } ]
                )
                proc = true
            }
            parse(input)(rule(Stmt.statement).yields(output))
            expect(proc).to.be.eq(true)
        })
    })
})
