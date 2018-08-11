import { Ditto, Result, ResultTokens, Input, IRule, IToken } from "./ditto";
const { parse, token, rule, all, many, optional, either } = Ditto;

const prettyprint:any = (x:any) => console.log(JSON.stringify(x, null, 2));

// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
class Op {
    // binary infix
    static assign   = token("assign", "=");
    static pluseq   = token("pluseq", "+=");
    static lt       = token("lt", "<");
    static lte      = token("lte", "<=");
    static gt       = token("gt", ">");
    static gte      = token("gte", ">=");
    static dot      = token("dot", ".");

    static get anybinary():any {
        return either(this.assign, this.pluseq, this.lt, this.lte, this.gt, this.gte, this.dot);
    }

    static infix_comma  = rule(/\s*,\s*/);
    static infix_colon  = rule(/\s*\:\s*/);
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
    static member       = rule(Ref._member, many(Op.dot, Ref._member));
    static typename     = token("typename", /[a-z_\$\@][a-z0-9\$\@]*/i);
    static basetypename = token("basetypename", /[a-z_\$\@][\.a-z0-9\$\@]*/i);
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
    static block            = (begin:IRule|string|RegExp|IToken, repeat:IRule|string|RegExp|IToken) => rule(
        begin, ":",
        Util.pushIndent,
        many(repeat, either(Util.peekIndent, Util.popIndent))
    )
    // static wswrap           = (...items:(IRule|string|RegExp|IToken)[]) => rule();
}
class Exp {
    static atom                 = rule(either(Val.anyliteral,                       // literal
                                            all(Ref.member, "(", () => Exp.exp, ")"),     // call
                                            all("(", () => Exp.exp, ")"),                 // parenthesised
                                            Ref.member));                           // member/var
    static exp                  = rule(Exp.atom, many(/ */, Op.anybinary, / */, Exp.atom));
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
    ).yields((r, c) => {
        console.log(r,c);
    });
    static membernames = rule(Ref.member, many(optional(Op.infix_comma, Ref.member)));
}

class Mod {
    static typedec = rule(Ref.typename, many(optional(Op.infix_comma, Ref.typename)))
        .yields(r => { return {
             typenames: r.get("typename") }; });
    static typedef_member:any = rule(optional(
            either(
                all(Ws.space0ton, Ws.newline, Ws.getIndent), // this is automatically the last IND from IND_WS
                Ws.space0ton
            )), Ref.typename, Op.infix_colon, Def.membernames).yields((raw:any) => {
                return { members: raw.get("member").map((name:string) => { return { name, type: raw.one("typename") }; }) };
            });
    static typedef_members = rule(many(Mod.typedef_member)).yields((_:any, cst:any) => {
            // the flattening!
            return { members: [].concat(...([].concat(...([].concat(...cst))).map((x:any) => x.members))) };
        });
    static typedef = rule(
        Util.block(Kwrd.type, Mod.typedec),
        optional(Util.block(Kwrd.is, Ref.basetypename)),
        optional(Util.block(Kwrd.with, Mod.typedef_members)),
        many(Def.methoddef)
    ).yields((raw:any, cst:any) => {
        let types:any = cst[0][0][0][0].typenames.map((name:string) => {
            let type:any = {
                name
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
            types
        };
    });
    static typedefs = rule(many(Mod.typedef, optional(Ws.ANY_WS)));
}

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

