import { Tibu, Result, ResultTokens, Input, IRule, IToken, Pattern } from "tibu";
const { parse, token, rule, all, many, optional, either } = Tibu;

import { AST } from "./martha.ast";
import { ProgramDef } from "./martha.program";
import { ImportDef, MacroDef, TypeDef, Statement } from "./martha.emit";

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

const inf = (refrule:IRule | IToken):IRule => rule(/\s*/, refrule, /\s*/)


class WithParserContext {
    public context:ParserContext
    constructor(context:ParserContext) {
        this.context = context
    }
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
    context: ParserContext
    contexts: any[];
    constructor(context:ParserContext) {
        this.context = context
        this.contexts = []
    }
    push(ctx:string): (input:Input) => Result {
        return (input:Input):Result => {
            this.contexts.push(ctx)
            input.yieldtoken(ctx, Result.pass(input))
            return Result.pass(input)
        }
    }
    pop(ctx:string): (input:Input) => Result {
        return (input:Input):Result => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                this.contexts.pop()
                input.yieldtoken(ctx, Result.pass(input))
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
    peek(ctx:string): (input:Input) => Result {
        return (input:Input):Result => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                input.yieldtoken(ctx, Result.pass(input))
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
    clear(): (input:Input) => Result {
        return (input:Input):Result => {
            this.contexts.forEach(ctx => input.yieldtoken(ctx, Result.pass(input)))
            this.contexts = []
            return Result.pass(input)
        }
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
    range            = token("range", "..")

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
    infix_arrow  = rule(/\s*\-\>\s*/);
    infix_fatarrow  = rule(/\s*\=\>\s*/);

    lsquare          = token("lsquare", "[");
    rsquare          = token("rsquare", "]");
    lcurly           = token("lcurly", "{");
    rcurly           = token("rcurly", "}");
    langle           = token("langle", "<");
    rangle           = token("rangle", ">");
    lparen           = token("lparen", "(");
    rparen           = token("rparen", ")");

    arrow            = token("arrow", "->");
    fatarrow         = token("arrow", "=>");

    exc              = token("exc", "!")
    tilde            = token("tilde", "~")
    ques             = token("ques", "?")
    colon            = token("colon", ":")

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
            this.power,
            this.mult,
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
            this.lte,
            this.lt,
            this.gte,
            this.gt,
        ]
    }
    /**
     * left to right
     */
    get sorted5b_binary(): IToken[] {
        return [
            this.ques,
            //this.colon,
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
            this.ampamp,
            this.amp,
            this.caret,
            this.pipepipe,
            this.pipe,
            this.range, // TODO: consider, range operator should be 8th not 7th
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
    get sortedA_binary(): IRule[] {
        return [
            this.infix_comma
        ]
    }
}
class Val extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    bool         = token("bool", /true|false/);
    integer      = token("integer", /[\d]+/);
    str          = token("string", /"[^"]*"|'[^']*'/);

    get anyliteral():any {
        return either(this.bool, this.integer, this.str);
    }
}
class Kwrd {
    context: ParserContext
    constructor(context:ParserContext) {
        this.context = context
    }
    // access
    public       = token("public", /public/);
    private      = token("private", /private/);
    internal     = token("internal", /internal/);
    protected    = token("protected", /protected/);

    get anyaccess():any {
        return either(this.public, this.private, this.internal, this.protected)
    }


    export       = token("export", "export")
    extern       = token("extern", "extern")
    abstract     = token("abstract", "abstract")

    async        = token("async", /async/);
    atomic       = token("atomic", /atomic/);

    critical     = token("critical", /critical/);

    static       = token("static", /static/);

    ctor         = token("ctor", /constructor/);

    macro        = "macro"
    for          = "for"
    when         = "when"
    use          = "use"
    from         = "from"

    type         = "type"
    machine      = "machine"
    state        = "state"
    interface    = "interface"
    is           = "is";
    as           = "as";
    with         = "with";

    import       = "import"
}
class Ref extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    // members and variables
    _member      = token("member", /[a-z_\$\@][_a-z0-9\$\@]*/i);
    varname      = token("varname", /[a-z_\$\@][_a-z0-9\$\@]*/i);
    member       = rule(this._member, many(this.context.op.dot, this._member))
                            .yields(AST.reference);
    typename     = token("typename", /[a-z_\$\@][a-z0-9\$\@]*/i);
}
class Ws extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    space0ton    = /[ \t]*/;
    space1ton    = /[ \t]+/;
    newline      = /\r\n|\r|\n\r|\n/;
    indent       = token("indent", /^[ \t]+/);

