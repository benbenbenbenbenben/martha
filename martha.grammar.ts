import { Tibu, Result, ResultTokens, Input, IRule, IToken, Pattern } from "tibu";
const { parse, token, rule, all, many, optional, either } = Tibu;

import { AST } from "./martha.ast";

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

// helpers
const manysep:any = (sep:Pattern, ...pattern:Pattern[]):(input:Input) => Result => {
    return optional(...pattern, many(sep, ...pattern));
};

const prettyprint:any = (x:any) => console.log(JSON.stringify(x, null, 2));

const op = (order:number, r2l:boolean, name:string, pattern:string | RegExp):IToken => {
    return Object.assign(token(name, pattern), {order, r2l})
}

const oneormore = (refrule:IRule):IRule => {
    return rule(refrule, many(refrule))
}

class Ctx {
    static contexts:any[] = []
    static push(ctx:any) : (input:Input) => Result {
        return (input:Input):Result => {
            Ctx.contexts.push(ctx)
            return Result.pass(input)
        }
    }
    static pop(ctx:any) : (input:Input) => Result {
        return (input:Input):Result => {
            if (Ctx.contexts && Ctx.contexts[Ctx.contexts.length - 1] === ctx) {
                Ctx.contexts.pop()
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
    static peek(ctx:any) : (input:Input) => Result {
        return (input:Input):Result => {
            if (Ctx.contexts && Ctx.contexts[Ctx.contexts.length - 1] === ctx) {
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
}

// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
class Mcro {
    static _let     = token("let", "let")
    static _new     = token("new", "new");
    static _typeof  = token("typeof", "typeof");
    static _sizeof  = token("sizeof", "sizeof");
    static _addrof  = token("addrof", /addrof|addressof/);
    static stateof  = token("stateof", "stateof");
    static delete   = token("delete", "delete");
    static return   = token("return", "return");
    // state transition operator
    static swapto   = token("swapto", "swapto");

    static get macros():IToken[] {
        return [
            this._let,
            this._new,
            this._typeof,
            this._sizeof,
            this._addrof,
            this.stateof,
            this.delete,
            this.return,
            this.swapto
        ]
    }
}
class Op {
    // binary infix
    static assign           = token("assign", "=");
    static pluseq           = token("pluseq", "+=");
    static minuseq          = token("minuseq", "-=");
    static multeq           = token("multeq", "*=");
    static powereq          = token("powereq", "**=");
    static diveq            = token("diveq", "/=");
    static modeq            = token("modeq", "%=");
    static careteq          = token("careteq", "^=");
    static ampeq            = token("ampeq", "&=");
    static pipeeq           = token("pipeeq", "|=");
    static shleq           = token("shleq", "<<=");
    static shreq           = token("shreq", ">>=");

    static lt               = token("lt", "<");
    static lte              = token("lte", "<=");
    static gt               = token("gt", ">");
    static gte              = token("gte", ">=");
    static dot              = token("dot", ".");
    static conditionaldot   = token("conditionaldot", "?.");
    static plus             = token("plus", "+");
    static minus            = token("minus", "-");
    static div              = token("div", "/");
    static mult             = token("mult", "*");
    static mod              = token("mod", "%");
    static power            = token("power", "**");

    // prefix/suffix
    static plusplus         = token("plusplus", "++");
    static minusminus       = token("minusminus", "--");

    static splat            = token("splat", "...")

    /**
     * token producer: binary operators
     */
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
    static lparen           = token("lparen", "(");
    static rparen           = token("rparen", ")");

    static arrow            = token("arrow", "->");

    static exc              = token("exc", "!")
    static tilde            = token("tilde", "~")

    static amp              = token("amp", "&")
    static caret            = token("caret", "^")
    static pipe             = token("pipe", "|")
    static ampamp           = token("ampamp", "&&")
    static pipepipe         = token("pipepipe", "||")

    static eqeq             = token("eq", "==")
    static noteq            = token("eq", "!=")
    static shiftleft        = token("shiftleft", "<<")
    static shiftright       = token("shiftright", ">>")
    

    static get anyprefix():any {
        return either(this.plusplus, this.minusminus);
    }
    static get anypostfix():any {
        return either(this.plusplus, this.minusminus);
    }

    /**
     * left to right
     */
    static get sorted0_postfix():IToken[] {
        return [
            // lparen,rparen,lsquare,rsquare
            Op.arrow,
            Op.dot,
            Op.conditionaldot,
            Op.plusplus,
            Op.minusminus,
        ]
    }
    /**
     * right to left
     */
    static get sorted1_prefix():IToken[] {
        return [
            Op.plusplus,
            Op.minusminus,
            Op.plus,
            Op.minus,
            Op.exc,
            Op.tilde,
            Op.splat,
            Op.dot,
        ]
    }
    /**
     * left to right
     */
    static get sorted2_binary(): IToken[] {
        return [
            Op.mult,
            Op.power,
            Op.div,
            Op.mod,
        ]
    }
    /**
     * left to right
     */
    static get sorted3_binary(): IToken[] {
        return [
            Op.plus,
            Op.minus,
        ]
    }
    /**
     * left to right
     */
    static get sorted4_binary(): IToken[] {
        return [
            Op.shiftleft,
            Op.shiftright,
        ]
    }    
    /**
     * left to right
     */
    static get sorted5_binary(): IToken[] {
        return [
            Op.lt,
            Op.lte,
            Op.gt,
            Op.gte,
        ]
    }
    /**
     * left to right
     */
    static get sorted6_binary(): IToken[] {
        return [
            Op.eqeq,
            Op.noteq,
        ]
    }
    /**
     * left to right (precedence implied)
     */
    static get sorted7_binary(): IToken[] {
        return [
            Op.amp,
            Op.caret,
            Op.pipe,
            Op.ampamp,
            Op.pipepipe,
        ]
    }

    /**
     * right to left
     */
    static get sorted9_binary(): IToken[] {
        return [
            Op.assign,
            Op.pluseq,
            Op.minuseq,
            Op.multeq,
            Op.diveq,
            Op.modeq,
            Op.shreq,
            Op.shleq,
            Op.ampeq,
            Op.careteq,
            Op.pipeeq,
            Op.powereq,
        ]
    }
    static get sortedA_binary(): IToken[] {
        return [
            Op.infix_comma
        ]
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
        return either(this.public, this.private, this.internal, this.protected)
    }

    static async        = token("async", /async/);
    static atomic       = token("atomic", /atomic/);

    static critical     = token("critical", /critical/);

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
    static lr0ton       = (token:IToken) => rule(Ws.space0ton, token, Ws.space0ton) 
}
class Util {
    static indents:string[] = [];
    static pushIndent       = rule(Ws.space0ton, Ws.newline, Ws.indent).yields((r:ResultTokens) => {
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
            all(repeat, /\s*/),
            all(repeat, Util.EOF),
            all(Util.EOF),
        )
    )
    // static wswrap           = (...items:(IRule|string|RegExp|IToken)[]) => rule();
}
class Exp {
    //static atomparen                = rule("(", optional(() => Exp.exp), ")")
    //.yields(AST.atomparen)
    //;
    //static atomcall                 = rule(Ref.member, "(", optional(() => Exp.exp, many(Op.infix_comma, () => Exp.exp)), ")")
    //.yields(AST.atomcall)
    //;
    static atomliteral          = rule(Val.anyliteral)
    .yields(AST.atomliteral)
    ;
    //static atomarrliteral       = rule(Op.lsquare, optional(() => Exp.exp, (many(Op.infix_comma, () => Exp.exp))), Op.rsquare)
    //.yields(AST.atomarrliteral)
    //;
    //static atomobjliteral       = rule(Op.lcurly,
    //    manysep(Op.infix_comma, either(all(Ref.member, Op.assign, () => Exp.exp), Ref.member)),
    //    Op.rcurly
    //)
    //.yields(AST.atomobjliteral)
    //;
    static atomlambdaliteral    = rule(Util.block(
        either(
            all("(", () => Def.argumentdefs, ")",),
            () => Def.argumentdef
        ), () => Stmt.statement));
    static atommember           = rule(Ref.member)
    .yields(AST.atommember)
    ;
    /**
     * cst producer
     */
    static subatom = rule(either(
        oneormore(rule("(", optional(() => Exp.exprAinfix), ")").yields(AST.parenthesis)),
        oneormore(rule("[", () => Exp.exprAinfix, "]").yields(AST.parenthesis)),
        Exp.atomliteral,
        Exp.atommember,        
    ))
    static atom                 = rule(
                                    either(                                             
                                            //rule("return", many(Ws.space0ton, Exp.subatom)),
                                            rule(Exp.subatom, many(Ws.space0ton, Exp.subatom))
                                            //rule(Exp.atommember, Ws.space0ton, "(", () => Exp.exprAinfix, ")").yields(AST.callnoparen),                                            
                                            
                                           // Exp.atomcall,
                                          //  Exp.atomarrliteral,
                                          //  Exp.atomobjliteral,
                                          //  Exp.atomlambdaliteral,
                                          //  Exp.atomparen,
                                            ),
                                  //  optional(rule(Op.anypostfix).yields(AST.postfixop))
    )
    .yields(AST.atom)
    ;
    /**
     * cst producer
     */    
    static expr0postfix         = rule(
                                    either(
                                        Exp.atom, 
                                        rule(Ctx.peek("spec")).yields(AST.thisref)
                                    ), 
                                    optional(Exp.atom),
                                    optional(either(...Op.sorted0_postfix))
                                ).yields(AST.postfixexpr)
    static expr1prefix          = rule(
                                    many(either(...Op.sorted1_prefix)), Exp.expr0postfix
                                ).yields(AST.prefixexpr)
    static expr2infix           = rule(
                                    Exp.expr1prefix, many(Ws.lr0ton(either(...Op.sorted2_binary)), Exp.expr1prefix)
                                ).yields(AST.binaryexpr)
    static expr3infix           = rule(
                                    Exp.expr2infix, many(Ws.lr0ton(either(...Op.sorted3_binary)), Exp.expr2infix)
                                ).yields(AST.binaryexpr)
    static expr4infix           = rule(
                                    Exp.expr3infix, many(Ws.lr0ton(either(...Op.sorted4_binary)), Exp.expr3infix)
                                ).yields(AST.binaryexpr)  
    static expr5infix           = rule(
                                    Exp.expr4infix, many(Ws.lr0ton(either(...Op.sorted5_binary)), Exp.expr4infix)
                                ).yields(AST.binaryexpr)
    static expr6infix           = rule(
                                    Exp.expr5infix, many(Ws.lr0ton(either(...Op.sorted6_binary)), Exp.expr5infix)
                                ).yields(AST.binaryexpr)
    static expr7infix           = rule(
                                    Exp.expr6infix, many(Ws.lr0ton(either(...Op.sorted7_binary)), Exp.expr6infix)
                                ).yields(AST.binaryexpr)

    static expr9infix           = rule(
                                    Exp.expr7infix, many(Ws.lr0ton(either(...Op.sorted9_binary)), Exp.expr7infix)
                                ).yields(AST.binaryexpr)
    static exprAinfix           = rule(
                                    Exp.expr9infix, many(Ws.lr0ton(either(...Op.sortedA_binary)), Exp.expr9infix)
                                ).yields(AST.commaexpr)
}

class Stmt {
    static statement = rule(
        either(
           // rule(either(...Mcro.macros), Ws.space0ton, () => Stmt.statement).yields(AST.call),
           // rule(Exp.exprAinfix, "(", () => Stmt.statement, ")").yields(AST.calluser),
           // rule(Exp.exprAinfix, Ws.space1ton, () => Stmt.statement).yields(AST.calluser),
            many(Exp.exprAinfix)
        )
    )
    .yields(AST.statement);
   // static statement        = rule(many(either(
   //     Stmt.stmt_expression,
        // z Stmt.stmt_switch,
        // z Stmt.stmt_if,
        // z Stmt.stmt_while,
        // z Stmt.stmt_for,
        // z Stmt.stmt_critical,
        // z Stmt.stmt_atomic
   // )))
   // .yields(AST.statement);
}


class Def {
    static argumentspec = rule(
            "{", Ctx.push("spec"), either(
                Stmt.statement,
                Ws.lr0ton(Ref.member),
            ),  Ctx.pop("spec"), "}"
        )
    .yields(AST.argumentsspec)
    ;
    static argumentdef = rule(Ws.lr0ton(Ref.typename), ":", Ws.lr0ton(Ref.varname), optional(Def.argumentspec))
    .yields(AST.argumentdef)
    ;
    static returndef = rule(Ref.typename, optional(Def.argumentspec))
    .yields(AST.returndef)
    ;
    static argumentdefs = rule(Def.argumentdef, many(Op.infix_comma, Def.argumentdef))
    .yields(AST.argumentdefs)
    ;
    static methoddef = rule(
        Util.block(
            all(
                optional(rule(Kwrd.anyaccess, many(Ws.space1ton, Kwrd.anyaccess), Ws.space1ton).yields(AST.anyaccess)),
                optional(Kwrd.static, Ws.space1ton),
                optional(Kwrd.async, Ws.space1ton),
                optional(Kwrd.atomic, Ws.space1ton),
                optional(Kwrd.critical, Ws.space1ton),
                either(
                    all(Def.returndef, Ws.space1ton, token("name", /\w+/)),
                    Kwrd.ctor
                ),
                optional(
                    Ws.lr0ton(Op.lparen),
                        optional(Def.argumentdefs),
                    Ws.lr0ton(Op.rparen)
                ),
            ), 
            Stmt.statement)
    )
    .yields(AST.methoddef)
    ;
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
        optional(Util.block(Kwrd.with, Mod.typedef_member)),
        many(Def.methoddef)
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