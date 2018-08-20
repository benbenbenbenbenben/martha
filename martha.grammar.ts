import { Ditto, Result, ResultTokens, Input, IRule, IToken, Pattern } from "./ditto";
const { parse, token, rule, all, many, optional, either, flat } = Ditto;

import { AST } from "./martha.ast";


// helpers
const manysep:any = (sep:Pattern, ...pattern:Pattern[]):(input:Input) => Result => {
    return optional(...pattern, many(sep, ...pattern));
};

const prettyprint:any = (x:any) => console.log(JSON.stringify(x, null, 2));

// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
class Mcro {
    static _new     = token("new", "new");
    static _typeof  = token("typeof", "typeof");
    static _sizeof  = token("sizeof", "sizeof");
    static _addrof  = token("addrof", /addrof|addressof/);
    static stateof  = token("stateof", "stateof");
    static delete   = token("delete", "delete");
    static return   = token("return", "return");
    static swapto   = token("swapto", "swapto");
}
class Op {
    // binary infix
    static assign           = token("assign", "=");
    static pluseq           = token("pluseq", "+=");
    static lt               = token("lt", "<");
    static lte              = token("lte", "<=");
    static gt               = token("gt", ">");
    static gte              = token("gte", ">=");
    static dot              = token("dot", ".");
    static plus             = token("plus", "+");
    static minus            = token("minus", "-");
    static div              = token("div", "/");
    static mult             = token("mult", "*");
    static mod              = token("mod", "%");

    // prefix/suffix
    static plusplus         = token("plusplus", "++");
    static minusminus       = token("minusminus", "--");

    static get anybinary():any {
        return either(this.assign, this.pluseq, this.lt, this.lte, this.gt, this.gte,
            this.dot, this.plus, this.minus, this.div, this.mult, this.mod);
    }

    static infix_comma  = rule(/\s*,\s*/);
    static infix_colon  = rule(/\s*\:\s*/);

    static lsquare          = token("lsquare", "[");
    static rsquare          = token("rsquare", "]");
    static lcurly           = token("lcurly", "{");
    static rcurly           = token("rcurly", "}");
    static langle           = token("langle", "<");
    static rangle           = token("rangle", ">");

    static get anyprefix():any {
        return either(this.plusplus, this.minusminus);
    }
    static get anypostfix():any {
        return either(this.plusplus, this.minusminus);
    }
}
class Val {
    static bool         = token("bool", /true|false/);
    static integer      = token("integer", /[\d]+/);
    static str          = token("string", /\"[^\"]+|\'[^\']+/);

    static get anyliteral():any {
        return either(this.bool, this.integer, this.str);
    }
}
class Kwrd {
    // access
    static public       = token("public", /public/);
    static private      = token("private", /private/);
    static internal     = token("internal", /internal/);
    static protected    = token("protected", /protected/);

    static get anyaccess():any {
        return either(this.public, this.private, this.internal, this.protected);
    }

    static async        = token("async", /async/);
    static atomic       = token("atomic", /atomic/);

    static static       = token("static", /static/);

    static ctor         = token("ctor", /constructor/);

    static type         = "type";
    static is           = "is";
    static with         = "with";
}
class Ref {
    // members and variables
    static _member      = token("member", /[a-z_\$\@][a-z0-9\$\@]*/i);
    static varname      = token("varname", /[a-z_\$\@][a-z0-9\$\@]*/i);
    static member       = rule(Ref._member, many(Op.dot, Ref._member))
                            .yields(AST.reference);
    static typename     = token("typename", /[a-z_\$\@][a-z0-9\$\@]*/i);
}
class Ws {
    static space0ton    = /[ \t]*/;
    static space1ton    = /[ \t]+/;
    static newline      = /\r\n|\r|\n|\n\r/;
    static indent       = token("indent", /^[ \t]+/);