    emptyline    = rule(/\s*$/, this.newline)
    emptylines   = rule(many(this.emptyline))

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
    lr0ton       = (token:Pattern) => rule(this.space0ton, token, this.space0ton)
}
class Util extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    indents:string[] = [];
    pushIndent       = rule(this.context.ws.newline, this.context.ws.indent).yields((r:ResultTokens) => {
        this.indents.push(r.one("indent")!.value)
    });
    peekIndent       = rule(this.context.ws.space0ton, this.context.ws.newline, (input:Input):Result => {
        let index:number = input.source.substring(input.location).indexOf(this.indents[this.indents.length - 1]);
        index // ?
        if (index === 0) {
            input.location += this.indents[this.indents.length - 1].length;
            return Result.pass(input);
        }
        return Result.fault(input);
    });
    popIndent        = rule((input:Input):Result => {
        input.source.substring(input.location)
        this.indents.pop()
        return Result.pass(input)
    });
    EOF              = rule((input:Input):Result => input.location === input.source.length ?
                                    Result.pass(input) : Result.fault(input));
    block            = (begin:Pattern, repeat:Pattern) => rule(
       //  many(this.context.ws.newline),
        begin, /[ \t]*=[ \t]*/,
        either(
            all(this.pushIndent, repeat,
                many(
                    this.peekIndent,
                    repeat, this.context.ws.space0ton
                ),
                this.popIndent
            ),
            all(repeat, many(repeat), /[ \t]*/),
            all(repeat, many(repeat), this.EOF),
            all(optional(/\s*/), this.EOF),
        )
    )
}
class Exp extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    ifexp = rule(
        this.context.util.block(
            all("if", this.context.ws.space1ton, () => this.context.stmt.statement),
            all(() => this.context.stmt.statement)
        )
    )
    .yields(named("if"))
    ;
    atomliteral          = rule(this.context.val.anyliteral)
    .yields(AST.atomliteral)
    ;    
    atomlambdaliteral    = rule(
        rule(either(
            all("(", () => this.context.def.argumentdefs, ")",),
            all("(", optional(this.context.ref._member, many(this.context.op.infix_comma, this.context.ref._member)), ")",),
            () => this.context.def.argumentdef,
            this.context.ref._member
        )).yields(named("spec")), this.context.ws.lr0ton("=>"), rule(() => this.context.stmt.statement).yields(named("body")))
    .yields(AST.atomlambdaliteral)
    ;
    atommember           = rule(this.context.ref.member)
    .yields(AST.atommember)
    ;
    /**
     * MACRO INSERTION
     */
    atominsert:IRule[] = []
    /**
     * cst producer
     */
    subatom = rule(either(    
         /**/
        (input:Input) => {
            //console.log("looking for insert", this.atominsert.length)
            if (this.atominsert.length)
                return rule(either(...this.atominsert))
            else
                return Result.fault(input)
        },  

        this.atomlambdaliteral,
        oneormore(rule(
            /[ \t]*\(/, 
            many(
                this.context.ws.ANY_WS,
                () => this.exprAinfix,
                this.context.ws.ANY_WS
            ),
            /[ \t]*\)/
        ).yields(AST.bracketparen)),
        oneormore(rule(
            /[ \t]*\{/, 
            many(
                this.context.ws.ANY_WS,
                () => this.exprAinfix,
                this.context.ws.ANY_WS
            ),
            /[ \t]*\}/
        ).yields(AST.bracketcurly)),
        oneormore(rule(
            /[ \t]*\[/, 
            many(
                this.context.ws.ANY_WS,
                () => this.exprAinfix,
                this.context.ws.ANY_WS
            ),
            /[ \t]*\]/
        ).yields(AST.bracketarray)),
        this.atomliteral,
        this.atommember,
    ))
    atom = rule(
        either(  
            rule(this.subatom, many(this.context.ws.space0ton, this.subatom)),
            rule(this.context.ctx.peek("spec")).yields(AST.thisref),
        ),
    )
    .yields(AST.atom)
    ;
    /**
     * cst producer
     */    
    expr0postfix         = rule(
                                    this.atom, many(either(...this.context.op.postfixOperators))
                                ).yields(AST.postfixexpr)
    expr1prefix          = rule(
                                    many(either(...this.context.op.sorted1_prefix)), this.expr0postfix
                                ).yields(AST.prefixexpr)
    expr2infix           = rule(
                                    this.expr1prefix, many(this.context.ws.lr0ton(either(...this.context.op.sorted2_binary)), this.expr1prefix)
                                ).yields(AST.binaryexpr)
    expr3infix           = rule(
                                    this.expr2infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted3_binary)), this.expr2infix)
                                ).yields(AST.binaryexpr)
    expr4infix           = rule(
                                    this.expr3infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted4_binary)), this.expr3infix)
                                ).yields(AST.binaryexpr)  
    expr5infix           = rule(
                                    this.expr4infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted5_binary)), this.expr4infix)
                                ).yields(AST.binaryexpr)
    expr5binfix          = rule(
                                    this.expr5infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted5b_binary)), this.expr5infix)
                                ).yields(AST.binaryexpr)
    expr6infix           = rule(
                                    this.expr5binfix, many(this.context.ws.lr0ton(either(...this.context.op.sorted6_binary)), this.expr5binfix)
                                ).yields(AST.binaryexpr)
    expr7infix           = rule(
                                    this.expr6infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted7_binary)), this.expr6infix)
                                ).yields(AST.binaryexpr)

    expr9infix           = rule(
                                    this.expr7infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted9_binary)), this.expr7infix)
                                ).yields(AST.binaryexpr)
    exprAinfix           = rule(
                                    this.expr9infix, many(this.context.ws.lr0ton(either(...this.context.op.sortedA_binary)), this.expr9infix)
                                ).yields(AST.commaexpr)
}

