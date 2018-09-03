import { expect } from "chai";
import "mocha";
import { Tibu } from "tibu";
import { Martha } from "../martha";

describe("Martha!", () => {
   it('compiles a macro program', () => {
       let martha = new Martha()
       let program0 = martha.parse(
`
import core

macro: foringenerator
as $atom (for $atom.reference in $atom.range):
    $atom.parent.bind $atom.reference $atom.range.current
    emit(Generator, {
        next = $atom.range.next
        current = $statement
    })
`       )
        console.log(program0.macros[0].body)
        martha.load(program0)
        let program1 = martha.parse(
`
type:
	Party
is:
	Address

type:
	Buyer, Seller, BuyerRep, SellerRep
is:
	SomeBaseType
with:
    Party: this
    bool: sentCloseRequest
constructor:
    a = 10
    b = 20
    let d e = get2things
    call(10)
    call(a(b(c(10, 90))))
    z = g => x => g ** x
    j = 4 * u for u in 1..10
atomic void record(Array[]:items{.len > 0}, int:f{> 0}, bool:flag, ref Vector<string>:s)
    ledger.process(sum)
    total += f
atomic int{> 0} send(Address:to, int:amount{> 0})
    do(bad(stuff[0].with("stuff".length)))

`       )
        console.log(program1.types[1])
        martha.load(program1)
   })
});

