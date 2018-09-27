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
describe('syntax.m', () => {
    it('accepts type:\n    Binary\nwith:\n    object: left\n    object: right\n', () => {
        // input
        let input = 'type Binary:\n    object: left\n    object: right\n';
        let proc = false;
        // output
        let output = (r, c) => {
            chai_1.expect(flat(c)).to.deep.eq([martha_emit_1.Emit.Emit(martha_emit_1.TypeDef, {
                    name: martha_emit_1.Emit.Emit(martha_emit_1.Token, { value: "Binary", index: 5 }),
                    members: [
                        martha_emit_1.Emit.Emit(martha_emit_1.MemberDef, {
                            type: martha_emit_1.Emit.Emit(martha_emit_1.TypeRef, {
                                nameref: [
                                    martha_emit_1.Emit.Emit(martha_emit_1.Reference, {
                                        name: martha_emit_1.Emit.Emit(martha_emit_1.Token, { value: "object", index: 0 })
                                    })
                                ],
                            }),
                            name: { value: "left", index: 0 }
                        })
                    ]
                })]);
            proc = true;
        };
        parse(input)(rule(Def.typedef).yields(output));
        chai_1.expect(proc).to.be.eq(true);
    });
});
//# sourceMappingURL=martha.ast.spec.js.map