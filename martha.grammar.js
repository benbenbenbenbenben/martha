"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ditto_1 = require("./ditto");
var parse = ditto_1.Ditto.parse, token = ditto_1.Ditto.token, rule = ditto_1.Ditto.rule, all = ditto_1.Ditto.all, many = ditto_1.Ditto.many, optional = ditto_1.Ditto.optional, either = ditto_1.Ditto.either, flat = ditto_1.Ditto.flat;
var martha_ast_1 = require("./martha.ast");
// helpers
var manysep = function (sep) {
    var pattern = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        pattern[_i - 1] = arguments[_i];
    }
    return optional.apply(void 0, pattern.concat([many.apply(void 0, [sep].concat(pattern))]));
};
var prettyprint = function (x) { return console.log(JSON.stringify(x, null, 2)); };
// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
var Mcro = /** @class */ (function () {
    function Mcro() {
    }
    Mcro._new = token("new", "new");
    Mcro._typeof = token("typeof", "typeof");
    Mcro._sizeof = token("sizeof", "sizeof");
    Mcro._addrof = token("addrof", /addrof|addressof/);
    Mcro.stateof = token("stateof", "stateof");
    Mcro.delete = token("delete", "delete");
    Mcro.return = token("return", "return");
    Mcro.swapto = token("swapto", "swapto");
    return Mcro;
}());
exports.Mcro = Mcro;
var Op = /** @class */ (function () {
    function Op() {
    }
    Object.defineProperty(Op, "anybinary", {
        get: function () {
            return either(this.assign, this.pluseq, this.lt, this.lte, this.gt, this.gte, this.dot, this.plus, this.minus, this.div, this.mult, this.mod);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Op, "anyprefix", {
        get: function () {
            return either(this.plusplus, this.minusminus);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Op, "anypostfix", {
        get: function () {
            return either(this.plusplus, this.minusminus);
        },
        enumerable: true,
        configurable: true
    });
    // binary infix
    Op.assign = token("assign", "=");
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
    return Op;
}());
exports.Op = Op;
var Val = /** @class */ (function () {
    function Val() {
    }
    Object.defineProperty(Val, "anyliteral", {
        get: function () {
            return either(this.bool, this.integer, this.str);
        },
        enumerable: true,
        configurable: true
    });
    Val.bool = token("bool", /true|false/);
    Val.integer = token("integer", /[\d]+/);
    Val.str = token("string", /\"[^\"]+|\'[^\']+/);
    return Val;
}());
exports.Val = Val;
var Kwrd = /** @class */ (function () {
    function Kwrd() {
    }
    Object.defineProperty(Kwrd, "anyaccess", {
        get: function () {
            return either(this.public, this.private, this.internal, this.protected);
        },
        enumerable: true,
        configurable: true
    });
    // access
    Kwrd.public = token("public", /public/);
    Kwrd.private = token("private", /private/);
    Kwrd.internal = token("internal", /internal/);
    Kwrd.protected = token("protected", /protected/);
    Kwrd.async = token("async", /async/);
    Kwrd.atomic = token("atomic", /atomic/);
    Kwrd.static = token("static", /static/);
    Kwrd.ctor = token("ctor", /constructor/);
    Kwrd.type = "type";
    Kwrd.is = "is";
    Kwrd.with = "with";
    return Kwrd;
}());
exports.Kwrd = Kwrd;
var Ref = /** @class */ (function () {
    function Ref() {
    }
    // members and variables
    Ref._member = token("member", /[a-z_\$\@][a-z0-9\$\@]*/i);
    Ref.varname = token("varname", /[a-z_\$\@][a-z0-9\$\@]*/i);
    Ref.member = rule(Ref._member, many(Op.dot, Ref._member));
    Ref.typename = token("typename", /[a-z_\$\@][a-z0-9\$\@]*/i);
    Ref.basetypename = token("basetypename", /[a-z_\$\@][\.a-z0-9\$\@]*/i);
    return Ref;
}());
exports.Ref = Ref;
var Ws = /** @class */ (function () {
    function Ws() {
    }
    Ws.space0ton = /[ \t]*/;
    Ws.space1ton = /[ \t]+/;
    Ws.newline = /\r\n|\r|\n|\n\r/;
    Ws.indent = token("indent", /^[ \t]+/);
    Ws.IND = rule(Ws.newline, Ws.indent).yields(function (result) {
        this._indent = result.tokens[0].result.value;
    });
    Ws.getIndent = function (input) {
        var index = input.source.substring(input.location).indexOf(Ws.IND._indent);
        if (index === 0) {
            input.location += Ws.IND._indent.length;
            return ditto_1.Result.pass(input);
        }
        return ditto_1.Result.fault(input);
    };
    Ws.IND_WS = rule(Ws.space0ton, optional(Ws.IND));
    Ws.ANY_WS = rule(/[\t\r\n\s]*/);
    return Ws;
}());
exports.Ws = Ws;
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.indents = [];
    Util.pushIndent = rule(Ws.space0ton, Ws.newline, Ws.indent).yields(function (r) {
        Util.indents.push(r.tokens[0].result.value);
    });
    Util.peekIndent = rule(Ws.newline, function (input) {
        var index = input.source.substring(input.location).indexOf(Util.indents[Util.indents.length - 1]);
        if (index === 0) {
            input.location += Util.indents[Util.indents.length - 1].length;
            return ditto_1.Result.pass(input);
        }
        return ditto_1.Result.fault(input);
    });
    Util.popIndent = rule(Ws.newline, function (input) {
        Util.indents.pop();
        return ditto_1.Result.pass(input);
    });
    Util.block = function (begin, repeat) { return rule(begin, ":", Util.pushIndent, many(repeat, either(Util.peekIndent, Util.popIndent))); };
    return Util;
}());
exports.Util = Util;
var Exp = /** @class */ (function () {
    function Exp() {
    }
    Exp.atomparen = rule("(", optional(function () { return Exp.exp; }), ")")
        .yields(martha_ast_1.AST.atomparen)
        .passes("()", { op: "parenthesis" })
        .passes("(1)", { op: "parenthesis", parameters: [{ op: "literal", parameters: ["integer", "1"] }] });
    Exp.atomcall = rule(Ref.member, "(", optional(function () { return Exp.exp; }, many(Op.infix_comma, function () { return Exp.exp; })), ")")
        .yields(martha_ast_1.AST.atomcall)
        .passes("k()", { op: "call", parameters: [["k"]] })
        .passes("k.q()", { op: "call", parameters: [["k", "q"]] })
        .passes("k.q(1)", { op: "call", parameters: [["k", "q"], { op: "literal", parameters: ["integer", "1"] }] })
        .passes("k([1,2,3],[a.aa,b,c])", {
        op: "call", parameters: [
            ["k"], {
                op: "arrayliteral",
                parameters: [
                    { op: "literal", parameters: ["integer", "1"] },
                    { op: "literal", parameters: ["integer", "2"] },
                    { op: "literal", parameters: ["integer", "3"] }
                ]
            }, {
                op: "arrayliteral",
                parameters: [
                    { op: "reference", parameters: ["a", "aa"] },
                    { op: "reference", parameters: ["b"] },
                    { op: "reference", parameters: ["c"] }
                ]
            }
        ]
    });
    Exp.atomliteral = rule(Val.anyliteral)
        .yields(martha_ast_1.AST.atomliteral);
    Exp.atomarrliteral = rule(Op.lsquare, optional(function () { return Exp.exp; }, (many(Op.infix_comma, function () { return Exp.exp; }))), Op.rsquare)
        .yields(martha_ast_1.AST.atomarrliteral)
        .passes("[]", { op: "arrayliteral", parameters: [] })
        .passes("[1]", { op: "arrayliteral", parameters: [{ op: "literal", parameters: ["integer", "1"] }] })
        .passes("[[]]", { op: "arrayliteral", parameters: [{ op: "arrayliteral", parameters: [] }] })
        .passes("[k()]", { op: "arrayliteral", parameters: [{ op: "call", parameters: [["k"]] }] })
        .passes("[1,2,3]", { op: "arrayliteral", parameters: [
            { op: "literal", parameters: ["integer", "1"] },
            { op: "literal", parameters: ["integer", "2"] },
            { op: "literal", parameters: ["integer", "3"] }
        ] });
    Exp.atomobjliteral = rule(Op.lcurly, manysep(Op.infix_comma, either(all(Ref.member, Op.assign, function () { return Exp.exp; }), Ref.member)), Op.rcurly)
        .yields(martha_ast_1.AST.atomobjliteral)
        .passes("{}", { op: "literal", parameters: ["object"] })
        .passes("{a=2}", { op: "literal", parameters: ["object", {
                op: "assign", parameters: ["a", { op: "literal", parameters: ["integer", "2"] }]
            }
        ] })
        .passes("{a=2,b=0}", { op: "literal", parameters: ["object", {
                op: "assign", parameters: ["a", { op: "literal", parameters: ["integer", "2"] }]
            }, {
                op: "assign", parameters: ["b", { op: "literal", parameters: ["integer", "0"] }]
            }
        ] });
    Exp.atomlambdaliteral = rule(Util.block(either(all("(", function () { return Def.argumentdefs; }, ")"), function () { return Def.argumentdef; }), function () { return Stmt.statement; }));
    Exp.atommember = rule(Ref.member)
        .yields(martha_ast_1.AST.atommember);
    Exp.atom = rule(optional(rule(Op.anyprefix).yields(martha_ast_1.AST.prefixop)), either(Exp.atomliteral, Exp.atomcall, Exp.atomarrliteral, Exp.atomobjliteral, Exp.atomlambdaliteral, Exp.atomparen, Exp.atommember), optional(rule(Op.anypostfix).yields(martha_ast_1.AST.postfixop)))
        .yields(martha_ast_1.AST.atom)
        .passes("a++", [{ op: "reference", parameters: ["a"] }, { op: "postfix", parameters: ["plusplus"] }])
        .passes("++a", [{ op: "prefix", parameters: ["plusplus"] }, { op: "reference", parameters: ["a"] }]);
    Exp.exp = rule(Exp.atom, many(/ */, Op.anybinary, / */, Exp.atom))
        .yields(martha_ast_1.AST.exp)
        .passes("a + b + c", [
        { "op": "reference", "parameters": ["a"] }, { "op": "plus" },
        { "op": "reference", "parameters": ["b"] }, { "op": "plus" },
        { "op": "reference", "parameters": ["c"] }
    ]);
    return Exp;
}());
exports.Exp = Exp;
var Stmt = /** @class */ (function () {
    function Stmt() {
    }
    Stmt.stmt_expression = rule(Exp.exp)
        .yields(function (r) {
        return r.tokens;
    });
    Stmt.statement = rule(either(Stmt.stmt_expression));
    return Stmt;
}());
exports.Stmt = Stmt;
var Def = /** @class */ (function () {
    function Def() {
    }
    Def.specpredicate = rule(Op.dot, Ref.member, Op.anybinary, either(Val.anyliteral, Ref.member), Op.dot, Ref.member, Op.anybinary, either(Val.anyliteral, Ref.member)
    // op value (and op value etc...)
    // .member op value...
    // predicate function name (where predicate function takes form: bool f(type))
    );
    Def.argumentspec = rule("{", Def.specpredicate, "}");
    Def.argumentdef = rule(Ref.varname, ":", Ref.typename, optional(Def.argumentspec));
    Def.returntype = rule(Ref.typename, optional(Def.argumentspec));
    Def.argumentdefs = rule(Def.argumentdef, many(Op.infix_comma, Def.argumentdef));
    Def.methoddef = rule(Util.block(all(optional(many(Kwrd.anyaccess, Ws.space1ton)), optional(Kwrd.static, Ws.space1ton), optional(Kwrd.async, Ws.space1ton), optional(Kwrd.atomic, Ws.space1ton), either(all(Def.returntype, Ws.space1ton, token("name", /w+/)), Kwrd.ctor), optional("(", optional(Def.argumentdefs), ")")), Stmt.statement))
        .yields(martha_ast_1.AST.exp);
    Def.membernames = rule(Ref.member, many(optional(Op.infix_comma, Ref.member)));
    return Def;
}());
exports.Def = Def;
var Mod = /** @class */ (function () {
    function Mod() {
    }
    Mod.typedef_name = rule(Ref.typename, many(optional(Op.infix_comma, Ref.typename)))
        .yields(martha_ast_1.AST.typedef_name);
    Mod.typedef_member = rule(Ref.typename, Op.infix_colon, Def.membernames)
        .yields(martha_ast_1.AST.typedef_member);
    Mod.typedef = rule(Util.block(Kwrd.type, Mod.typedef_name), optional(Util.block(Kwrd.is, Ref.basetypename)), optional(Util.block(Kwrd.with, Mod.typedef_member)))
        .yields(martha_ast_1.AST.typedef);
    Mod.typedefs = rule(many(Mod.typedef, optional(Ws.ANY_WS))).yields(martha_ast_1.AST.flatcst);
    return Mod;
}());
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