import { expect } from "chai";
import "mocha";
import { Tibu } from "tibu";
import { Martha } from "../src/martha";

describe("Martha!", () => {
   it('compiles a macro program', () => {
       let martha = new Martha()
       let program = martha.parse(
`
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

`
       )
       console.log(program)
       martha.load(program)
   })
});

