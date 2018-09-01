import { expect } from "chai";
import "mocha";
import { Tibu } from "tibu";
import { Martha } from "../martha";

describe("Martha!", () => {
   it('compiles a macro program', () => {
       let martha = new Martha()
       let program = martha.parse(
`
import core

macro: "=>"
is: infix
as: $left "=>" $right 

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
    d, e = get2things
    call(10)
    call(a(b(c(10, 90))))
    z = g => g ** g
    j = u * 4 for u in 1..100
atomic void record(Array[]:items{.len > 0}, int:f{> 0}, bool:flag, ref Vector<string>:s)
    ledger.process(sum)
    total += f
atomic int{> 0} send(Address:to, int:amount{> 0})
    do(bad(stuff[0].with("stuff".length)))

`
       )
       console.log(program.types[1].methods[0].body)
       martha.load(program)
   })
});

