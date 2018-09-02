"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MethodAccess {
    constructor() {
        this.ispublic = false;
        this.isprivate = false;
        this.isprotected = false;
        this.isinternal = false;
    }
}
exports.MethodAccess = MethodAccess;
class Reference {
    constructor() {
        this.name = "";
    }
}
exports.Reference = Reference;
class Literal {
    constructor() {
        this.type = "";
        this.value = "";
    }
}
exports.Literal = Literal;
class Binary {
}
exports.Binary = Binary;
class Dot extends Binary {
}
exports.Dot = Dot;
class Mult extends Binary {
}
exports.Mult = Mult;
class Power extends Binary {
}
exports.Power = Power;
class Div extends Binary {
}
exports.Div = Div;
class Mod extends Binary {
}
exports.Mod = Mod;
class Plus extends Binary {
}
exports.Plus = Plus;
class Minus extends Binary {
}
exports.Minus = Minus;
class ShiftLeft extends Binary {
}
exports.ShiftLeft = ShiftLeft;
class ShiftRight extends Binary {
}
exports.ShiftRight = ShiftRight;
class Lt extends Binary {
}
exports.Lt = Lt;
class Lte extends Binary {
}
exports.Lte = Lte;
class Gt extends Binary {
}
exports.Gt = Gt;
class Gte extends Binary {
}
exports.Gte = Gte;
class EqEq extends Binary {
}
exports.EqEq = EqEq;
class NotEq extends Binary {
}
exports.NotEq = NotEq;
class Amp extends Binary {
}
exports.Amp = Amp;
class Caret extends Binary {
}
exports.Caret = Caret;
class Pipe extends Binary {
}
exports.Pipe = Pipe;
class AmpAmp extends Binary {
}
exports.AmpAmp = AmpAmp;
class PipePipe extends Binary {
}
exports.PipePipe = PipePipe;
class Assignment extends Binary {
}
exports.Assignment = Assignment;
class PlusEq extends Binary {
}
exports.PlusEq = PlusEq;
class MinusEq extends Binary {
}
exports.MinusEq = MinusEq;
class MultEq extends Binary {
}
exports.MultEq = MultEq;
class DivEq extends Binary {
}
exports.DivEq = DivEq;
class ModEq extends Binary {
}
exports.ModEq = ModEq;
class ShREq extends Binary {
}
exports.ShREq = ShREq;
class ShLEq extends Binary {
}
exports.ShLEq = ShLEq;
class AmpEq extends Binary {
}
exports.AmpEq = AmpEq;
class CaretEq extends Binary {
}
exports.CaretEq = CaretEq;
class PipeEq extends Binary {
}
exports.PipeEq = PipeEq;
class PowerEq extends Binary {
}
exports.PowerEq = PowerEq;
class UnaryPrefix {
}
exports.UnaryPrefix = UnaryPrefix;
class PlusPlus extends UnaryPrefix {
}
exports.PlusPlus = PlusPlus;
class MinusMinus extends UnaryPrefix {
}
exports.MinusMinus = MinusMinus;
class Plus_Prefix extends UnaryPrefix {
}
exports.Plus_Prefix = Plus_Prefix;
class Minus_Prefix extends UnaryPrefix {
}
exports.Minus_Prefix = Minus_Prefix;
class Exc extends UnaryPrefix {
}
exports.Exc = Exc;
class Tilde extends UnaryPrefix {
}
exports.Tilde = Tilde;
class Splat extends UnaryPrefix {
}
exports.Splat = Splat;
class Dot_Prefix extends UnaryPrefix {
}
exports.Dot_Prefix = Dot_Prefix;
class TypeOf extends UnaryPrefix {
}
exports.TypeOf = TypeOf;
class AddrOf extends UnaryPrefix {
}
exports.AddrOf = AddrOf;
class SizeOf extends UnaryPrefix {
}
exports.SizeOf = SizeOf;
class StateOf extends UnaryPrefix {
}
exports.StateOf = StateOf;
class SwapTo extends UnaryPrefix {
}
exports.SwapTo = SwapTo;
class New extends UnaryPrefix {
}
exports.New = New;
class Delete extends UnaryPrefix {
}
exports.Delete = Delete;
class Return extends UnaryPrefix {
}
exports.Return = Return;
class UnaryPostfix {
}
exports.UnaryPostfix = UnaryPostfix;
class Arrow extends UnaryPostfix {
}
exports.Arrow = Arrow;
class ConditionalDot extends UnaryPostfix {
}
exports.ConditionalDot = ConditionalDot;
class PlusPlus_Postfix extends UnaryPostfix {
}
exports.PlusPlus_Postfix = PlusPlus_Postfix;
class MinusMinus_Postfix extends UnaryPostfix {
}
exports.MinusMinus_Postfix = MinusMinus_Postfix;
class Emit {
    static Emit(ctor, m) {
        //return new ctor()
        return Object.assign(new ctor(), m);
    }
}
exports.Emit = Emit;
class ReturnDef {
}
exports.ReturnDef = ReturnDef;
class ArgumentDef {
}
exports.ArgumentDef = ArgumentDef;
class Statement {
}
exports.Statement = Statement;
class MethodDef {
}
exports.MethodDef = MethodDef;
class List {
}
exports.List = List;
class MacroDef {
    identity() { return `${this.name};${this.rule}`; }
}
exports.MacroDef = MacroDef;
class ImportDef {
}
exports.ImportDef = ImportDef;
class TypeDef {
}
exports.TypeDef = TypeDef;
class Lambda extends MethodDef {
}
exports.Lambda = Lambda;
//# sourceMappingURL=martha.emit.js.map