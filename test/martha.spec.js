"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var ditto_1 = require("../ditto");
var martha_grammar_1 = require("../martha.grammar");
describe("Martha!", function () {
    var ast = ditto_1.Ditto.parse("Foo")(martha_grammar_1.Mod.typedef_name);
    chai_1.expect(ast).to.deep.eq([{ typenames: ["Foo"] }]);
});
//# sourceMappingURL=martha.spec.js.map