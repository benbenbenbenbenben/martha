"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const tibu_1 = require("tibu");
const martha_grammar_1 = require("../martha.grammar");
const martha_emit_1 = require("../martha.emit");
const { parse, rule, either, many, all, optional } = tibu_1.Tibu;
const flat = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
        acc.concat(flat(val)) : acc.concat(val), []);
};
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
            let input = ".x";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "x" })
                ]);
                chai_1.expect(r.tokens.length).to.eq(1);
                chai_1.expect(r.tokens[0].name).to.eq("dot");
            };
            parse(input)(rule(martha_grammar_1.Def.specpredicate).yields(output));
        });
        it("accepts .member.member access", () => {
            // input
            let input = ".x.y";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "x.y" })
                ]);
                chai_1.expect(r.tokens.length).to.eq(1);
                chai_1.expect(r.tokens[0].name).to.eq("dot");
            };
            parse(input)(rule(martha_grammar_1.Def.specpredicate).yields(output));
        });
        it("accepts .member > member", () => {
            // input
            let input = ".x > y";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "x" }),
                    { op: "gt" },
                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "y" }),
                ]);
                chai_1.expect(r.tokens.length).to.eq(1);
                chai_1.expect(r.tokens[0].name).to.eq("dot");
            };
            parse(input)(rule(martha_grammar_1.Def.specpredicate).yields(output));
        });
        it("accepts .member > literal", () => {
            // input
            let input = ".x > 10";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "x" }),
                    { op: "gt" },
                    martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: "10" })
                ]);
                chai_1.expect(r.tokens.length).to.eq(1);
                chai_1.expect(r.tokens[0].name).to.eq("dot");
            };
            parse(input)(rule(martha_grammar_1.Def.specpredicate).yields(output));
        });
        it('accepts func', () => {
            // input
            let input = "func";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "func" }),
                ]);
                chai_1.expect(r.tokens.length).to.eq(0);
            };
            parse(input)(rule(martha_grammar_1.Def.specpredicate).yields(output));
        });
    });
    describe('argumentspec', () => {
        it('accepts {.x > 10}', () => {
            // input 
            let input = "{.x > 10}";
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    {
                        op: "argspec",
                        parameters: [
                            martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "this.x" }),
                            { op: "gt" },
                            martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: "10" })
                        ]
                    }
                ]);
                chai_1.expect(r.tokens.length == 0);
            };
            parse(input)(rule(martha_grammar_1.Def.argumentspec).yields(output));
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
                        op: "argdef",
                        type: "Type",
                        name: "name",
                        spec: [],
                    }
                ]);
                chai_1.expect(r.tokens.length === 2);
            };
            parse(input)(rule(martha_grammar_1.Def.argumentdef).yields(output));
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
                        op: "argdef",
                        type: "Type",
                        name: "name",
                        spec: [{
                                op: "argspec",
                                parameters: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "this.x" }),
                                    { op: "gt" },
                                    martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: "10" })
                                ]
                            }]
                    }
                ]);
                chai_1.expect(r.tokens.length === 2);
            };
            parse(input)(rule(martha_grammar_1.Def.argumentdef).yields(output));
        });
    });
    it('accepts void', () => {
        // input
        let input = 'void';
        // output
        let output = (r, c) => {
            chai_1.expect(flat(c)).to.deep.eq([{
                    op: "returndef",
                    parameters: [
                        "void"
                    ]
                }]);
            chai_1.expect(r.tokens.length).to.eq(0);
        };
        parse(input)(rule(martha_grammar_1.Def.returndef).yields(output));
    });
    it('accepts int{> 10}', () => {
        // input
        let input = 'void{> 10}';
        // output
        let output = (r, c) => {
            chai_1.expect(flat(c)).to.deep.eq([{
                    op: "returndef",
                    parameters: [
                        "void",
                        {
                            op: "argspec",
                            parameters: [
                                martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "this" }),
                                { op: "gt" },
                                martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: "10" })
                            ]
                        }
                    ]
                }]);
            chai_1.expect(r.tokens.length).to.eq(0);
        };
        parse(input)(rule(martha_grammar_1.Def.returndef).yields(output));
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
                            { op: 'argdef', type: "T", name: "x", spec: [] },
                            { op: 'argdef', type: "U", name: "y", spec: [] },
                            { op: 'argdef', type: "V", name: "z", spec: [{ op: "argspec", parameters: [
                                            martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "this" }),
                                            { op: "gt" },
                                            martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "x" })
                                        ] }] },
                        ]
                    }]);
                chai_1.expect(r.tokens.length).to.eq(0);
            };
            parse(input)(rule(martha_grammar_1.Def.argumentdefs).yields(output));
        });
    });
    describe('methoddef', () => {
        it('accepts constructor:', () => {
            // input
            let input = 'constructor:';
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([{
                        def: "method",
                        name: "constructor",
                        access: undefined,
                        async: false,
                        atomic: false,
                        critical: false,
                        arguments: undefined,
                        return: undefined
                    }]);
                chai_1.expect(r.tokens.length).to.eq(0);
            };
            parse(input)(rule(martha_grammar_1.Def.methoddef).yields(output));
        });
        it('accepts constructor(int:x):', () => {
            // input
            let proc = false;
            let input = 'constructor(int:x{ > 10}):';
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([{
                        def: "method",
                        name: "constructor",
                        access: undefined,
                        async: false,
                        atomic: false,
                        critical: false,
                        arguments: [
                            { op: "argdef", type: "int", name: "x", spec: [{ op: "argspec", parameters: [
                                            martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "this" }),
                                            { op: "gt" },
                                            martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: "10" })
                                        ] }] }
                        ],
                        return: undefined
                    }]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(martha_grammar_1.Def.methoddef).yields(output));
            chai_1.expect(proc).to.be.eq(true);
        });
        it('accepts void func(Y:x, U:u, P:j{.len < u}):', () => {
            // input
            let proc = false;
            let input = 'public void foo(Y:x, U:u, P:j{.len < i}):';
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([{
                        def: "method",
                        name: "foo",
                        access: martha_emit_1.Emit.Emit(martha_emit_1.MethodAccess, { ispublic: true }),
                        async: false,
                        atomic: false,
                        critical: false,
                        arguments: [
                            { op: "argdef", type: "Y", name: "x", spec: [] },
                            { op: "argdef", type: "U", name: "u", spec: [] },
                            { op: "argdef", type: "P", name: "j", spec: [
                                    { op: "argspec", parameters: [
                                            martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "this.len" }),
                                            { op: "lt" },
                                            martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "i" }),
                                        ] },
                                ] },
                        ],
                        return: { op: "returndef", parameters: ["void"] }
                    }]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(martha_grammar_1.Def.methoddef).yields(output));
            chai_1.expect(proc).to.eq(true);
        });
    });
});
describe('Exp', () => {
    describe("exp", () => {
        it('accepts a = 10', () => {
            // input
            let input = 'a = 10';
            let proc = false;
            // output
            let output = (r, c) => {
                chai_1.expect(flat(c)).to.deep.eq([
                    martha_emit_1.Emit.Emit(martha_emit_1.Assignment, {
                        left: martha_emit_1.Emit.Emit(martha_emit_1.Reference, { name: "a" }),
                        right: martha_emit_1.Emit.Emit(martha_emit_1.Literal, { type: "integer", value: "10" }),
                    })
                ]);
                chai_1.expect(r.tokens.length).to.eq(0);
                proc = true;
            };
            parse(input)(rule(martha_grammar_1.Stmt.stmt_expression).yields(output));
            chai_1.expect(proc).to.to.eq(true);
        });
    });
});
//# sourceMappingURL=martha.grammar.spec.js.map