class Stmt extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    statement = rule(
        either(
            // rule(either(...Mcro.macros), Ws.space0ton, () => Stmt.statement).yields(AST.call),
            // rule(this.context.exp.exprAinfix, "(", () => Stmt.statement, ")").yields(AST.calluser),
            // rule(this.context.exp.exprAinfix, Ws.space1ton, () => Stmt.statement).yields(AST.calluser),
            this.context.util.block(
                "critical",
                all(() => this.context.stmt.statement)
            ),
            this.context.util.block(
                "atomic",
                all(() => this.context.stmt.statement)
            ),            
            this.context.util.block(
                "async",
                all(() => this.context.stmt.statement)
            ),                      
            // TODO: this is a contextual rule
            this.context.util.block(
                "emit",
                all(() => this.context.stmt.statement)
            ),
            this.context.util.block(
                all("lock", this.context.ws.space1ton, many(this.context.exp.exprAinfix)),
                all(() => this.context.stmt.statement)
            ),
            this.context.util.block(
                all("while", this.context.ws.space1ton, many(this.context.exp.exprAinfix)),
                all(() => this.context.stmt.statement)
            ),
            rule(
                this.context.exp.ifexp,
                many(
                    rule(
                        many(this.context.ws.newline),
                        "else", this.context.ws.space1ton, this.context.exp.ifexp
                    ).yields(named("elseif"))
                ),
                optional(
                    this.context.util.block(
                        "else", all(() => this.context.stmt.statement)
                    ).yields(named("else"))
                )
            ).yields(AST.ifexp),
            many(this.context.exp.exprAinfix, optional(this.context.ctx.clear()))
        )
    )
    .yields(AST.statement);
    macrospecification = rule(
        token("insert", /\$\w+/),
        this.context.ws.lr0ton("("),
        many(either(
            rule(this.context.ws.lr0ton(token("rulereference", /\$[a-z0-9\.]+/i))),//.yields(named("reference"))),
            rule(this.context.ws.lr0ton(token("ruleword", /\w+/)))//.yields(named("word")))
        )),
        this.context.ws.lr0ton(")"),
    )
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

