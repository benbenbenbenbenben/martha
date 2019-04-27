"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const martha_1 = require("../martha");
const fs = __importStar(require("fs"));
let martha = new martha_1.Martha();
function parse(file) {
    let src = fs.readFileSync(file, "utf8");
    let parsed = martha.parse({ source: src, identity: file });
    fs.writeFileSync(file + ".json", JSON.stringify(parsed, null, 2));
    return parsed;
}
describe("genesis", () => {
    it("should be a program", () => {
        try {
            let f = parse(__dirname + "../../genani/genesis.1.ma");
            f; /* ?+ */
        }
        catch (e) {
            console.log(e);
        }
    });
    return;
    let iballot = parse(__dirname + "../../genesis/IBallot.ma");
    let iparty = parse(__dirname + "../../genesis/IParty.ma");
    let itoken = parse(__dirname + "../../genesis/IToken.ma");
    let itxhook = parse(__dirname + "../../genesis/ITxHook.ma");
    let chair = parse(__dirname + "../../genesis/Chair.ma");
    let stake = parse(__dirname + "../../genesis/Stake.ma");
    it("should be a program", () => {
        chai_1.expect(iballot).to.not.be.null;
        //fs.writeFileSync(__dirname + "../../genesis/_IBallot.json", JSON.stringify(iballot, null, 2))
        //console.log(JSON.stringify(iballot.types[0].methods[6], null,2))
        //martha.load(iballot)
        //return
        chai_1.expect(iparty).to.not.be.null;
        chai_1.expect(itoken).to.not.be.null;
        chai_1.expect(itxhook).to.not.be.null;
        chai_1.expect(chair).to.not.be.null;
        chai_1.expect(stake).to.not.be.null;
        martha.load(iballot);
        //console.log(JSON.stringify(stake.types[0].members[1], null, 2))
        //console.log(stake.types[0].methods[11])
        //fs.writeFileSync(__dirname + "../../genesis/_IBallot.json", JSON.stringify(program, null, 2))
    });
});
//# sourceMappingURL=genesis.spec.js.map