import { TypeDef, ImportDef, MacroDef } from "./martha.emit";

export class ProgramDef {
    identity?: string
    imports!: ImportDef[]
    macros!: MacroDef[]
    types!: TypeDef[]
}