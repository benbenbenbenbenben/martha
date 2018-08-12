"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ditto_1 = require("./ditto");
var parse = ditto_1.Ditto.parse, token = ditto_1.Ditto.token, rule = ditto_1.Ditto.rule, all = ditto_1.Ditto.all, many = ditto_1.Ditto.many, optional = ditto_1.Ditto.optional, either = ditto_1.Ditto.either, flat = ditto_1.Ditto.flat;
var prettyprint = function (x) { return console.log(JSON.stringify(x, null, 2)); };
// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
var Op = /** @class */ (function () {
    function Op() {
    }
    Object.defineProperty(Op, "anybinary", {
        get: function () {
            return either(this.assign, this.pluseq, this.lt, this.lte, this.gt, this.gte, this.dot);
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
var Exp = /** @class */ (function () {
    function Exp() {
    }
    Exp.atomparen = rule("(", function () { return Exp.exp; }, ")").yields(function (r, c) {
        return {
            op: "parenthesis",
            parameters: c
        };
    });
    Exp.atomcall = rule(Ref.member, "(", function () { return Exp.exp; }, ")").yields(function (r, c) {
        return {
            op: "call",
            parameters: c
        };
    });
    Exp.atomliteral = rule(Val.anyliteral).yields(function (r) {
        return {
            op: "literal",
            parameters: [r.tokens[0].name, r.tokens[0].result.value]
        };
    });
    Exp.atomarrliteral = rule(Op.lsquare, many(function () { return Exp.exp; }), Op.rsquare).yields(function (r, c) {
        return {
            op: "arrayliteral",
            parameters: c === undefined ? [] : flat(c)
        };
    })
        .passes("[]", { op: "arrayliteral", parameters: [] })
        .passes("[1]", { op: "arrayliteral", parameters: [{ op: "literal", parameters: ["integer", "1"] }] });
    Exp.atomobjliteral = rule(Op.lcurly, many(either(all(Ref.member, Op.assign, function () { return Exp.exp; }), Ref.member)), Op.rcurly);
    Exp.atomlambdaliteral = rule(Util.block(either(all("(", function () { return Def.argumentdefs; }, ")"), function () { return Def.argumentdef; }), function () { return Stmt.statement; }));
    Exp.atommember = rule(Ref.member).yields(function (r) {
        return {
            op: "reference",
            parameters: r.get("member")
        };
    });
    Exp.atom = rule(either(Exp.atomliteral, // literal
    Exp.atomcall, // call
    Exp.atomarrliteral, Exp.atomobjliteral, Exp.atomlambdaliteral, Exp.atomparen, // parenthesised
    Exp.atommember)).yields(// var member/var
    function (r, c) {
        return c[0];
    });
    Exp.exp = rule(Exp.atom, many(/ */, Op.anybinary, / */, Exp.atom)).yields(function (r, c) {
        return c;
    });
    return Exp;
}());
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
    Def.methoddef = rule(Util.block(all(optional(many(Kwrd.anyaccess, Ws.space1ton)), optional(Kwrd.static, Ws.space1ton), optional(Kwrd.async, Ws.space1ton), optional(Kwrd.atomic, Ws.space1ton), either(all(Def.returntype, Ws.space1ton, token("name", /w+/)), Kwrd.ctor), optional("(", optional(Def.argumentdefs), ")")), Stmt.statement)).yields(function (r, c) {
        console.log(r, c);
    });
    Def.membernames = rule(Ref.member, many(optional(Op.infix_comma, Ref.member)));
    return Def;
}());
var Mod = /** @class */ (function () {
    function Mod() {
    }
    Mod.typedec = rule(Ref.typename, many(optional(Op.infix_comma, Ref.typename)))
        .yields(function (r) {
        return {
            typenames: r.get("typename")
        };
    });
    Mod.typedef_member = rule(optional(either(all(Ws.space0ton, Ws.newline, Ws.getIndent), // this is automatically the last IND from IND_WS
    Ws.space0ton)), Ref.typename, Op.infix_colon, Def.membernames).yields(function (raw) {
        return { members: raw.get("member").map(function (name) { return { name: name, type: raw.one("typename") }; }) };
    });
    Mod.typedef_members = rule(many(Mod.typedef_member)).yields(function (_, cst) {
        // the flattening!
        return { members: [].concat.apply([], ([].concat.apply([], ([].concat.apply([], cst))).map(function (x) { return x.members; }))) };
    });
    Mod.typedef = rule(Util.block(Kwrd.type, Mod.typedec), optional(Util.block(Kwrd.is, Ref.basetypename)), optional(Util.block(Kwrd.with, Mod.typedef_members)), many(Def.methoddef)).yields(function (raw, cst) {
        var types = cst[0][0][0][0].typenames.map(function (name) {
            var type = {
                name: name
            };
            if (raw.one("basetypename")) {
                type.basetype = raw.one("basetypename");
            }
            if (cst[1] && cst[1][0]) {
                type.members = cst[1][0][0][0][0].members;
            }
            return type;
        });
        return {
            types: types
        };
    });
    Mod.typedefs = rule(many(Mod.typedef, optional(Ws.ANY_WS)));
    return Mod;
}());
ditto_1.Ditto.tests.forEach(function (test) {
    var k = test();
    if (JSON.stringify(k.actual) !== JSON.stringify(k.expected)) {
        console.error("[" + k.source + "] yields error: expected \"" + JSON.stringify(k.expected) + "\" got \"" + JSON.stringify(k.actual) + "\"");
    }
});
/*
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
//# sourceMappingURL=index.js.map