class Def extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    argumentspec = rule(rule(
            "{", this.context.ctx.push("spec"), this.context.stmt.statement, "}"//, this.context.ctx.pop("spec")
    )
    .yields(named("argspec"))
    )
    .yields(AST.argumentsspec)
    ;
    argumentdef = rule( 
        optional(this.context.op.splat),
        this.context.ws.lr0ton(this.context.ref.varname),
        this.context.op.infix_colon,
        () => this.context.def.typedef_type,
        optional(this.argumentspec)
    )
    .yields(AST.argumentdef)
    ;
    returndef = rule(() => this.context.ref.member, optional(this.argumentspec))
    .yields(AST.returndef)
    ;
    argumentdefs = rule(this.argumentdef, many(this.context.op.infix_comma, this.argumentdef))
    .yields(AST.argumentdefs)
    ;
    /*
    methoddef = rule(
        optional(rule("@", this.context.stmt.statement, this.context.ws.space0ton).yields(AST.attribute)),
        this.context.util.block(
            all(
                rule(() => this.membermodifiers).yields(named("accessors")),
                rule(() => this.context.def.typedef_type).yields(named("returntype")),
                rule(() => this.context.ref.member).yields(named("name")),
                rule(() => this.context.def.argumentspec).yields(named("returnspec")),
                optional(
                    this.context.ws.lr0ton(this.context.op.arrow),
                    // next state(s)
                    rule(this.context.ref.member).yields(named("nextstate"))
                )
            ),
            this.context.stmt.statement
        )
    )
    .yields(AST.methoddef)
    ;
    */
