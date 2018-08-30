"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tibu_1 = require("tibu");
const { parse, token, rule, all, many, optional, either } = tibu_1.Tibu;
const martha_ast_1 = require("./martha.ast");
const flat = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
        acc.concat(flat(val)) : acc.concat(val), []);
};
// helpers
const manysep = (sep, ...pattern) => {
    return optional(...pattern, many(sep, ...pattern));
};
const prettyprint = (x) => console.log(JSON.stringify(x, null, 2));
const op = (order, r2l, name, pattern) => {
    return Object.assign(token(name, pattern), { order, r2l });
};
// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
class Mcro {
}
Mcro._new = token("new", "new");
Mcro._typeof = token("typeof", "typeof");
Mcro._sizeof = token("sizeof", "sizeof");
Mcro._addrof = token("addrof", /addrof|addressof/);
Mcro.stateof = token("stateof", "stateof");
Mcro.delete = token("delete", "delete");
Mcro.return = token("return", "return");
Mcro.swapto = token("swapto", "swapto");
exports.Mcro = Mcro;
class Op {
    /**
     * token producer: binary operators
     */
    static get anybinary() {
        return either(this.assign, this.pluseq, this.lt, this.lte, this.gt, this.gte, this.dot, this.plus, this.minus, this.div, this.mult, this.mod);
    }
    static get anyprefix() {
        return either(this.plusplus, this.minusminus);
    }
    static get anypostfix() {
        return either(this.plusplus, this.minusminus);
    }
}
// binary infix
Op.assign = op(16, true, "assign", "=");
Op.pluseq = token("pluseq", "+=");
Op.lt = token("lt", "<");
Op.lte = token("lte", "<=");
Op.gt = token("gt", ">");
Op.gte = token("gte", ">=");
Op.dot = token("dot", ".");
Op.plus = token("plus", "+");
Op.minus = token("minus", "-");
Op.div = token("div", "/");
Op.mult = token("mult", "*");
Op.mod = token("mod", "%");
Op.power = token("power", "^");
// prefix/suffix
Op.plusplus = token("plusplus", "++");
Op.minusminus = token("minusminus", "--");
Op.infix_comma = rule(/\s*,\s*/);
Op.infix_colon = rule(/\s*\:\s*/);
Op.lsquare = token("lsquare", "[");
Op.rsquare = token("rsquare", "]");
Op.lcurly = token("lcurly", "{");
Op.rcurly = token("rcurly", "}");
Op.langle = token("langle", "<");
Op.rangle = token("rangle", ">");
Op.lparen = token("lparen", "(");
Op.rparen = token("rparen", ")");
exports.Op = Op;
class Val {
    static get anyliteral() {
        return either(this.bool, this.integer, this.str);
    }
}
Val.bool = token("bool", /true|false/);
Val.integer = token("integer", /[\d]+/);
Val.str = token("string", /\"[^\"]+|\'[^\']+/);
exports.Val = Val;
class Kwrd {
    static get anyaccess() {
        return either(this.public, this.private, this.internal, this.protected);
    }
}
// access
Kwrd.public = token("public", /public/);
Kwrd.private = token("private", /private/);
Kwrd.internal = token("internal", /internal/);
Kwrd.protected = token("protected", /protected/);
Kwrd.async = token("async", /async/);
Kwrd.atomic = token("atomic", /atomic/);
Kwrd.critical = token("critical", /critical/);
Kwrd.static = token("static", /static/);
Kwrd.ctor = token("ctor", /constructor/);
Kwrd.type = "type";
Kwrd.is = "is";
Kwrd.with = "with";
exports.Kwrd = Kwrd;
class Ref {
}
// members and variables
Ref._member = token("member", /[a-z_\$\@][a-z0-9\$\@]*/i);
Ref.varname = token("varname", /[a-z_\$\@][a-z0-9\$\@]*/i);
Ref.member = rule(Ref._member, many(Op.dot, Ref._member))
    .yields(martha_ast_1.AST.reference);
Ref.typename = token("typename", /[a-z_\$\@][a-z0-9\$\@]*/i);
exports.Ref = Ref;
class Ws {
}
Ws.space0ton = /[ \t]*/;
Ws.space1ton = /[ \t]+/;
Ws.newline = /\r\n|\r|\n|\n\r/;
Ws.indent = token("indent", /^[ \t]+/);
Ws.IND = rule(Ws.newline, Ws.indent).yields(function (result) {
    this._indent = result.tokens[0].result.value;
});
Ws.getIndent = (input) => {
    let index = input.source.substring(input.location).indexOf(Ws.IND._indent);
    if (index === 0) {
        input.location += Ws.IND._indent.length;
        return tibu_1.Result.pass(input);
    }
    return tibu_1.Result.fault(input);
};
Ws.IND_WS = rule(Ws.space0ton, optional(Ws.IND));
Ws.ANY_WS = rule(/[\t\r\n\s]*/);
Ws.lr0ton = (token) => rule(Ws.space0ton, token, Ws.space0ton);
exports.Ws = Ws;
class Util {
}
Util.indents = [];
Util.pushIndent = rule(Ws.space0ton, Ws.newline, Ws.indent).yields(r => {
    Util.indents.push(r.tokens[0].result.value);
});
Util.peekIndent = rule(Ws.newline, (input) => {
    let index = input.source.substring(input.location).indexOf(Util.indents[Util.indents.length - 1]);
    if (index === 0) {
        input.location += Util.indents[Util.indents.length - 1].length;
        return tibu_1.Result.pass(input);
    }
    return tibu_1.Result.fault(input);
});
Util.popIndent = rule(Ws.newline, (input) => {
    Util.indents.pop();
    return tibu_1.Result.pass(input);
});
Util.EOF = rule((input) => input.location === input.source.length ?
    tibu_1.Result.pass(input) : tibu_1.Result.fault(input));
Util.block = (begin, repeat) => rule(begin, /[ \t]*:[ \t]*/, either(all(Util.pushIndent, many(repeat, either(Util.peekIndent, Util.popIndent, Util.EOF))), all(repeat, /\s*/)));
exports.Util = Util;
class Exp {
}
//static atomparen                = rule("(", optional(() => Exp.exp), ")")
//.yields(AST.atomparen)
//;
//static atomcall                 = rule(Ref.member, "(", optional(() => Exp.exp, many(Op.infix_comma, () => Exp.exp)), ")")
//.yields(AST.atomcall)
//;
Exp.atomliteral = rule(Val.anyliteral)
    .yields(martha_ast_1.AST.atomliteral);
//static atomarrliteral       = rule(Op.lsquare, optional(() => Exp.exp, (many(Op.infix_comma, () => Exp.exp))), Op.rsquare)
//.yields(AST.atomarrliteral)
//;
//static atomobjliteral       = rule(Op.lcurly,
//    manysep(Op.infix_comma, either(all(Ref.member, Op.assign, () => Exp.exp), Ref.member)),
//    Op.rcurly
//)
//.yields(AST.atomobjliteral)
//;
Exp.atomlambdaliteral = rule(Util.block(either(all("(", () => Def.argumentdefs, ")"), () => Def.argumentdef), () => Stmt.statement));
Exp.atommember = rule(Ref.member)
    .yields(martha_ast_1.AST.atommember);
/**
 * cst producer
 */
Exp.atom = rule(
// optional(rule(Op.anyprefix).yields(AST.prefixop)),
either(Exp.atomliteral, 
// Exp.atomcall,
//  Exp.atomarrliteral,
//  Exp.atomobjliteral,
//  Exp.atomlambdaliteral,
//  Exp.atomparen,
Exp.atommember))
    .yields(martha_ast_1.AST.atom);
/**
 * cst producer
 */
Exp.addexpr = rule(either(all(() => Exp.multexpr, Op.plus, () => Exp.addexpr), all(() => Exp.multexpr, Op.minus, () => Exp.addexpr), () => Exp.multexpr));
Exp.multexpr = rule(either(all(() => Exp.powerexpr, Op.mult, () => Exp.multexpr), all(() => Exp.powerexpr, Op.div, () => Exp.multexpr), () => Exp.powerexpr));
Exp.powerexpr = rule(either(all(/\s*10/, Op.power, () => Exp.powerexpr), /\s*10/));
exports.Exp = Exp;
class Stmt {
}
Stmt.stmt_expression = rule(Exp.addexpr);
Stmt.statement = rule(many(either(Stmt.stmt_expression)));
exports.Stmt = Stmt;
class Def {
}
Def.specpredicate = rule(either(all(Ws.lr0ton(Op.anybinary), Ws.ANY_WS, Stmt.stmt_expression), all(Ws.lr0ton(Ref.member)))
// op value (and op value etc...)
// .member op value...
// predicate function name (where predicate function takes form: bool f(type))
);
Def.argumentspec = rule("{", Def.specpredicate, "}")
    .yields(martha_ast_1.AST.argumentsspec);
Def.argumentdef = rule(Ws.lr0ton(Ref.typename), ":", Ws.lr0ton(Ref.varname), optional(Def.argumentspec))
    .yields(martha_ast_1.AST.argumentdef);
Def.returndef = rule(Ref.typename, optional(Def.argumentspec))
    .yields(martha_ast_1.AST.returndef);
Def.argumentdefs = rule(Def.argumentdef, many(Op.infix_comma, Def.argumentdef))
    .yields(martha_ast_1.AST.argumentdefs);
Def.methoddef = rule(Util.block(all(optional(rule(Kwrd.anyaccess, many(Ws.space1ton, Kwrd.anyaccess), Ws.space1ton).yields(martha_ast_1.AST.anyaccess)), optional(Kwrd.static, Ws.space1ton), optional(Kwrd.async, Ws.space1ton), optional(Kwrd.atomic, Ws.space1ton), optional(Kwrd.critical, Ws.space1ton), either(all(Def.returndef, Ws.space1ton, token("name", /\w+/)), Kwrd.ctor), optional(Ws.lr0ton(Op.lparen), optional(Def.argumentdefs), Ws.lr0ton(Op.rparen))), Stmt.statement))
    .yields(martha_ast_1.AST.methoddef);
Def.membernames = rule(Ref.member, many(optional(Op.infix_comma, Ref.member)))
    .yields((result, cst) => {
    return flat(cst);
});
exports.Def = Def;
class Mod {
}
Mod.typedef_name = rule(Ref.typename, many(optional(Op.infix_comma, Ref.typename)))
    .yields(martha_ast_1.AST.typedef_name);
Mod.typedef_member = rule(Ref.typename, Op.infix_colon, Def.membernames)
    .yields(martha_ast_1.AST.typedef_member);
Mod.typedef_basetype = rule(Ref.typename)
    .yields(martha_ast_1.AST.typedef_basetype);
Mod.typedef = rule(Util.block(Kwrd.type, Mod.typedef_name), optional(Util.block(Kwrd.is, Mod.typedef_basetype)), optional(Util.block(Kwrd.with, Mod.typedef_member)), many(Def.methoddef))
    .yields(martha_ast_1.AST.typedef);
Mod.typedefs = rule(many(Mod.typedef, optional(Ws.ANY_WS))).yields(martha_ast_1.AST.flatcst);
exports.Mod = Mod;
/*
Ditto.tests.forEach(test => {
    var k:{actual:any, expected:any, source:string} = test();
    if (JSON.stringify(k.actual) !== JSON.stringify(k.expected)) {
        console.error(`[${k.source}]\r\n
        \tyields error:\r\n\texpected\r\n
        \t"${JSON.stringify(k.expected)}"\r\n
        \tgot\r\n
        \t"${JSON.stringify(k.actual)}"`);
    }
});

let source:string = `
type:
    Party
is:
    Address

type:
    Buyer, Seller, BuyerRep, SellerRep
is:
    SomeBaseType
with:
    Party: this
    bool: sentCloseRequest
constructor:
    k = [10, a, b()]
    a = 10
    b = 20
    (z = 10)
    k = foo(10)
    d, e = get2things
    call(10)
    call(a(b(c(10, 90))))
atomic void record(items{.len > 0}:Array[], f{> 0}:Int, flag:bool, ref z:Vector<string>)
    ledger.process(sum)
    total += f
atomic int{> 0} send(to:Address, amount:int{> 0})
    do(bad(stuff[0].with("stuff".length)))
`;

parse(source)
(
    Ws.ANY_WS,
    rule(Mod.typedefs).yields((_:any, cst:any) => {
        // tslint:disable-next-line:no-debugger
        // debugger;
        prettyprint(cst);
    }),
    rule("operator:", Ws.IND_WS, /\w+/, /\w+/)
);
*/ 
//# sourceMappingURL=martha.grammar.js.map