    static IND:any      = rule(Ws.newline, Ws.indent).yields(function(this:any, result:ResultTokens):void {
                                this._indent = result.tokens[0].result.value;
                            });
    static getIndent    = (input:Input):Result => {
                            let index:number = input.source.substring(input.location).indexOf(Ws.IND._indent);
                            if (index === 0) {
                                input.location += Ws.IND._indent.length;
                                return Result.pass(input);
                            }
                            return Result.fault(input);
                        }
    static IND_WS       = rule(Ws.space0ton, optional(Ws.IND));
    static ANY_WS       = rule(/[\t\r\n\s]*/);
}
class Util {
    static indents:string[] = [];
    static pushIndent       = rule(Ws.space0ton, Ws.newline, Ws.indent).yields(r => {
        Util.indents.push(r.tokens[0].result.value);
    });
    static peekIndent       = rule(Ws.newline, (input:Input):Result => {
        let index:number = input.source.substring(input.location).indexOf(Util.indents[Util.indents.length - 1]);
        if (index === 0) {
            input.location += Util.indents[Util.indents.length - 1].length;
            return Result.pass(input);
        }
        return Result.fault(input);
    });
    static popIndent        = rule(Ws.newline, (input:Input):Result => {
        Util.indents.pop();
        return Result.pass(input);
    });
    static EOF              = rule((input:Input):Result => input.location === input.source.length ? 
                                    Result.pass(input) : Result.fault(input));
    static block            = (begin:IRule|string|RegExp|IToken, repeat:IRule|string|RegExp|IToken) => rule(
        begin, /[ \t]*:[ \t]*/,
        either(
            all(Util.pushIndent, many(repeat, either(Util.peekIndent, Util.popIndent, Util.EOF))),
            all(repeat, /\s*/)
        )
    )
    // static wswrap           = (...items:(IRule|string|RegExp|IToken)[]) => rule();
}
class Exp {
    static atomparen                = rule("(", optional(() => Exp.exp), ")")
    .yields(AST.atomparen)
    .passes("()", {op:"parenthesis"})
    .passes("(1)", {op:"parenthesis", parameters:[{op:"literal",parameters:["integer","1"]}]})
    ;
    static atomcall                 = rule(Ref.member, "(", optional(() => Exp.exp, many(Op.infix_comma, () => Exp.exp)), ")")
    .yields(AST.atomcall)
    .passes("k()", { op:"call", parameters:[["k"]] })
    .passes("k.q()", { op:"call", parameters:[["k","q"]] })
    .passes("k.q(1)", { op:"call", parameters:[["k","q"], {op:"literal", parameters:["integer","1"]}] })
    .passes("k([1,2,3],[a.aa,b,c])", {
        op:"call", parameters:[
            ["k"], {
                op:"arrayliteral",
                parameters:[
                    {op:"literal", parameters:["integer","1"]},
                    {op:"literal", parameters:["integer","2"]},
                    {op:"literal", parameters:["integer","3"]}
                ]
            },{
                op:"arrayliteral",
                parameters:[
                    {op:"reference", parameters:["a","aa"]},
                    {op:"reference", parameters:["b"]},
                    {op:"reference", parameters:["c"]}
                ]
            }
        ]
    })
    ;
    static atomliteral          = rule(Val.anyliteral)
    .yields(AST.atomliteral)
    ;
    static atomarrliteral       = rule(Op.lsquare, optional(() => Exp.exp, (many(Op.infix_comma, () => Exp.exp))), Op.rsquare)
    .yields(AST.atomarrliteral)
    .passes("[]", { op:"arrayliteral", parameters:[] })
    .passes("[1]", { op:"arrayliteral", parameters:[{op:"literal",parameters:["integer","1"]}] })
    .passes("[[]]", { op:"arrayliteral", parameters:[{op:"arrayliteral", parameters:[]}] })
    .passes("[k()]", { op:"arrayliteral", parameters:[{op:"call", parameters:[["k"]]}] })
    .passes("[1,2,3]", { op:"arrayliteral", parameters:[
        {op:"literal",parameters:["integer","1"]},
        {op:"literal",parameters:["integer","2"]},
        {op:"literal",parameters:["integer","3"]}
    ]})
    ;
    static atomobjliteral       = rule(Op.lcurly,
        manysep(Op.infix_comma, either(all(Ref.member, Op.assign, () => Exp.exp), Ref.member)),
        Op.rcurly
    )
    .yields(AST.atomobjliteral)
    .passes("{}",{op:"literal",parameters:["object"]})
    .passes("{a=2}",{op:"literal",parameters:["object",{
            op:"assign",parameters:["a",{op:"literal",parameters:["integer","2"]}]
        }
    ]})
    .passes("{a=2,b=0}",{op:"literal",parameters:["object",{
            op:"assign",parameters:["a",{op:"literal",parameters:["integer","2"]}]
        },{
            op:"assign",parameters:["b",{op:"literal",parameters:["integer","0"]}]
        }
    ]})
    ;
    static atomlambdaliteral    = rule(Util.block(
        either(
            all("(", () => Def.argumentdefs, ")",),
            () => Def.argumentdef
        ), () => Stmt.statement));
    static atommember           = rule(Ref.member)
    .yields(AST.atommember)
    ;
    static atom                 = rule(
                                    optional(rule(Op.anyprefix).yields(AST.prefixop)),
                                    either( Exp.atomliteral,
                                            Exp.atomcall,
                                            Exp.atomarrliteral,
                                            Exp.atomobjliteral,
                                            Exp.atomlambdaliteral,
                                            Exp.atomparen,
                                            Exp.atommember),
                                    optional(rule(Op.anypostfix).yields(AST.postfixop)))
    .yields(AST.atom)
    .passes("a++", [{op:"reference",parameters:["a"]},{op:"postfix",parameters:["plusplus"]}])
    .passes("++a", [{op:"prefix",parameters:["plusplus"]},{op:"reference",parameters:["a"]}])
    ;
    static exp                  = rule(Exp.atom, many(/ */, Op.anybinary, / */, Exp.atom))
    .yields(AST.exp)
    .passes("a + b + c", [
        {"op":"reference","parameters":["a"]},{"op":"plus"},
        {"op":"reference","parameters":["b"]},{"op":"plus"},
        {"op":"reference","parameters":["c"]}])
    ;
}

class Stmt {
    static stmt_expression = rule(Exp.exp)
        .yields((r) => {
            return r.tokens;
        });
    static statement        = rule(either(
        Stmt.stmt_expression,
        // z Stmt.stmt_switch,
        // z Stmt.stmt_if,
        // z Stmt.stmt_while,
        // z Stmt.stmt_for,
        // z Stmt.stmt_critical,
        // z Stmt.stmt_atomic
    ));
}

class Def {
    static specpredicate = rule(
        Op.dot, Ref.member, Op.anybinary, either(Val.anyliteral, Ref.member),
        Op.dot, Ref.member,
        Op.anybinary, either(Val.anyliteral, Ref.member)
        // op value (and op value etc...)
        // .member op value...
        // predicate function name (where predicate function takes form: bool f(type))
    );
    static argumentspec = rule("{", Def.specpredicate, "}");
    static argumentdef = rule(Ref.varname, ":", Ref.typename, optional(Def.argumentspec));
    static returntype = rule(Ref.typename, optional(Def.argumentspec));
    static argumentdefs = rule(Def.argumentdef, many(Op.infix_comma, Def.argumentdef));
    static methoddef = rule(
        Util.block(all(
            optional(many(Kwrd.anyaccess, Ws.space1ton)),
            optional(Kwrd.static, Ws.space1ton),
            optional(Kwrd.async, Ws.space1ton),
            optional(Kwrd.atomic, Ws.space1ton),
            either(
                all(Def.returntype, Ws.space1ton, token("name", /w+/)),
                Kwrd.ctor
            ),
            optional("(",
                optional(Def.argumentdefs),
            ")"),
        ), Stmt.statement)
    )
    .yields(AST.exp);
    static membernames = rule(Ref.member, many(optional(Op.infix_comma, Ref.member)))
    .yields((result:ResultTokens, cst:any) => {
        return flat(cst);
    });
}

class Mod {
    static typedef_name = rule(Ref.typename, many(optional(Op.infix_comma, Ref.typename)))
    .yields(AST.typedef_name)
    ;
    static typedef_member = rule(Ref.typename, Op.infix_colon, Def.membernames)
    .yields(AST.typedef_member)
    ;
    static typedef_basetype = rule(Ref.typename)
    .yields(AST.typedef_basetype)
    ;
    static typedef = rule(
        Util.block(Kwrd.type, Mod.typedef_name),
        optional(Util.block(Kwrd.is, Mod.typedef_basetype)),
        optional(Util.block(Kwrd.with, Mod.typedef_member))
    )
    .yields(AST.typedef)
    ;
    static typedefs = rule(many(Mod.typedef, optional(Ws.ANY_WS))).yields(AST.flatcst);
}

export {
    Op,
    Ws,
    Val,
    Exp,
    Util,
    Kwrd,
    Stmt,
    Ref,
    Mcro,
    Mod,
    Def
};

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