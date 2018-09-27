import { expect } from "chai";
import "mocha";
import { Tibu } from "tibu";
import { Martha } from "../martha";
import * as fs from "fs"
import * as path from "path"

describe("kallis.Result", () => {
    let masource = fs.readFileSync(__dirname + "../../kallis/kallis.Result.ma", "utf8")
    let martha = new Martha()
    let program = martha.parse({source:masource, identity:""})
    
    it("should be a program", () => {
        console.log(program.types[0])
        console.dir(program.types![0].methods![2].body[0].statement[0])
        expect(program).to.not.be.null

        fs.writeFileSync(__dirname + "../../kallis/_kallis.Result.im", JSON.stringify(program, null, 2))
    })


})