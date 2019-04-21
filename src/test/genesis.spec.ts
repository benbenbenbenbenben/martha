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
    let parsed =  martha.parse({source:src, identity:file})
    fs.writeFileSync(file + ".json", JSON.stringify(parsed,null,2))
    return parsed
}

describe("genesis", () => {
    let f = parse(__dirname + "../../genani/genesis.1.ma")
    console.log(f.imports[0])
    console.log(f.types)
    console.log(f.types[0].members)
    console.log(f.types[0].methods)
    console.log(f.types[0].states)
    
    //console.log(f.types[0].members)
    //console.log(f.types[0].basetype)
    return;
    let iballot = parse(__dirname + "../../genesis/IBallot.ma")
    let iparty = parse(__dirname + "../../genesis/IParty.ma")
    let itoken = parse(__dirname + "../../genesis/IToken.ma")
    let itxhook = parse(__dirname + "../../genesis/ITxHook.ma")
    let chair = parse(__dirname + "../../genesis/Chair.ma")
    let stake = parse(__dirname + "../../genesis/Stake.ma")
        
    it("should be a program", () => {
        expect(iballot).to.not.be.null
        //fs.writeFileSync(__dirname + "../../genesis/_IBallot.json", JSON.stringify(iballot, null, 2))
        //console.log(JSON.stringify(iballot.types[0].methods[6], null,2))
        //martha.load(iballot)
        //return
        expect(iparty).to.not.be.null
        expect(itoken).to.not.be.null
        expect(itxhook).to.not.be.null
        expect(chair).to.not.be.null
        expect(stake).to.not.be.null

        martha.load(iballot)

        //console.log(JSON.stringify(stake.types[0].members[1], null, 2))
        //console.log(stake.types[0].methods[11])
        //fs.writeFileSync(__dirname + "../../genesis/_IBallot.json", JSON.stringify(program, null, 2))
    })


})