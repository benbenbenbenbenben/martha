import { Tibu, Result, ResultTokens, Input, IRule, IToken, Pattern } from "tibu";
const { parse, token, rule, all, many, optional, either } = Tibu;

import { AST } from "./martha.ast";
import { ProgramDef } from "./martha.program";
import { ImportDef, MacroDef, TypeDef } from "./martha.emit";

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

const named = (name:string) => {
    return (result:ResultTokens, cst:any):any => {
        return { named: name, result, cst }
    }
}

class Ctx {
    contexts:any[] = []
    push(ctx:any) : (input:Input) => Result {
        return (input:Input):Result => {
            this.contexts.push(ctx)
            return Result.pass(input)
        }
    }
    pop(ctx:any) : (input:Input) => Result {
        return (input:Input):Result => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                this.contexts.pop()
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
    peek(ctx:any) : (input:Input) => Result {
        return (input:Input):Result => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
    clear(input:Input): Result {
        this.contexts = []
        return Result.pass(input)
    }
}

// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
class Mcro {
    _let     = token("let", "let")
    _new     = token("new", "new");
    _typeof  = token("typeof", "typeof");
    _sizeof  = token("sizeof", "sizeof");
    _addrof  = token("addrof", /addrof|addressof/);
    stateof  = token("stateof", "stateof");
    delete   = token("delete", "delete");
    return   = token("return", "return");
    // state transition operator
    swapto   = token("swapto", "swapto");

    get macros():IToken[] {
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
    assign           = token("assign", "=");
    pluseq           = token("pluseq", "+=");
    minuseq          = token("minuseq", "-=");
    multeq           = token("multeq", "*=");
    powereq          = token("powereq", "**=");
    diveq            = token("diveq", "/=");
    modeq            = token("modeq", "%=");
    careteq          = token("careteq", "^=");
    ampeq            = token("ampeq", "&=");
    pipeeq           = token("pipeeq", "|=");
    shleq           = token("shleq", "<<=");
    shreq           = token("shreq", ">>=");

    lt               = token("lt", "<");
    lte              = token("lte", "<=");
    gt               = token("gt", ">");
    gte              = token("gte", ">=");
    dot              = token("dot", ".");
    conditionaldot   = token("conditionaldot", "?.");
    plus             = token("plus", "+");
    minus            = token("minus", "-");
    div              = token("div", "/");
    mult             = token("mult", "*");
    mod              = token("mod", "%");
    power            = token("power", "**");

    // prefix/suffix
    plusplus         = token("plusplus", "++");
    minusminus       = token("minusminus", "--");

    splat            = token("splat", "...")

    /**
     * token producer: binary operators
     */
    get anybinary():any {
        return either(this.assign, this.pluseq, this.lt, this.lte, this.gt, this.gte,
            this.dot, this.plus, this.minus, this.div, this.mult, this.mod);
    }

    infix_comma  = rule(/\s*,\s*/);
    infix_colon  = rule(/\s*\:\s*/);

    lsquare          = token("lsquare", "[");
    rsquare          = token("rsquare", "]");
    lcurly           = token("lcurly", "{");
    rcurly           = token("rcurly", "}");
    langle           = token("langle", "<");
    rangle           = token("rangle", ">");
    lparen           = token("lparen", "(");
    rparen           = token("rparen", ")");

    arrow            = token("arrow", "->");

    exc              = token("exc", "!")
    tilde            = token("tilde", "~")

    amp              = token("amp", "&")
    caret            = token("caret", "^")
    pipe             = token("pipe", "|")
    ampamp           = token("ampamp", "&&")
    pipepipe         = token("pipepipe", "||")

    eqeq             = token("eq", "==")
    noteq            = token("eq", "!=")
    shiftleft        = token("shiftleft", "<<")
    shiftright       = token("shiftright", ">>")
    

    get anyprefix():any {
        return either(this.plusplus, this.minusminus);
    }
    get anypostfix():any {
        return either(this.plusplus, this.minusminus);
    }

    /**
     * 0. left to right
     */
    get postfixOperators():IToken[] {
        return [
            // lparen,rparen,lsquare,rsquare
            // Op.arrow,
            // Op.dot,
            // Op.conditionaldot,
            this.plusplus,
            this.minusminus,
        ]
    }
    /**
     * right to left
     */
    get sorted1_prefix():IToken[] {
        return [
            this.plusplus,
            this.minusminus,
            this.plus,
            this.minus,
            this.exc,
            this.tilde,
            this.splat,
           // this.dot,
        ]
    }
    /**
     * left to right
     */
    get sorted2_binary(): IToken[] {
        return [
            this.dot,
            this.mult,
            this.power,
            this.div,
            this.mod,
        ]
    }
    /**
     * left to right
     */
    get sorted3_binary(): IToken[] {
        return [
            this.plus,
            this.minus,
        ]
    }
    /**
     * left to right
     */
    get sorted4_binary(): IToken[] {
        return [
            this.shiftleft,
            this.shiftright,
        ]
    }    
    /**
     * left to right
     */
    get sorted5_binary(): IToken[] {
        return [
            this.lt,
            this.lte,
            this.gt,
            this.gte,
        ]
    }
    /**
     * left to right
     */
    get sorted6_binary(): IToken[] {
        return [
            this.eqeq,
            this.noteq,
        ]
    }
    /**
     * left to right (precedence implied)
     */
    get sorted7_binary(): IToken[] {
        return [
            this.amp,
            this.caret,
            this.pipe,
            this.ampamp,
            this.pipepipe,
        ]
    }

    /**
     * right to left
     */
    get sorted9_binary(): IToken[] {
        return [
            this.assign,
            this.pluseq,
            this.minuseq,
            this.multeq,
            this.diveq,
            this.modeq,
            this.shreq,
            this.shleq,
            this.ampeq,
            this.careteq,
            this.pipeeq,
            this.powereq,
        ]
    }
    get sortedA_binary(): IToken[] {
        return [
            this.infix_comma
        ]
    }
}
class Val {
    bool         = token("bool", /true|false/);
    integer      = token("integer", /[\d]+/);
    str          = token("string", /"[^"]+"|'[^']+'/);

    get anyliteral():any {
        return either(this.bool, this.integer, this.str);
    }
}
class Kwrd {
    // access
    public       = token("public", /public/);
    private      = token("private", /private/);
    internal     = token("internal", /internal/);
    protected    = token("protected", /protected/);

    get anyaccess():any {
        return either(this.public, this.private, this.internal, this.protected)
    }

    async        = token("async", /async/);
    atomic       = token("atomic", /atomic/);

    critical     = token("critical", /critical/);

    static       = token("static", /static/);

    ctor         = token("ctor", /constructor/);

    macro        = "macro"
    when         = "when"
    use          = "use"

    type         = "type";
    is           = "is";
    as           = "as";
    with         = "with";

    import       = "import"
}
class Ref {
    op: Op;
    constructor(op:Op) {
        this.op = op
    }
    // members and variables
    _member      = token("member", /[a-z_\$\@][a-z0-9\$\@]*/i);
    varname      = token("varname", /[a-z_\$\@][a-z0-9\$\@]*/i);
    member       = rule(this._member, many(this.op.dot, this._member))
                            .yields(AST.reference);
    typename     = token("typename", /[a-z_\$\@][a-z0-9\$\@]*/i);
}
class Ws {
    space0ton    = /[ \t]*/;
    space1ton    = /[ \t]+/;
    newline      = /\r\n|\r|\n|\n\r/;
    indent       = token("indent", /^[ \t]+/);

    IND:any      = rule(this.newline, this.indent).yields(function(this:any, result:ResultTokens):void {
                                this._indent = result.tokens[0].result.value;
                            });
    getIndent    = (input:Input):Result => {
                            let index:number = input.source.substring(input.location).indexOf(this.IND._indent);
                            if (index === 0) {
                                input.location += this.IND._indent.length;
                                return Result.pass(input);
                            }
                            return Result.fault(input);
                        }
    IND_WS       = rule(this.space0ton, optional(this.IND));
    ANY_WS       = rule(/[\t\r\n\s]*/);
    lr0ton       = (token:IToken) => rule(this.space0ton, token, this.space0ton) 
}
class Util {
    ws: Ws;
    constructor(ws:Ws) {
        this.ws = ws
    }
    indents:string[] = [];
    pushIndent       = rule(this.ws.space0ton, this.ws.newline, this.ws.indent).yields((r:ResultTokens) => {
        this.indents.push(r.tokens[0].result.value);
    });
    peekIndent       = rule(this.ws.newline, (input:Input):Result => {
        let index:number = input.source.substring(input.location).indexOf(this.indents[this.indents.length - 1]);
        if (index === 0) {
            input.location += this.indents[this.indents.length - 1].length;
            return Result.pass(input);
        }
        return Result.fault(input);
    });
    popIndent        = rule(this.ws.newline, (input:Input):Result => {
        this.indents.pop();
        return Result.pass(input);
    });
    EOF              = rule((input:Input):Result => input.location === input.source.length ?
                                    Result.pass(input) : Result.fault(input));
    block            = (begin:IRule|string|RegExp|IToken, repeat:IRule|string|RegExp|IToken) => rule(
        begin, /[ \t]*:[ \t]*/,
        either(
            all(this.pushIndent, many(repeat, either(this.peekIndent, this.popIndent, this.EOF))),
            all(repeat, /\s*/),
            all(repeat, this.EOF),
            all(this.EOF),
        )
    )
}
class Exp {
    ctx: Ctx
    def: Def
    ref: Ref
    op: Op
    stmt: Stmt
    val: Val
    util: Util
    ws: Ws
    constructor(ctx:Ctx, def:Def, ref:Ref, op:Op, stmt:Stmt, val:Val, util:Util, ws:Ws) {
        this.ctx = ctx
        this.def = def
        this.ref = ref
        this.op = op
        this.stmt = stmt
        this.val = val
        this.util = util
        this.ws = ws
    }
    atomliteral          = rule(this.val.anyliteral)
    .yields(AST.atomliteral)
    ;    
    atomlambdaliteral    = rule(this.util.block(
        either(
            all("(", () => this.def.argumentdefs, ")",),
            () => this.def.argumentdef
        ), () => this.stmt.statement));
    atommember           = rule(this.ref.member)
    .yields(AST.atommember)
    ;
    /**
     * cst producer
     */
    subatom = rule(either(
        oneormore(rule("(", optional(() => this.exprAinfix), ")").yields(AST.parenthesis)),
        oneormore(rule(/\{[ \t]*/, optional(() => this.exprAinfix), /[ \t]*\}/).yields(AST.parenthesis)),
        oneormore(rule("[", () => this.exprAinfix, "]").yields(AST.parenthesis)),
        this.atomliteral,
        this.atommember,        
    ))
    atom                 = rule(
                                    either(
                                            rule(this.subatom, many(this.ws.space0ton, this.subatom)),
                                            rule(this.ctx.peek("spec")).yields(AST.thisref),
                                            ),
    )
    .yields(AST.atom)
    ;
    /**
     * cst producer
     */    
    expr0postfix         = rule(
                                    this.atom, many(either(...this.op.postfixOperators))
                                ).yields(AST.postfixexpr)
    expr1prefix          = rule(
                                    many(either(...this.op.sorted1_prefix)), this.expr0postfix
                                ).yields(AST.prefixexpr)
    expr2infix           = rule(
                                    this.expr1prefix, many(this.ws.lr0ton(either(...this.op.sorted2_binary)), this.expr1prefix)
                                ).yields(AST.binaryexpr)
    expr3infix           = rule(
                                    this.expr2infix, many(this.ws.lr0ton(either(...this.op.sorted3_binary)), this.expr2infix)
                                ).yields(AST.binaryexpr)
    expr4infix           = rule(
                                    this.expr3infix, many(this.ws.lr0ton(either(...this.op.sorted4_binary)), this.expr3infix)
                                ).yields(AST.binaryexpr)  
    expr5infix           = rule(
                                    this.expr4infix, many(this.ws.lr0ton(either(...this.op.sorted5_binary)), this.expr4infix)
                                ).yields(AST.binaryexpr)
    expr6infix           = rule(
                                    this.expr5infix, many(this.ws.lr0ton(either(...this.op.sorted6_binary)), this.expr5infix)
                                ).yields(AST.binaryexpr)
    expr7infix           = rule(
                                    this.expr6infix, many(this.ws.lr0ton(either(...this.op.sorted7_binary)), this.expr6infix)
                                ).yields(AST.binaryexpr)

    expr9infix           = rule(
                                    this.expr7infix, many(this.ws.lr0ton(either(...this.op.sorted9_binary)), this.expr7infix)
                                ).yields(AST.binaryexpr)
    exprAinfix           = rule(
                                    this.expr9infix, many(this.ws.lr0ton(either(...this.op.sortedA_binary)), this.expr9infix)
                                ).yields(AST.commaexpr)
}

class Stmt {
    ctx: Ctx
    exp: Exp
    constructor(ctx:Ctx, exp:Exp) {
        this.ctx = ctx
        this.exp = exp     
    }
    statement = rule(
        either(
           // rule(either(...Mcro.macros), Ws.space0ton, () => Stmt.statement).yields(AST.call),
           // rule(this.exp.exprAinfix, "(", () => Stmt.statement, ")").yields(AST.calluser),
           // rule(this.exp.exprAinfix, Ws.space1ton, () => Stmt.statement).yields(AST.calluser),
            many(this.exp.exprAinfix, optional(this.ctx.clear))
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
    ctx: Ctx
    def: Def
    kwrd: Kwrd
    ref: Ref
    op: Op
    stmt: Stmt
    val: Val
    util: Util
    ws: Ws
    constructor(ctx:Ctx, def:Def, kwrd:Kwrd, ref:Ref, op:Op, stmt:Stmt, val:Val, util:Util, ws:Ws) {
        this.ctx = ctx
        this.def = def
        this.kwrd = kwrd
        this.ref = ref
        this.op = op
        this.stmt = stmt
        this.val = val
        this.util = util
        this.ws = ws
    }
    argumentspec = rule(
            "{", this.ctx.push("spec"), this.stmt.statement, "}"//, this.ctx.pop("spec")
        )
    .yields(AST.argumentsspec)
    ;
    argumentdef = rule(this.ws.lr0ton(this.ref.typename), ":", this.ws.lr0ton(this.ref.varname), optional(this.argumentspec))
    .yields(AST.argumentdef)
    ;
    returndef = rule(this.ref.typename, optional(this.argumentspec))
    .yields(AST.returndef)
    ;
    argumentdefs = rule(this.argumentdef, many(this.op.infix_comma, this.argumentdef))
    .yields(AST.argumentdefs)
    ;
    methoddef = rule(
        this.util.block(
            all(
                optional(rule(this.kwrd.anyaccess, many(this.ws.space1ton, this.kwrd.anyaccess), this.ws.space1ton).yields(AST.anyaccess)),
                optional(this.kwrd.static, this.ws.space1ton),
                optional(this.kwrd.async, this.ws.space1ton),
                optional(this.kwrd.atomic, this.ws.space1ton),
                optional(this.kwrd.critical, this.ws.space1ton),
                either(
                    all(this.returndef, this.ws.space1ton, token("name", /\w+/)),
                    this.kwrd.ctor
                ),
                optional(
                    this.ws.lr0ton(this.op.lparen),
                        optional(this.argumentdefs),
                    this.ws.lr0ton(this.op.rparen)
                ),
            ), 
            many(this.stmt.statement))
    )
    .yields(AST.methoddef)
    ;

    macrodef = rule(
        rule(this.util.block(this.kwrd.macro, either(this.ref._member, this.val.str))).yields(named("macro")),
        rule(this.util.block(this.kwrd.is, this.stmt.statement)).yields(named("is")),
        rule(this.util.block(this.kwrd.as, this.stmt.statement)).yields(named("as")),
    )
    .yields(AST.macrodef)
    ;
    macrodefs = rule(
        many(this.macrodef, optional(this.ws.ANY_WS))
    )
    .yields(AST.flatcst)
    ;

    membernames = rule(this.ref.member, many(optional(this.op.infix_comma, this.ref.member)))
    .yields((result:ResultTokens, cst:any) => {
        return flat(cst);
    });

    importdef = rule(this.kwrd.import, this.ws.space1ton, this.ref.member)
    .yields(AST.importdef)
    ;
    importdefs = rule(many(this.importdef, optional(this.ws.ANY_WS)))
    .yields(AST.flatcst)
    ;

    typedef_name = rule(this.ref.typename, many(optional(this.op.infix_comma, this.ref.typename)))
    .yields(AST.typedef_name)
    ;
    typedef_member = rule(this.ref.typename, this.op.infix_colon, this.membernames)
    .yields(AST.typedef_member)
    ;
    typedef_basetype = rule(this.ref.typename)
    .yields(AST.typedef_basetype)
    ;
    typedef = rule(
        this.util.block(this.kwrd.type, this.typedef_name),
        optional(this.util.block(this.kwrd.is, this.typedef_basetype)),
        optional(this.util.block(this.kwrd.with, this.typedef_member)),
        many(this.methoddef)
    )
    .yields(AST.typedef)
    ;
    typedefs = rule(many(this.typedef, optional(this.ws.ANY_WS)))
    .yields(AST.flatcst)
    ;
}

class ParserContext {
    ctx: Ctx
    def: Def
    ref: Ref
    op: Op
    stmt: Stmt
    val: Val
    util: Util
    ws: Ws
    constructor(ctx:Ctx, def:Def, ref:Ref, op:Op, stmt:Stmt, val:Val, util:Util, ws:Ws) {
        this.ctx = ctx
        this.def = def
        this.ref = ref
        this.op = op
        this.stmt = stmt
        this.val = val
        this.util = util
        this.ws = ws
    }

    imports = rule(
        optional(this.def.importdefs),
    )
    macros = rule(
        optional(this.def.macrodefs),
    )
    types = rule(
        optional(this.def.typedefs),
    )
    statements = rule(
        optional(this.stmt.statements),
    )

    program = rule(
        this.ws.ANY_WS,
        this.imports,
        this.macros,
        this.types,
       // Compilation.statements,
    )

    private macroDefs:MacroDef[] = []
    private macroImpls:MacroImpl[] = []

    public addMacro(macro:MacroDef):void {
        if (this.macroDefs.find(x => x.identity === macro.identity)) {
            throw new Error(`Macro ${macro.identity} is already registered.`)
        }

        if (macro.is === "infix") {
            
        }
        this.macroDefs.push(macro)
    }

    public parse(source:string):ProgramDef {
        let program:ProgramDef = new ProgramDef()
        parse(
            source
        )(
            this.ws.ANY_WS,
            this.program
            .yields((_:ResultTokens, cst:any) => {
                const fcst = flat(cst)
                console.log(fcst[2].as[0])
                program.imports = fcst.filter(x => x instanceof ImportDef) || []
                program.macros = fcst.filter(x => x instanceof MacroDef) || []
                program.types = fcst.filter(x => x instanceof TypeDef) || []
                // TODO program.statements = fcst.filter(x => x instanceof Statement)
            })
        )
        return program
    }
}

export {
    Ctx,
    
    Op,
    Ws,
    Val,
    Exp,
    Util,
    Kwrd,
    Stmt,
    Ref,
    Mcro,
    Def,

    ParserContext,
};