import { TypeDef, ImportDef, MacroDef } from "./martha.emit";

export class ProgramDef {
    imports!: ImportDef[]
    macros!: MacroDef[]
    types!: TypeDef[]
}