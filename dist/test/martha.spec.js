"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const tibu_1 = require("tibu");
const martha_grammar_1 = require("../martha.grammar");
describe("Martha!", () => {
    // type name
    describe("basic types", () => {
        it("should parse type name", () => {
            chai_1.expect(tibu_1.Tibu.parse(`Foo`)(martha_grammar_1.Mod.typedef_name)).to.deep.eq([{ name: ["Foo"] }]);
        });
        it("should parse a base type name", () => {
            chai_1.expect(tibu_1.Tibu.parse(`Bar`)(martha_grammar_1.Mod.typedef_basetype)).to.deep.eq([{ basetype: ["Bar"] }]);
        });
        it("should parse a type member", () => {
            chai_1.expect(tibu_1.Tibu.parse(`Type: Member`)(martha_grammar_1.Mod.typedef_member)).to.deep.eq([{ members: [{ type: "Type", name: "Member" }] }]);
        });
        it("should parse a type with a base type", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type: Foo is: Bar`)(martha_grammar_1.Mod.typedef)).to.deep.eq([{ types: [{ name: "Foo", basetype: "Bar" }] }]);
        });
        it("should parse a basic type", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type: Foo`)(martha_grammar_1.Mod.typedef)).to.deep.eq([{ types: [{ name: "Foo" }] }]);
        });
        it("should parse a basic type with a member variable", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type: Foo is: Bar with:\n    Party: this`)(martha_grammar_1.Mod.typedef))
                .to.deep.eq([{ types: [{ name: "Foo", basetype: "Bar", members: [{ type: "Party", name: "this" }] }] }]);
        });
        it("should parse a 1+n type with member variables", () => {
            chai_1.expect(tibu_1.Tibu.parse(`type: Foo, Bar is: Base with:\n    Addr: addr0, addr1`)(martha_grammar_1.Mod.typedefs)).to.deep.eq([[
                    { types: [{ name: "Foo", basetype: "Base", members: [{ type: "Addr", name: "addr0" }, { type: "Addr", name: "addr1" }] }] }
                ]]);
        });
    });
});
//# sourceMappingURL=martha.spec.js.map