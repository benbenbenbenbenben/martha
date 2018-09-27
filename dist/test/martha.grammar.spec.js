"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const tibu_1 = require("tibu");
const martha_emit_1 = require("../martha.emit");
const martha_grammar_1 = require("../martha.grammar");
const { parse, rule, either, many, all, optional } = tibu_1.Tibu;
const flat = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
        acc.concat(flat(val)) : acc.concat(val), []);
};
const parserContext = new martha_grammar_1.ParserContext();
const Def = parserContext.def;
const Stmt = parserContext.stmt;
describe("types", () => {
    // type name
    describe("basic types", () => {
        it("should parse type name", () => {
            chai_1.expect(tibu_1.Tibu.parse(`Foo`)(Def.typedef_name)).to.deep.eq([{
                    typename: [
                        { value: "Foo", index: 0 }
                    ]
                }]);
        });
        it("should parse a base type name", () => {
            chai_1.expect(tibu_1.Tibu.parse(`Bar`)(Def.typedef_basetype)[0].cst).to.deep.eq([[{
                        __TYPE__: 'TypeRef',
                        nameref: [{ __TYPE__: 'Reference', name: { value: 'Bar', index: 0 } }],
                        indexer: []
                    }]]);
        });
        it("should parse a type member", () => {
            chai_1.expect(tibu_1.Tibu.parse(`Type: Member`)(Def.typedef_member)).to.deep.eq([[{
                        __TYPE__: 'MemberDef',
                        type: {
                            __TYPE__: 'TypeRef',
                            nameref: [{ __TYPE__: 'Reference', name: { value: 'Type', index: 0 } }],
                            indexer: []
                        },
                        name: { value: 'Member', index: 6 },
                        getter: [],
                        setter: []
                    }]]);
        });
        it("should parse a type with a base type", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type Foo is Bar:`)(Def.typedef)).to.deep.eq([[
                    martha_emit_1.Emit.Emit(martha_emit_1.TypeDef, {
                        name: { value: "Foo", index: 5 },
                        basetype: martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                            nameref: [
                                martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "Bar", index: 12 } })
                            ],
                            indexer: []
                        }),
                        members: [],
                        methods: []
                    })
                ]]);
        });
        it("should parse a basic type", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type Foo:`)(Def.typedef)).to.deep.eq([[
                    martha_emit_1.Emit.Emit(martha_emit_1.TypeDef, {
                        name: { value: "Foo", index: 5 },
                        basetype: undefined,
                        members: [],
                        methods: []
                    })
                ]]);
        });
        it("should parse a basic type with a member variable", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type Foo is Bar:\n    Party: this`)(Def.typedef))
                .to.deep.eq([[
                    martha_emit_1.Emit.Emit(martha_emit_1.TypeDef, {
                        name: { value: "Foo", index: 5 },
                        basetype: martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                            nameref: [martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "Bar", index: 12 } })],
                            indexer: []
                        }),
                        members: [
                            martha_emit_1.Emit.Emit(martha_emit_1.MemberDef, {
                                type: martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                                    nameref: [martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "Party", index: 21 } })],
                                    indexer: []
                                }),
                                name: { value: "this", index: 28 },
                                getter: [],
                                setter: []
                            })
                        ],
                        methods: []
                    })
                ]]);
        });
        it("should parse a 1+n type with member variables", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type Foo, Bar is Base:\n    Addr: addr0, addr1`)(Def.typedefs)).to.deep.eq([[
                    {
                        name: "Foo", basetype: "Base", methods: [], members: [{ type: "Addr", name: "addr0" }, { type: "Addr", name: "addr1" }]
                    },
                    {
                        name: "Bar", basetype: "Base", methods: [], members: [{ type: "Addr", name: "addr0" }, { type: "Addr", name: "addr1" }]
                    }
                ]]);
        });
    });
});
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
            let input = "{.x}";
            // output
            let output = (r, c) => {
                console.log(c[0][0]);
                chai_1.expect(flat(c)).to.deep.eq([
                    { statement: [
                            { name: "this.x" }
                        ]
                    }
                ]);
            };
            parse(input)(rule(Def.argumentspec).yields(output));
        });
        it("accepts {.x.y}", () => {
            // input
            let input = "{.x.y}";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Statement, { statement: [{ name: "this.x.y" }]
                    })
                ]);
            };
            parse(input)(rule(Def.argumentspec).yields(output));
        });
        it("accepts {this.x > y}", () => {
            // input
            let input = "{this.x > y}";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Statement, { statement: [
                            martha_emit_1.Emit.Emit(martha_emit_1.Gt, {
                                left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, {
                                    name: martha_emit_1.Emit.Emit(martha_emit_1.Token, {
                                        value: "this.x",
                                        index: 1
                                    })
                                }),
                                right: martha_emit_1.Emit.Emit(martha_emit_1.Reference, {
                                    name: martha_emit_1.Emit.Emit(martha_emit_1.Token, {
                                        value: "y",
                                        index: 10
                                    })
                                }),
                            })
                        ]
                    })
                ]);
            };
            parse(input)(rule(Def.argumentspec).yields(output));
        });
        it("accepts {.x > 10}", () => {
            // input
            let input = "{.x > 10}";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    { statement: [
                            martha_emit_1.Emit.Emit(martha_emit_1.Gt, {
                                left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "this.x", index: 0 } }),
                                right: martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: { value: "10", index: 10 } }),
                            })
                        ]
                    }
                ]);
            };
            parse(input)(rule(Def.argumentspec).yields(output));
        });
        it('accepts {func}', () => {
            // input
            let input = "{func}";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "func", index: 1 } })
                ]);
                chai_1.expect(r.tokens.length).to.eq(0);
            };
            parse(input)(rule(Def.argumentspec).yields(output));
        });
    });
    describe('argumentdef', () => {
        it('accepts Type:name', () => {
            // input
            let input = "Type:name";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    {
                        type: "Type",
                        name: "name",
                        spec: [],
                    }
                ]);
                chai_1.expect(r.tokens.length === 2);
            };
            parse(input)(rule(Def.argumentdef).yields(output));
        });
    });
    describe('argumentdef', () => {
        it('accepts Type:name{.x > 10}', () => {
            // input
            let input = "Type:name{.x > 10}";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    {
                        __TYPE__: "ArgumentDef",
                        type: [martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {})],
                        name: { name: { value: "name", index: 5 } },
                        spec: [
                            martha_emit_1.Emit.Emit(martha_emit_1.Gt, {
                                left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "this.x", index: 10 } }),
                                right: martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: { value: "10", index: 15 } })
                            })
                        ]
                    }
                ]);
                chai_1.expect(r.tokens.length === 2);
            };
            parse(input)(rule(Def.argumentdef).yields(output));
        });
    });
    it('accepts void', () => {
        // input
        let input = 'void';
        // output
        let output = (r, c) => {
            chai_1.expect(flat(c)).to.deep.eq([{ __TYPE__: 'ReturnDef',
                    type: { __TYPE__: 'TypeRef',
                        nameref: [{ __TYPE__: 'Reference', name: { value: 'void', index: 0 } }],
                        indexer: [] },
                    spec: [] }
            ]);
            chai_1.expect(r.tokens.length).to.eq(0);
        };
        parse(input)(rule(Def.returndef).yields(output));
    });
    it('accepts int{> 10}', () => {
        // input
        let input = 'void{> 10}';
        let proc = false;
        // output
        let output = (r, c) => {
            chai_1.expect(flat(c)).to.deep.eq([
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
            ]);
            chai_1.expect(r.tokens.length).to.eq(0);
            proc = true;
        };
        parse(input)(rule(Def.returndef).yields(output));
        chai_1.expect(proc).to.be.eq(true);
    });
    describe('argumentdefs', () => {
        it('accepts T:x, U:y, V:z{> x}', () => {
            // input
            let input = 'T:x, U:y, V:z{> x}';
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([{
                        op: 'argdefs',
                        parameters: [
                            { type: "T", name: "x", spec: [] },
                            { type: "U", name: "y", spec: [] },
                            { type: "V", name: "z", spec: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.Gt, {
                                        left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "this", index: 0 } }),
                                        right: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "x", index: 3 } })
                                    })
                                ] },
                        ]
                    }]);
                chai_1.expect(r.tokens.length).to.eq(0);
            };
            parse(input)(rule(Def.argumentdefs).yields(output));
        });
    });
    describe('methoddef', () => {
        it('accepts constructor:', () => {
            // input
            let input = 'constructor:';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.MethodDef, {
                        name: { value: "constructor", index: 0 },
                        attributes: [],
                        accessors: [],
                        arguments: [],
                        body: [],
                        return: undefined
                    })
                ]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(Def.methoddef).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
        it('accepts constructor(int:x):', () => {
            // input
            let proc = false;
            let input = 'constructor(int:x):';
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.MethodDef, {
                        name: { value: "constructor", index: 0 },
                        attributes: [],
                        accessors: [],
                        arguments: [
                            martha_emit_1.Emit.Emit(martha_emit_1.ArgumentDef, {
                                name: { value: 'x', index: 16 },
                                type: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                                        nameref: [martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "int", index: 12 } })],
                                        indexer: []
                                    })
                                ],
                                spec: []
                            })
                        ],
                        body: [],
                        return: undefined
                    })
                ]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(Def.methoddef).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
        it('accepts void func(Y:x, U:u, P:j{.len < u}):', () => {
            // input
            let proc = false;
            let input = 'public void: foo(Y:x, U:u, P:j{.len < i}): pass';
            // output
            let output = (r, c) => {
                console.log(JSON.stringify(c, null, 2));
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.MethodDef, {
                        name: { value: "foo", index: 13 },
                        attributes: [],
                        accessors: [{ value: "public", index: 0 }],
                        arguments: [
                            martha_emit_1.Emit.Emit(martha_emit_1.ArgumentDef, {
                                name: { value: 'x', index: 19 },
                                type: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                                        nameref: [martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "Y", index: 17 } })],
                                        indexer: []
                                    })
                                ],
                                spec: []
                            }),
                            martha_emit_1.Emit.Emit(martha_emit_1.ArgumentDef, {
                                name: { value: 'u', index: 24 },
                                type: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                                        nameref: [martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "U", index: 22 } })],
                                        indexer: []
                                    })
                                ],
                                spec: []
                            }),
                            martha_emit_1.Emit.Emit(martha_emit_1.ArgumentDef, {
                                name: { value: 'j', index: 29 },
                                type: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                                        nameref: [martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "P", index: 27 } })],
                                        indexer: []
                                    })
                                ],
                                spec: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.Statement, {
                                        statement: [
                                            martha_emit_1.Emit.Emit(martha_emit_1.Lt, {
                                                left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "this.len", index: 31 } }),
                                                right: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "i", index: 38 } })
                                            })
                                        ]
                                    })
                                ]
                            })
                        ],
                        body: [
                            martha_emit_1.Emit.Emit(martha_emit_1.Statement, {
                                statement: [martha_emit_1.Emit.Emit(martha_emit_1.Reference, {
                                        name: { value: "pass", index: 43 }
                                    })]
                            })
                        ],
                        return: martha_emit_1.Emit.Emit(martha_emit_1.ReturnDef, {
                            type: martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                                nameref: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "void", index: 7 } })
                                ],
                                indexer: []
                            }),
                            spec: []
                        })
                    })
                ]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(Def.methoddef).yields(output));
            chai_1.expect(proc).to.eq(true);
        });
        it('accepts int{> 0} func(int:x{> 0}, int:y{> x}):\n    return x + y + 1', () => {
            // input
            let input = 'int{> 0} func(int:x{> 0}, int:y{> x}):\n    return x + y + 1';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(Def.methoddef).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
    });
    describe("macrodef", () => {
        it('accepts macro: return when: return $subatom use: Emit.Return($subatom)', () => {
            // input
            let input = 'macro return:\nwhen: return $subatom\nuse: Emit.Return($subatom)';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([{
                        name: "return",
                        when: [{ statement: [
                                    { apply: { name: "$subatom" }, to: { name: "return" } }
                                ] }],
                        use: [{ statement: [
                                    { apply: { parenthesis: [{ name: "$subatom" }] }, to: { name: "Emit.Return" } }
                                ] }]
                    }]);
                proc = true;
            };
            parse(input)(rule(Def.macrodef).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
        it('accepts macro: foringenerator', () => {
            // input
            let input = `macro: foringenerator
as $atom ($statement for $atom.reference in $atom.range):
    $statement.bind $atom.reference $atom.range.current
    emit(Generator, {
        next = $atom.range.next,
        current = $statement
    })
`;
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([{}]);
                proc = true;
            };
            parse(input)(rule(Def.macrodef).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
    });
});
describe('Exp', () => {
    describe("exp", () => {
        it('accepts if true:\n    pass\nelse if false:\n    pass\nelse if test:\n    pass\nelse:\n    pass', () => {
            // input
            let input = `if true:
    passtrue
else if false:
    passfalse
else if alt:
    passalt
else:
    passelse
`;
            let proc = false;
            // output
            let output = (r, c) => {
                console.log(JSON.stringify(c, null, 2));
                chai_1.expect(flat(c)).to.deep.eq([{}]);
                chai_1.expect(r.tokens.length).to.eq(1);
                proc = true;
            };
            parse(input)(rule(Stmt.statement).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
        it('accepts x + y * x / w - q', () => {
            // input
            let input = 'g + y * x / w - q';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    { __TYPE__: "Statement", statement: [
                            martha_emit_1.Emit.Emit(martha_emit_1.Minus, {
                                left: martha_emit_1.Emit.Emit(martha_emit_1.Plus, {
                                    left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "g", index: 0 } }),
                                    right: martha_emit_1.Emit.Emit(martha_emit_1.Div, {
                                        left: martha_emit_1.Emit.Emit(martha_emit_1.Mult, {
                                            left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "y", index: 4 } }),
                                            right: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "x", index: 8 } }),
                                        }),
                                        right: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "w", index: 12 } })
                                    })
                                }),
                                right: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "q", index: 16 } })
                            })
                        ] }
                ]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(Stmt.statement).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
        it('accepts a = 10', () => {
            // input
            let input = 'a = 10';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)[0]).to.deep.eq({ __TYPE__: "Statement", statement: [martha_emit_1.Emit.Emit(martha_emit_1.Assignment, {
                            left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: { value: "a", index: 0 } }),
                            right: martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: { value: "10", index: 4 } }),
                        })]
                }).and.instanceof(martha_emit_1.Statement);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(Stmt.statement).yields(output));
            chai_1.expect(proc).to.to.eq(true);
        });
        it('accepts a + (b * c) * (a - (f * i))', () => {
            // input
            let input = 'a + (b * c) * (a - (f * i))';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([{
                        __TYPE__: "Statement",
                        statement: [{ __TYPE__: "Plus",
                                left: { __TYPE__: "Reference", name: { value: "a", index: 0 } },
                                right: {
                                    left: {
                                        bracketparen: [
                                            { left: { name: "b" }, right: { name: "c" } }
                                        ]
                                    },
                                    right: {
                                        bracketparen: [
                                            {
                                                left: { name: "a" },
                                                right: {
                                                    bracketparen: [
                                                        { left: { name: "f" }, right: { name: "i" } }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            }]
                    }]);
                proc = true;
            };
            parse(input)(rule(Stmt.statement).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
        it('accepts return a', () => {
            // input
            let input = 'return a';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    { __TYPE__: "Statement", statement: [
                            {
                                apply: { __TYPE__: "Reference", name: { value: 'a', index: 7 } },
                                to: { __TYPE__: "Reference", name: { value: 'return', index: 0 } }
                            }
                        ] }
                ]);
                proc = true;
            };
            parse(input)(rule(Stmt.statement).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
    });
});
//# sourceMappingURL=martha.grammar.spec.js.map