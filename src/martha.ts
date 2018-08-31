import { ParserContext } from "./martha.grammar";
import { ProgramDef } from "./martha.program";
import { TypeDef, MacroDef } from "./martha.emit";

export class Martha {
    private program: ParserContext
    constructor() {
        this.program = new ParserContext()
    }
    public parse(source:string): ProgramDef {
        return this.program.parse(source)
    }
    public load(source:string | ProgramDef): void {
        let programdef = source instanceof ProgramDef ? source : this.parse(source)
        let errors:any[] = []
        this.visit(programdef, errors)
    }
    private visit(programdef:ProgramDef, errors:any[]): void {
        // TODO visit imports
        this.visitMacros(programdef.macros, errors)

        // visittypes
        this.visitTypes(programdef.types, errors)

        // TODO vist statements
    }
    private visitMacros(macros:MacroDef[], errors:any[]):void {
        macros.forEach(macro => this.visitMacro(macro, errors))
    }
    private visitMacro(macro:MacroDef, errors:any[]):void {
        try { 
            this.program.addMacro(macro)
        }
        catch (e) {
            throw e
        }
    }
    private visitTypes(types:TypeDef[], errors:any[]): void {
        types.forEach(type => this.visitType(type, errors))
    }
    private visitType(type:TypeDef, errors:any[]):void {

    }
}