/*
    methoddec = rule(
        optional(rule(this.context.kwrd.anyaccess, many(this.context.ws.space1ton, this.context.kwrd.anyaccess), this.context.ws.space1ton).yields(AST.anyaccess)),
        optional(this.context.kwrd.export, this.context.ws.space1ton),
        optional(this.context.kwrd.extern, this.context.ws.space1ton),
        optional(this.context.kwrd.static, this.context.ws.space1ton),
        optional(this.context.kwrd.async, this.context.ws.space1ton),
        optional(this.context.kwrd.atomic, this.context.ws.space1ton),
        optional(this.context.kwrd.critical, this.context.ws.space1ton),
        either(
            all(this.returndef, this.context.ws.space1ton, token("name", /\w+/)),
            this.context.kwrd.ctor
        ),
        optional(
            this.context.ws.lr0ton(this.context.op.lparen),
                optional(this.argumentdefs),
            this.context.ws.lr0ton(this.context.op.rparen)
        )
    )
    ;*/

    macrodef = rule(
        this.context.util.block(
            rule(
                all(this.context.kwrd.macro,
                    this.context.ws.space1ton, 
                    rule(either(this.context.ref._member, this.context.val.str)).yields(named("name")), 
                    this.context.ws.space1ton, 
                    this.context.kwrd.for, 
                    this.context.ws.space1ton, 
                    rule(this.context.ref.member).yields(named("insert")))
            ).yields(named("def")),
            rule(this.context.util.block(
                rule(
                    this.context.kwrd.as,
                    this.context.ws.space1ton,                
                    rule(this.context.stmt.statement)
                ), 
                this.context.stmt.statement)
            ).yields(AST.macrorule),
        )
    )
    .yields(AST.macrodef)
    ;
    macrodefs = rule(
        many(this.macrodef, optional(this.context.ws.ANY_WS))
    )
    .yields(AST.flatcst)
    ;

    modifiers_N = rule(many(
        either(
            this.context.kwrd.anyaccess,
            this.context.kwrd.abstract,
            this.context.kwrd.export,
            this.context.kwrd.extern,
            this.context.kwrd.static,
            this.context.kwrd.async,
            this.context.kwrd.atomic,
            this.context.kwrd.critical,
        ), 
        this.context.ws.space1ton
        )
    ).yields(named("modifiers"))

    membernames = rule(this.context.ref.member, many(optional(this.context.op.infix_comma, this.context.ref.member)))
    .yields((result:ResultTokens, cst:any) => {
        return flat(cst);
    });

    varnames = rule(this.context.ref.varname, many(this.context.op.infix_comma, this.context.ref.varname))
    .yields(AST.varnames)

    importdef = rule(
        this.context.kwrd.import,
        this.context.ws.space1ton, 
        rule(this.context.ref.member).yields(named("name")),
        optional(
            this.context.ws.space1ton, 
            this.context.kwrd.from, 
            this.context.ws.space1ton, 
            rule(this.context.ref.member).yields(named("library"))
        )
    )
    .yields(AST.importdef)
    ;
    importdefs = rule(many(this.importdef, optional(this.context.ws.ANY_WS)))
    .yields(AST.flatcst)
    ;

    typedef_name = rule(
        this.context.ref.typename,
        many(this.context.op.infix_comma, this.context.ref.typename))
    .yields(AST.typedef_name)
    ;
    typedef_type = rule(
        rule(
            this.context.ref.member
        ).yields(named("name")),
        // TODO: generic
        optional(
            rule(
                inf(this.context.op.langle),
                // TODO: upgrade to bracket/block
                rule(all(() => this.context.def.typedef_type)),
                many(
                    this.context.op.infix_comma, 
                    rule(all(() => this.context.def.typedef_type))
                ),
                inf(this.context.op.rangle)
            ).yields(named("types"))
        ),
        // indexer
        optional(
            rule(
                inf(this.context.op.lsquare),
                optional(
                    () => this.context.def.typedef_type
                ),
                inf(this.context.op.rsquare)
            ).yields(named("indexer"))
        ),
        // func type
        optional(
            rule(
                inf(this.context.op.lparen),
                optional(
                    () => this.context.def.typedef_type
                ),
                many(
                    this.context.op.infix_comma,
                    rule(all(() => this.context.def.typedef_type))
                ),
                inf(this.context.op.rparen)
            ).yields(named("callsignature"))
        ),
        // return type
        optional(
            this.context.op.infix_fatarrow,
            rule(all(() => this.context.def.typedef_type))
        )
    )
    .yields(AST.typedef_type)
    ;
    /*
    typedef_method = rule(
        this.membermodifiers,
        this.membernames
    )*/
    typedef_member_dec = rule(
        this.modifiers_N,
        rule(this.varnames).yields(named("varnames")),
        /*
            ()
            x y z
            (x, y)
            (x, y) z
            x:int y:int
            (x:int, y:int)
        */
        // 
        rule(
            many(
                either(
                    rule(
                        this.context.op.lparen,
                        optional(
                            this.context.ws.space0ton,

                            rule(
                                this.modifiers_N,
                                this.context.ref.varname,
                                optional(
                                    this.context.op.infix_colon,
                                    this.typedef_type,
                                    optional(this.argumentspec)
                                ),
                            ).yields(AST.argumentdef),

                            many(
                                this.context.op.infix_comma,

                                rule(
                                    this.modifiers_N,
                                    this.context.ref.varname,
                                    optional(
                                        this.context.op.infix_colon,
                                        this.typedef_type,
                                        optional(this.argumentspec)
                                    )
                                ).yields(AST.argumentdef),
                            )

                        ),
                        this.context.op.rparen
                    ).yields(AST.tupleargumentdef),
                    rule(
                        many(
                            rule(
                                this.context.ws.space0ton,
                                this.modifiers_N,
                                this.context.ref.varname,
                                optional(
                                    this.context.op.infix_colon,
                                    this.typedef_type,
                                    optional(this.argumentspec)
                                )
                            ).yields(AST.argumentdef)
                        ),
                    )
                )
            )
        ).yields(named("vars")),
        // optional type hint
        optional(
            this.context.op.infix_colon,
            rule(this.typedef_type, optional(this.argumentspec)).yields(named("typehint"))
        ),
        // transitioner
        optional(
            this.context.op.infix_arrow,
            rule(this.context.ref.member).yields(named("transition"))
        ),
        optional(
            // getter settter blocks
            all(
                this.context.ws.space1ton,
                this.context.kwrd.with,
                either(
                    this.context.util.block(
                        "get", 
                        this.context.stmt.statement
                    ).yields(named("getter")),
                    this.context.util.block(
                        "set", 
                        this.context.stmt.statement
                    ).yields(named("setter")),
                )
            )
        )
    )
    .yields(AST.typedef_member_dec)
    ;
    typedef_member = rule(
        /*
            foo: int
            static foo: int
            static foo = 1
            () = void
            multiply x y = x * y
            multiply(x, y) = x * y // tuple
        */
        this.context.util.block(
            this.typedef_member_dec,
            rule(
                () => this.context.statements
            ).yields(named("body"))
        )
    )
    .yields(AST.typedef_member)
    ;
    typedef_basetype = rule(() => this.context.def.typedef_type)
    .yields(named("basetype"))
    ;
    typedef_stateblock = rule(
        this.context.util.block(
            rule(
                this.context.kwrd.state,
                this.context.ws.space1ton,
                rule(this.context.ref.member).yields(named("state"))
            ),
            rule(
                many(either(
                    () => this.typedef_stateblock,
                    this.typedef_member,
                    this.typedef_member_dec,
                ))
            ).yields(named("body"))
        ).yields(AST.stateblock)
    )
    ;
    typedef = rule(
        this.context.util.block(
            rule(
                either(this.context.kwrd.type, this.context.kwrd.machine), 
                this.context.ws.space1ton, 
                this.typedef_name, 
                optional(
                    this.context.ws.space1ton, 
                    this.context.kwrd.is,
                    this.context.ws.space1ton,
                    this.typedef_basetype
                )
            ),
            rule(
                many(either(
                    this.typedef_stateblock,
                    this.typedef_member,
                    this.typedef_member_dec,
                ))
            )
        )
    )
    .yields(AST.typedef)
    ;
    typedefs = rule(many(this.typedef, optional(this.context.ws.ANY_WS)))
    .yields(AST.flatcst)
    ;
}

