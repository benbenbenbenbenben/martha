import { expect } from "chai";
import "mocha";
import { AST } from "../martha.ast";
import { Ditto } from "../ditto";
import { Mod } from "../martha.grammar";

describe("Martha!", () => {
    // type name
    describe("basic types", () => {
        it("should parse type name", () => {
            expect(Ditto.parse(`Foo`)(Mod.typedef_name)).to.deep.eq([{name:["Foo"]}]);
        });
        it("should parse a base type name", () => {
            expect(Ditto.parse(`Bar`)(Mod.typedef_basetype)).to.deep.eq([{basetype:["Bar"]}]);
        });
        it("should parse a type member", () => {
            expect(Ditto.parse(`Type: Member`)(Mod.typedef_member)).to.deep.eq([{members:[{type:"Type",name:"Member"}]}]);
        });
        it("should parse a type with a base type", () => {
            expect(Ditto.parse(`type: Foo is: Bar`)(Mod.typedef)).to.deep.eq([{types:[{name:"Foo",basetype:"Bar"}]}]);
        });
        it("should parse a basic type", () => {
            expect(Ditto.parse(`type: Foo`)(Mod.typedef)).to.deep.eq([ { types: [ { name: "Foo" } ] } ]);
        });
        it("should parse a basic type with a member variable", () => {
            expect(Ditto.parse(`type: Foo is: Bar with:\n    Party: this`)(Mod.typedef))
            .to.deep.eq([{types:[{name:"Foo",basetype: "Bar",members:[{type:"Party",name:"this"}]}]}]);
        });
        it("should parse a 1+n type with member variables", () => {
            expect(Ditto.parse(`type: Foo, Bar is: Base with:\n    Addr: addr0, addr1`)(Mod.typedefs)).to.deep.eq(
                [[
                    {types:[{name:"Foo", basetype:"Base", members:[{type:"Addr",name:"addr0"},{type:"Addr",name:"addr1"}]}]}
                ]]
            );});
        });
});

