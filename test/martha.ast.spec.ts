import { expect } from "chai";
import "mocha";
import { AST } from "../martha.ast";
import { Tibu, ResultTokens, Result } from "tibu";
import { Mod } from "../martha.grammar";
const { parse, rule, either, many, all, optional } = Tibu;

describe("AST", () => {
    describe("prefixop", () => {
        it("should produce a prefix op", () => {
            // in
            const input = new ResultTokens();
            input.tokens.push({name:"plus", result: new Result()})
            // out
            const output = { op: "prefix", parameters: ["plus"] }
            // verify
            expect(AST.prefixop(input, null))
                .to.deep.eq(output)
        })
    });
});