class ParserContext {
    op: Op;
    ws: Ws;
    val: Val;
    util: Util;
    def: Def;
    stmt: Stmt;
    ref: Ref;
    ctx: Ctx;
    exp: Exp;
    kwrd: Kwrd;
    mcro: Mcro;
    
    imports: IRule;
    macros: IRule;
    types: IRule;
    statements: IRule;
    program: IRule;

    ruleRegistry:RuleReference[]
    
    constructor() {
        this.ruleRegistry = []

        this.op = new Op()
        this.mcro = new Mcro()

        this.ctx = new Ctx(this)
        this.kwrd = new Kwrd(this)

        this.ws = new Ws(this)

        this.util = new Util(this)

        this.ref = new Ref(this)
        this.val = new Val(this)

        this.exp = new Exp(this)
        this.stmt = new Stmt(this)
        this.def = new Def(this)

        this.imports = rule(
            optional(this.def.importdefs),
        )
        this.macros = rule(
            optional(this.def.macrodefs),
        )
        this.types = rule(
            optional(this.def.typedefs),
        )
        this.statements = rule(
            many(this.stmt.statement),
        )
        this.program = rule(
            this.ws.ANY_WS,
            this.imports,
            this.macros,
            this.types,
        // Compilation.statements,
        )

        // register built in rules
        this.addRuleInternal({id:"$statement",
            rule: rule(() => this.stmt.statement),
            add: (r:IRule) => {
                //
                console.log("STATEMENT INSERT")
            }
        })
        this.addRuleInternal({id:"$atom.reference",
            rule: this.ref.member, 
            add: (r:IRule) => {
                //
                console.log("ATOMREFERENCE INSERT")
            }
        })
        this.addRuleInternal({id:"$atom.range", 
            rule: this.exp.expr7infix,
            add: (r:IRule) => {
            //
                console.log("ATOMRANGE INSERT")
            }
        })
        this.addRuleInternal({id:"$atom", 
            rule: this.exp.subatom,
            add: (r:IRule) => {
            //
                console.log("ATOM INSERT")
                this.exp.atominsert.push(r)
            }
        })
    }
  
