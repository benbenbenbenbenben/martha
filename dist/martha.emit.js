"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function serializable(ctor) {
    return class extends ctor {
        constructor() {
            super(...arguments);
            this.__TYPE__ = ctor.name;
        }
    };
}
class Token {
}
exports.Token = Token;
class Op {
}
exports.Op = Op;
let Apply = class Apply extends Op {
};
Apply = __decorate([
    serializable
], Apply);
exports.Apply = Apply;
let MethodAccess = class MethodAccess {
    constructor() {
        this.ispublic = false;
        this.isprivate = false;
        this.isprotected = false;
        this.isinternal = false;
    }
};
MethodAccess = __decorate([
    serializable
], MethodAccess);
exports.MethodAccess = MethodAccess;
let Reference = class Reference extends Op {
};
Reference = __decorate([
    serializable
], Reference);
exports.Reference = Reference;
let Literal = class Literal extends Op {
};
Literal = __decorate([
    serializable
], Literal);
exports.Literal = Literal;
let Binary = class Binary extends Op {
};
Binary = __decorate([
    serializable
], Binary);
exports.Binary = Binary;
let Dot = class Dot extends Binary {
};
Dot = __decorate([
    serializable
], Dot);
exports.Dot = Dot;
let Mult = class Mult extends Binary {
};
Mult = __decorate([
    serializable
], Mult);
exports.Mult = Mult;
let Power = class Power extends Binary {
};
Power = __decorate([
    serializable
], Power);
exports.Power = Power;
let Div = class Div extends Binary {
};
Div = __decorate([
    serializable
], Div);
exports.Div = Div;
let Mod = class Mod extends Binary {
};
Mod = __decorate([
    serializable
], Mod);
exports.Mod = Mod;
let Plus = class Plus extends Binary {
};
Plus = __decorate([
    serializable
], Plus);
exports.Plus = Plus;
let Minus = class Minus extends Binary {
};
Minus = __decorate([
    serializable
], Minus);
exports.Minus = Minus;
let ShiftLeft = class ShiftLeft extends Binary {
};
ShiftLeft = __decorate([
    serializable
], ShiftLeft);
exports.ShiftLeft = ShiftLeft;
let ShiftRight = class ShiftRight extends Binary {
};
ShiftRight = __decorate([
    serializable
], ShiftRight);
exports.ShiftRight = ShiftRight;
let Lt = class Lt extends Binary {
};
Lt = __decorate([
    serializable
], Lt);
exports.Lt = Lt;
let Lte = class Lte extends Binary {
};
Lte = __decorate([
    serializable
], Lte);
exports.Lte = Lte;
let Gt = class Gt extends Binary {
};
Gt = __decorate([
    serializable
], Gt);
exports.Gt = Gt;
let Gte = class Gte extends Binary {
};
Gte = __decorate([
    serializable
], Gte);
exports.Gte = Gte;
let EqEq = class EqEq extends Binary {
};
EqEq = __decorate([
    serializable
], EqEq);
exports.EqEq = EqEq;
let NotEq = class NotEq extends Binary {
};
NotEq = __decorate([
    serializable
], NotEq);
exports.NotEq = NotEq;
let Amp = class Amp extends Binary {
};
Amp = __decorate([
    serializable
], Amp);
exports.Amp = Amp;
let Caret = class Caret extends Binary {
};
Caret = __decorate([
    serializable
], Caret);
exports.Caret = Caret;
let Pipe = class Pipe extends Binary {
};
Pipe = __decorate([
    serializable
], Pipe);
exports.Pipe = Pipe;
let AmpAmp = class AmpAmp extends Binary {
};
AmpAmp = __decorate([
    serializable
], AmpAmp);
exports.AmpAmp = AmpAmp;
let PipePipe = class PipePipe extends Binary {
};
PipePipe = __decorate([
    serializable
], PipePipe);
exports.PipePipe = PipePipe;
let Assignment = class Assignment extends Binary {
};
Assignment = __decorate([
    serializable
], Assignment);
exports.Assignment = Assignment;
let PlusEq = class PlusEq extends Binary {
};
PlusEq = __decorate([
    serializable
], PlusEq);
exports.PlusEq = PlusEq;
let MinusEq = class MinusEq extends Binary {
};
MinusEq = __decorate([
    serializable
], MinusEq);
exports.MinusEq = MinusEq;
let MultEq = class MultEq extends Binary {
};
MultEq = __decorate([
    serializable
], MultEq);
exports.MultEq = MultEq;
let DivEq = class DivEq extends Binary {
};
DivEq = __decorate([
    serializable
], DivEq);
exports.DivEq = DivEq;
let ModEq = class ModEq extends Binary {
};
ModEq = __decorate([
    serializable
], ModEq);
exports.ModEq = ModEq;
let ShREq = class ShREq extends Binary {
};
ShREq = __decorate([
    serializable
], ShREq);
exports.ShREq = ShREq;
let ShLEq = class ShLEq extends Binary {
};
ShLEq = __decorate([
    serializable
], ShLEq);
exports.ShLEq = ShLEq;
let AmpEq = class AmpEq extends Binary {
};
AmpEq = __decorate([
    serializable
], AmpEq);
exports.AmpEq = AmpEq;
let CaretEq = class CaretEq extends Binary {
};
CaretEq = __decorate([
    serializable
], CaretEq);
exports.CaretEq = CaretEq;
let PipeEq = class PipeEq extends Binary {
};
PipeEq = __decorate([
    serializable
], PipeEq);
exports.PipeEq = PipeEq;
let PowerEq = class PowerEq extends Binary {
};
PowerEq = __decorate([
    serializable
], PowerEq);
exports.PowerEq = PowerEq;
let Range = class Range extends Binary {
};
Range = __decorate([
    serializable
], Range);
exports.Range = Range;
let ColonBin = class ColonBin extends Binary {
};
ColonBin = __decorate([
    serializable
], ColonBin);
exports.ColonBin = ColonBin;
let QuesBin = class QuesBin extends Binary {
};
QuesBin = __decorate([
    serializable
], QuesBin);
exports.QuesBin = QuesBin;
let ExcBin = class ExcBin extends Binary {
};
ExcBin = __decorate([
    serializable
], ExcBin);
exports.ExcBin = ExcBin;
let UnaryPrefix = class UnaryPrefix extends Op {
};
UnaryPrefix = __decorate([
    serializable
], UnaryPrefix);
exports.UnaryPrefix = UnaryPrefix;
let PlusPlus = class PlusPlus extends UnaryPrefix {
};
PlusPlus = __decorate([
    serializable
], PlusPlus);
exports.PlusPlus = PlusPlus;
let MinusMinus = class MinusMinus extends UnaryPrefix {
};
MinusMinus = __decorate([
    serializable
], MinusMinus);
exports.MinusMinus = MinusMinus;
let Plus_Prefix = class Plus_Prefix extends UnaryPrefix {
};
Plus_Prefix = __decorate([
    serializable
], Plus_Prefix);
exports.Plus_Prefix = Plus_Prefix;
let Minus_Prefix = class Minus_Prefix extends UnaryPrefix {
};
Minus_Prefix = __decorate([
    serializable
], Minus_Prefix);
exports.Minus_Prefix = Minus_Prefix;
let Exc = class Exc extends UnaryPrefix {
};
Exc = __decorate([
    serializable
], Exc);
exports.Exc = Exc;
let Tilde = class Tilde extends UnaryPrefix {
};
Tilde = __decorate([
    serializable
], Tilde);
exports.Tilde = Tilde;
let Splat = class Splat extends UnaryPrefix {
};
Splat = __decorate([
    serializable
], Splat);
exports.Splat = Splat;
let Dot_Prefix = class Dot_Prefix extends UnaryPrefix {
};
Dot_Prefix = __decorate([
    serializable
], Dot_Prefix);
exports.Dot_Prefix = Dot_Prefix;
let TypeOf = class TypeOf extends UnaryPrefix {
};
TypeOf = __decorate([
    serializable
], TypeOf);
exports.TypeOf = TypeOf;
let AddrOf = class AddrOf extends UnaryPrefix {
};
AddrOf = __decorate([
    serializable
], AddrOf);
exports.AddrOf = AddrOf;
let SizeOf = class SizeOf extends UnaryPrefix {
};
SizeOf = __decorate([
    serializable
], SizeOf);
exports.SizeOf = SizeOf;
let StateOf = class StateOf extends UnaryPrefix {
};
StateOf = __decorate([
    serializable
], StateOf);
exports.StateOf = StateOf;
let SwapTo = class SwapTo extends UnaryPrefix {
};
SwapTo = __decorate([
    serializable
], SwapTo);
exports.SwapTo = SwapTo;
let New = class New extends UnaryPrefix {
};
New = __decorate([
    serializable
], New);
exports.New = New;
let Delete = class Delete extends UnaryPrefix {
};
Delete = __decorate([
    serializable
], Delete);
exports.Delete = Delete;
let Return = class Return extends UnaryPrefix {
};
Return = __decorate([
    serializable
], Return);
exports.Return = Return;
let UnaryPostfix = class UnaryPostfix extends Op {
};
UnaryPostfix = __decorate([
    serializable
], UnaryPostfix);
exports.UnaryPostfix = UnaryPostfix;
let Arrow = class Arrow extends UnaryPostfix {
};
Arrow = __decorate([
    serializable
], Arrow);
exports.Arrow = Arrow;
let ConditionalDot = class ConditionalDot extends UnaryPostfix {
};
ConditionalDot = __decorate([
    serializable
], ConditionalDot);
exports.ConditionalDot = ConditionalDot;
let PlusPlus_Postfix = class PlusPlus_Postfix extends UnaryPostfix {
};
PlusPlus_Postfix = __decorate([
    serializable
], PlusPlus_Postfix);
exports.PlusPlus_Postfix = PlusPlus_Postfix;
let MinusMinus_Postfix = class MinusMinus_Postfix extends UnaryPostfix {
};
MinusMinus_Postfix = __decorate([
    serializable
], MinusMinus_Postfix);
exports.MinusMinus_Postfix = MinusMinus_Postfix;
class Emit {
    static Emit(ctor, m) {
        //return new ctor()
        return Object.assign(new ctor(), m);
    }
}
exports.Emit = Emit;
let TypeRef = class TypeRef {
};
TypeRef = __decorate([
    serializable
], TypeRef);
exports.TypeRef = TypeRef;
/*
@serializable
export class IndexDef {
    type?: string | IndexDef
}
*/
let ReturnDef = class ReturnDef {
};
ReturnDef = __decorate([
    serializable
], ReturnDef);
exports.ReturnDef = ReturnDef;
let ArgumentDef = class ArgumentDef {
};
ArgumentDef = __decorate([
    serializable
], ArgumentDef);
exports.ArgumentDef = ArgumentDef;
let Statement = class Statement {
};
Statement = __decorate([
    serializable
], Statement);
exports.Statement = Statement;
let MethodDef = class MethodDef {
};
MethodDef = __decorate([
    serializable
], MethodDef);
exports.MethodDef = MethodDef;
let List = class List {
};
List = __decorate([
    serializable
], List);
exports.List = List;
let MacroDef = class MacroDef {
};
MacroDef = __decorate([
    serializable
], MacroDef);
exports.MacroDef = MacroDef;
let MacroRuleDef = class MacroRuleDef {
};
MacroRuleDef = __decorate([
    serializable
], MacroRuleDef);
exports.MacroRuleDef = MacroRuleDef;
let ImportDef = class ImportDef {
};
ImportDef = __decorate([
    serializable
], ImportDef);
exports.ImportDef = ImportDef;
let MemberDef = class MemberDef {
};
MemberDef = __decorate([
    serializable
], MemberDef);
exports.MemberDef = MemberDef;
let TypeDef = class TypeDef {
};
TypeDef = __decorate([
    serializable
], TypeDef);
exports.TypeDef = TypeDef;
let Lambda = class Lambda extends MethodDef {
};
Lambda = __decorate([
    serializable
], Lambda);
exports.Lambda = Lambda;
let IfExp = class IfExp extends Op {
};
IfExp = __decorate([
    serializable
], IfExp);
exports.IfExp = IfExp;
let Attribute = class Attribute {
};
Attribute = __decorate([
    serializable
], Attribute);
exports.Attribute = Attribute;
let Bracket = class Bracket extends Op {
};
Bracket = __decorate([
    serializable
], Bracket);
exports.Bracket = Bracket;
let BracketParen = class BracketParen extends Bracket {
};
BracketParen = __decorate([
    serializable
], BracketParen);
exports.BracketParen = BracketParen;
let BracketCurly = class BracketCurly extends Bracket {
};
BracketCurly = __decorate([
    serializable
], BracketCurly);
exports.BracketCurly = BracketCurly;
let BracketArray = class BracketArray extends Bracket {
};
BracketArray = __decorate([
    serializable
], BracketArray);
exports.BracketArray = BracketArray;
//# sourceMappingURL=martha.emit.js.map