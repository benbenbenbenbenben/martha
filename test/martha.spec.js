"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var tibu_1 = require("tibu");
var martha_grammar_1 = require("../martha.grammar");
describe("Martha!", function () {
    // type name
    describe("basic types", function () {
        it("should parse type name", function () {
            chai_1.expect(tibu_1.Tibu.parse("Foo")(martha_grammar_1.Mod.typedef_name)).to.deep.eq([{ name: ["Foo"] }]);
        });
        it("should parse a base type name", function () {
            chai_1.expect(tibu_1.Tibu.parse("Bar")(martha_grammar_1.Mod.typedef_basetype)).to.deep.eq([{ basetype: ["Bar"] }]);
        });
        it("should parse a type member", function () {
            chai_1.expect(tibu_1.Tibu.parse("Type: Member")(martha_grammar_1.Mod.typedef_member)).to.deep.eq([{ members: [{ type: "Type", name: "Member" }] }]);
        });
        it("should parse a type with a base type", function () {
            chai_1.expect(tibu_1.Tibu.parse("type: Foo is: Bar")(martha_grammar_1.Mod.typedef)).to.deep.eq([{ types: [{ name: "Foo", basetype: "Bar" }] }]);
        });
        it("should parse a basic type", function () {
            chai_1.expect(tibu_1.Tibu.parse("type: Foo")(martha_grammar_1.Mod.typedef)).to.deep.eq([{ types: [{ name: "Foo" }] }]);
        });
        it("should parse a basic type with a member variable", function () {
            chai_1.expect(tibu_1.Tibu.parse("type: Foo is: Bar with:\n    Party: this")(martha_grammar_1.Mod.typedef))
                .to.deep.eq([{ types: [{ name: "Foo", basetype: "Bar", members: [{ type: "Party", name: "this" }] }] }]);
        });
        it("should parse a 1+n type with member variables", function () {
            chai_1.expect(tibu_1.Tibu.parse("type: Foo, Bar is: Base with:\n    Addr: addr0, addr1")(martha_grammar_1.Mod.typedefs)).to.deep.eq([[
                    { types: [{ name: "Foo", basetype: "Base", members: [{ type: "Addr", name: "addr0" }, { type: "Addr", name: "addr1" }] }] }
                ]]);
        });
    });
});
//# sourceMappingURL=martha.spec.js.map