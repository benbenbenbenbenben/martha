"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const martha_1 = require("../martha");
describe("Martha!", () => {
    it('compiles a macro program', () => {
        let martha = new martha_1.Martha();
        let program = martha.parse(`
import core

macro: "¦"
is: infix
as: emit(SplitPipe, { left, right })

type: Binary
with:
    object: left
    object: right

type: ConditionalDot
is: Binary

`);
        console.log(program);
        martha.load(program);
    });
});
//# sourceMappingURL=martha.spec.js.map