    // defs
    private macroDefs:MacroDef[] = []

    public getRuleAdder(id:string): (r:IRule) => void {
        const rule = this.ruleRegistry.find(r => r.id === id)
        if (rule) {
            return rule.add
        }
        throw new Error(`No rule exists for ${id}. If this is a macro it must be imported.`)
    }

    public getRuleRef(id:string): IRule {
        const rule = this.ruleRegistry.find(r => r.id == id)
        if (rule && rule.rule) {
            return rule.rule
        }
        throw new Error(`No rule exists for ${id}. If this is a macro it must be imported.`)
    }

    private addRuleInternal(ref:RuleReference):void {
        this.ruleRegistry.push(ref)
    }

    public addRule(ref:RuleReference):void {
        console.log("adding rule", ref)
        this.ruleRegistry.push(ref)
        const target = this.ruleRegistry.find(x => x.id == ref.targetRuleId)
        console.log("target", ref.rule)
        if (target && ref.rule) {
            target.add(ref.rule)
        }
    }

    public getSourceCode(astNode:any):string {
        if (astNode.__TYPE__) { 
            const typename = astNode.__proto__.constructor.name
            if (typename == "Statement") {
                const ops = (astNode as Statement).statement
                return ops.map(op => this.getSourceCode(op)).join("\r\n")
            }
            console.log(typename)
            if (typename == "Apply") {
                const lhs = this.getSourceCode(astNode.to)
                const rhs = this.getSourceCode(astNode.apply)
                return `${lhs} ${rhs}`
            }
            if (typename == "String") {
                return "string"
            }
            if (typename == "Reference") {
                return astNode.name.value
            }
        }
        return astNode.__proto__.constructor.name
    }

    public addMacro(macro:MacroDef):void {
        console.log("## VISIT MACRO")
        const identity = (x:MacroDef) => x.rule!.rule.map(rule => `${x.insert.value }#${this.getSourceCode(rule)}`)
        console.log(identity(macro))
        if (this.macroDefs.find(x => identity(x) === identity(macro))) {
            throw new Error(`Macro ${identity(macro)} is already registered.`)
        }

        let parts = macro.rule!.rule.map((rule:Statement) => {
            return rule.statement.map(stmt => {
                console.log(stmt)
                return stmt
            })
        })
        /*
        console.log(parts)
        this.macroDefs.push(macro)
        this.addRule({
            id: `$${macro.name}`,
            targetRuleId: macro.as,
            add: this.getRuleAdder(macro.as),
            rule: rule(...parts).yields(AST.expandmacro(macro))
        }) */
    }

    public parse(source:string, identity:string):ProgramDef {
        let program:ProgramDef = new ProgramDef()
        program.identity = identity
        parse(
            source
        )(
            this.ws.ANY_WS,
            this.program
            .yields((_:ResultTokens, cst:any) => {
                const fcst = flat(cst)
                program.imports = fcst.filter(x => x instanceof ImportDef) || []
                program.macros = fcst.filter(x => x instanceof MacroDef) || []
                program.types = fcst.filter(x => x instanceof TypeDef) || []
                // TODO program.statements = fcst.filter(x => x instanceof Statement)
            })
        )
        return program
    }
}

type RuleReference = {
    id: string
    targetRuleId?: string
    rule?: IRule
    add: (rule:IRule) => void
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