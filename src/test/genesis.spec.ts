import { expect } from "chai";
import "mocha";
import { Tibu } from "tibu";
import { Martha } from "../martha";
import * as fs from "fs"
import * as path from "path"
import { ProgramDef } from "../martha.program";

let martha = new Martha()

function parse(file:string):ProgramDef {
    let src = fs.readFileSync(file, "utf8")
    return martha.parse(src)
}

describe("genesis", () => {
    let iballot = parse(__dirname + "../../genesis/IBallot.ma")
    let iparty = parse(__dirname + "../../genesis/IParty.ma")
    let itoken = parse(__dirname + "../../genesis/IToken.ma")
    let itxhook = parse(__dirname + "../../genesis/ITxHook.ma")
    let chair = parse(__dirname + "../../genesis/Chair.ma")
    let stake = parse(__dirname + "../../genesis/Stake.ma")
        
    it("should be a program", () => {
        expect(iballot).to.not.be.null
        expect(iparty).to.not.be.null
        expect(itoken).to.not.be.null
        expect(itxhook).to.not.be.null
        expect(chair).to.not.be.null
        expect(stake).to.not.be.null
        console.log(JSON.stringify(stake.types[0].methods[7], null, 2))
        console.log(stake.types[0])
        //fs.writeFileSync(__dirname + "../../genesis/_IBallot.json", JSON.stringify(program, null, 2))
    })


})