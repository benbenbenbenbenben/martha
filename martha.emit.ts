export class MethodAccess {
    ispublic: boolean = false
    isprivate: boolean = false
    isprotected: boolean = false
    isinternal: boolean = false
}

export class Reference {
    name: string = ""
}

export class Literal {
    type: string = ""
    value: string = ""
}

export class Binary {
    left!: any
    right!: any
}

export class Mult extends Binary {}
export class Power extends Binary {}
export class Div extends Binary {}
export class Mod extends Binary {}
export class Plus extends Binary {}
export class Minus extends Binary {}
export class ShiftLeft extends Binary {}
export class ShiftRight extends Binary {}
export class Lt extends Binary {}
export class Lte extends Binary {}
export class Gt extends Binary {}
export class Gte extends Binary {}
export class EqEq extends Binary {}
export class NotEq extends Binary {}
export class Amp extends Binary {}
export class Caret extends Binary {}
export class Pipe extends Binary {}
export class AmpAmp extends Binary {}
export class PipePipe extends Binary {}
export class Assignment extends Binary {}
export class PlusEq extends Binary {} 
export class MinusEq extends Binary {} 
export class MultEq extends Binary {} 
export class DivEq extends Binary {} 
export class ModEq extends Binary {} 
export class ShREq extends Binary {} 
export class ShLEq extends Binary {}
export class AmpEq extends Binary {} 
export class CaretEq extends Binary {} 
export class PipeEq extends Binary {} 
export class PowerEq extends Binary {} 

export class UnaryPrefix {
    value!: any
}

export class PlusPlus extends UnaryPrefix {}
export class MinusMinus extends UnaryPrefix {}
export class Plus_Prefix extends UnaryPrefix {}
export class Minus_Prefix extends UnaryPrefix {}
export class Exc extends UnaryPrefix {}
export class Tilde extends UnaryPrefix {}
export class Splat extends UnaryPrefix {}
export class Dot_Prefix extends UnaryPrefix {}
export class TypeOf extends UnaryPrefix {}
export class AddrOf extends UnaryPrefix {}
export class SizeOf extends UnaryPrefix {}
export class StateOf extends UnaryPrefix {}
export class SwapTo extends UnaryPrefix {}
export class New extends UnaryPrefix {}
export class Delete extends UnaryPrefix {}
export class Return extends UnaryPrefix {}

export class UnaryPostfix {
    value!: any
}

export class Arrow extends UnaryPostfix {}
export class Dot extends UnaryPostfix {}
export class ConditionalDot extends UnaryPostfix {}
export class PlusPlus_Postfix extends UnaryPostfix {}
export class MinusMinus_Postfix extends UnaryPostfix {}

export class Emit {
    static Emit<T>(ctor:{new (): T}, m:T):T {
        //return new ctor()
        return Object.assign(new ctor(), m)
    }
}

export class ReturnDef {
    type!: any
    spec!: any
}

export class ArgumentDef {
    name!: any
    type!: any
    spec!: any
}

export class Statement {
    statement!: any
}

export class MethodDef {
    name!: any
    access!: MethodAccess | undefined
    async!: boolean
    atomic!: boolean
    critical!: boolean
    arguments!: ArgumentDef[]
    body!: Statement[]
    return!: ReturnDef
}

export class List {
    elements!: any[]
}