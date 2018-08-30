"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const martha_ast_1 = require("../martha.ast");
const tibu_1 = require("tibu");
const { parse, rule, either, many, all, optional } = tibu_1.Tibu;
describe("AST", () => {
    describe("prefixop", () => {
        it("should produce a prefix op", () => {
            // in
            const input = new tibu_1.ResultTokens();
            input.tokens.push({ name: "plus", result: new tibu_1.Result() });
            // out
            const output = { op: "prefix", parameters: ["plus"] };
            // verify
            chai_1.expect(martha_ast_1.AST.prefixop(input, null))
                .to.deep.eq(output);
        });
    });
});
//# sourceMappingURL=martha.ast.spec.js.map