"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const martha_grammar_1 = require("./martha.grammar");
const martha_program_1 = require("./martha.program");
class Martha {
    constructor() {
        this.program = new martha_grammar_1.ParserContext();
    }
    parse(source) {
        return this.program.parse(source);
    }
    load(source) {
        let programdef = source instanceof martha_program_1.ProgramDef ? source : this.parse(source);
        let errors = [];
        this.visit(programdef, errors);
    }
    visit(programdef, errors) {
        // TODO visit imports
        this.visitMacros(programdef.macros, errors);
        // visittypes
        this.visitTypes(programdef.types, errors);
        // TODO vist statements
    }
    visitMacros(macros, errors) {
        macros.forEach(macro => this.visitMacro(macro, errors));
    }
    visitMacro(macro, errors) {
        try {
            this.program.addMacro(macro);
        }
        catch (e) {
            throw e;
        }
    }
    visitTypes(types, errors) {
        types.forEach(type => this.visitType(type, errors));
    }
    visitType(type, errors) {
    }
}
exports.Martha = Martha;
//# sourceMappingURL=martha.js.map