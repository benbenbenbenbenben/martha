function serializable<T extends {new(...args:any[]):{}}>(ctor:T) {
    return class extends ctor {
        __TYPE__ = ctor.name
    }
}

export class Token {
    value!: string
    index!: number
}

export class Op {

}

@serializable
export class Apply extends Op {
    apply!: Op
    to!: Op
}

@serializable
export class MethodAccess {
    ispublic: boolean = false
    isprivate: boolean = false
    isprotected: boolean = false
    isinternal: boolean = false
}

@serializable
export class Reference extends Op {
    name!: Token
}

@serializable
export class Literal extends Op {
    type!: string
    value!: Token
}

@serializable
export class Binary extends Op {
    left!: Op
    right!: Op
}

@serializable
export class Dot extends Binary {}
@serializable
export class Mult extends Binary {}
@serializable
export class Power extends Binary {}
@serializable
export class Div extends Binary {}
@serializable
export class Mod extends Binary {}
@serializable
export class Plus extends Binary {}
@serializable
export class Minus extends Binary {}
@serializable
export class ShiftLeft extends Binary {}
@serializable
export class ShiftRight extends Binary {}
@serializable
export class Lt extends Binary {}
@serializable
export class Lte extends Binary {}
@serializable
export class Gt extends Binary {}
@serializable
export class Gte extends Binary {}
@serializable
export class EqEq extends Binary {}
@serializable
export class NotEq extends Binary {}
@serializable
export class Amp extends Binary {}
@serializable
export class Caret extends Binary {}
@serializable
export class Pipe extends Binary {}
@serializable
export class AmpAmp extends Binary {}
@serializable
export class PipePipe extends Binary {}
@serializable
export class Assignment extends Binary {}
@serializable
export class PlusEq extends Binary {} 
@serializable
export class MinusEq extends Binary {} 
@serializable
export class MultEq extends Binary {} 
@serializable
export class DivEq extends Binary {} 
@serializable
export class ModEq extends Binary {} 
@serializable
export class ShREq extends Binary {} 
@serializable
export class ShLEq extends Binary {}
@serializable
export class AmpEq extends Binary {} 
@serializable
export class CaretEq extends Binary {} 
@serializable
export class PipeEq extends Binary {} 
@serializable
export class PowerEq extends Binary {} 
@serializable
export class Range extends Binary {}
@serializable
export class ColonBin extends Binary {}
@serializable
export class QuesBin extends Binary {}
@serializable
export class ExcBin extends Binary {}


@serializable
export class UnaryPrefix extends Op {
    value!: any
}

@serializable
export class PlusPlus extends UnaryPrefix {}
@serializable
export class MinusMinus extends UnaryPrefix {}
@serializable
export class Plus_Prefix extends UnaryPrefix {}
@serializable
export class Minus_Prefix extends UnaryPrefix {}
@serializable
export class Exc extends UnaryPrefix {}
@serializable
export class Tilde extends UnaryPrefix {}
@serializable
export class Splat extends UnaryPrefix {}
@serializable
export class Dot_Prefix extends UnaryPrefix {}
@serializable
export class TypeOf extends UnaryPrefix {}
@serializable
export class AddrOf extends UnaryPrefix {}
@serializable
export class SizeOf extends UnaryPrefix {}
@serializable
export class StateOf extends UnaryPrefix {}
@serializable
export class SwapTo extends UnaryPrefix {}
@serializable
export class New extends UnaryPrefix {}
@serializable
export class Delete extends UnaryPrefix {}
@serializable
export class Return extends UnaryPrefix {}

@serializable
export class UnaryPostfix extends Op {
    value!: any
}

@serializable
export class Arrow extends UnaryPostfix {}
@serializable
export class ConditionalDot extends UnaryPostfix {}
@serializable
export class PlusPlus_Postfix extends UnaryPostfix {}
@serializable
export class MinusMinus_Postfix extends UnaryPostfix {}

export class Emit {
    static Emit<T>(ctor:{new (): T}, m:T):T {
        //return new ctor()
        delete (<any>m).__TYPE__
        return Object.assign(new ctor(), m)
    }
}

@serializable
export class TypeRef {
    modifiers?: Reference[]
    nameref?: Reference[]
    typeargs?: TypeRef[]
    indexargs?: TypeRef[]
    callargs?: TypeRef[]
}

/*
@serializable
export class IndexDef {
    type?: string | IndexDef
}
*/

@serializable
export class ReturnDef {
    type!: TypeRef
    spec!: Statement[]
}

@serializable
export class ArgumentDef {
    name!: Token
    type!: TypeRef[]
    spec!: Statement[]
}

@serializable
export class TupleArgumentDef {
    arguments!: ArgumentDef[]
}

@serializable
export class Statement {
    statement!: Op[]
}

@serializable
export class MethodDef {
    name?: Reference
    attributes?: Attribute[]
    accessors!: Token[]
    arguments!: ArgumentDef[]
    body!: Statement[]
    return?: ReturnDef
}

@serializable
export class TransitioningMethodDef extends MethodDef {
    nextstate!: Reference[]
}

@serializable
export class List {
    elements!: any[]
}

@serializable
export class MacroDef {
    name!: Token
    insert!: Token
    rule?: MacroRuleDef
}

@serializable
export class MacroRuleDef {
    rule!: Statement[]
    body!: Statement[]
}

@serializable
export class ImportDef {
    name!: Reference
    library?: Reference
}

@serializable
export class MemberDef {
    modifiers?: Token[]
    name!: Token
    arguments?: ArgumentDef[]
    type?: TypeRef
    transition?: Reference[]
    getter?: Statement[]
    setter?: Statement[]
    body?: Statement[]
}

@serializable
export class TypeDef {
    name!: Token
    basetype?: TypeRef
    members?: MemberDef[]
    states?: StateBlockDef[]
}

@serializable
export class StateBlockDef {
    state!: Reference
    members?: MemberDef[]
    substates?: StateBlockDef[]
}

@serializable
export class Lambda extends MethodDef {
}

@serializable
export class IfExp extends Op {
    expression!: Statement
    body!: Statement[]
    altbody?: Statement[]
}

@serializable
export class Attribute {
    targets?: any[]
    body!: Statement[]
}

@serializable
export class Bracket extends Op {
    statements!: Statement[]
 }

@serializable
export class BracketParen extends Bracket { }
@serializable
export class BracketCurly extends Bracket { }
@serializable
export class BracketArray extends Bracket { }