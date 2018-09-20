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
describe("kallis.Result", () => {
    let masource = fs.readFileSync(__dirname + "../../kallis/kallis.Result.ma", "utf8");
    let martha = new martha_1.Martha();
    let program = martha.parse(masource);
    it("should be a program", () => {
        console.log(program.types[0]);
        console.dir(program.types[0].methods[2].body[0].statement[0].apply.bracketcurly[4].right.left.left.right.to.apply.bracketparen[0].body);
        chai_1.expect(program).to.not.be.null;
        fs.writeFileSync(__dirname + "../../kallis/_kallis.Result.im", JSON.stringify(program, null, 2));
    });
});
//# sourceMappingURL=kallis.Result.ma.spec.js.map