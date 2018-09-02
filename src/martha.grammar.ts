import { Tibu, Result, ResultTokens, Input, IRule, IToken, Pattern } from "tibu";
const { parse, token, rule, all, many, optional, either } = Tibu;

import { AST } from "./martha.ast";
import { ProgramDef } from "./martha.program";
import { ImportDef, MacroDef, TypeDef } from "./martha.emit";

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}


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
    push(ctx:any): (input:Input) => Result {
        return (input:Input):Result => {
            this.contexts.push(ctx)
            return Result.pass(input)
        }
    }
    pop(ctx:any): (input:Input) => Result {
        return (input:Input):Result => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                this.contexts.pop()
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
    peek(ctx:any): (input:Input) => Result {
        return (input:Input):Result => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                return Result.pass(input)
            }
            return Result.fault(input)
        }
    }
    clear(): (input:Input) => Result {
        return (input:Input):Result => {
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
    str          = token("string", /"[^"]+"|'[^']+'/);

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
class Ref extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    // members and variables
    _member      = token("member", /[a-z_\$\@][a-z0-9\$\@]*/i);
    varname      = token("varname", /[a-z_\$\@][a-z0-9\$\@]*/i);
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
    lr0ton       = (token:Pattern) => rule(this.space0ton, token, this.space0ton) 
}
class Util extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    indents:string[] = [];
    pushIndent       = rule(this.context.ws.space0ton, this.context.ws.newline, this.context.ws.indent).yields((r:ResultTokens) => {
        this.indents.push(r.tokens[0].result.value);
    });
    peekIndent       = rule(this.context.ws.newline, (input:Input):Result => {
        let index:number = input.source.substring(input.location).indexOf(this.indents[this.indents.length - 1]);
        if (index === 0) {
            input.location += this.indents[this.indents.length - 1].length;
            return Result.pass(input);
        }
        return Result.fault(input);
    });
    popIndent        = rule(this.context.ws.newline, (input:Input):Result => {
        this.indents.pop();
        return Result.pass(input);
    });
    EOF              = rule((input:Input):Result => input.location === input.source.length ?
                                    Result.pass(input) : Result.fault(input));
    block            = (begin:Pattern, repeat:Pattern) => rule(
        begin, /[ \t]*:[ \t]*/,
        either(
            all(this.pushIndent, many(repeat, either(this.peekIndent, this.popIndent, this.EOF))),
            all(repeat, /\s*/),
            all(repeat, this.EOF),
            all(this.EOF),
        )
    )
}
class Exp extends WithParserContext {
    constructor(context:ParserContext) {
        super(context)
    }
    atomliteral          = rule(this.context.val.anyliteral)
    .yields(AST.atomliteral)
    ;    
    atomlambdaliteral    = rule(
        rule(either(
            //all("(", () => this.context.def.argumentdefs, ")",),
            //() => this.context.def.argumentdef,
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
        (input:Input) => {
            //console.log("looking for insert", this.atominsert.length)
            if (this.atominsert.length)
                return rule(either(...this.atominsert))
            else
                return Result.fault(input)
        },  
        this.atomlambdaliteral,
        oneormore(rule("(", optional(() => this.exprAinfix), ")").yields(AST.bracketparen)),
        oneormore(rule(
            /\s*\{/, 
            many(
                this.context.ws.ANY_WS,
                () => this.exprAinfix,
                this.context.ws.ANY_WS
            ),
            /\s*\}/
        ).yields(AST.bracketcurly)),
        oneormore(rule("[", () => this.exprAinfix, "]").yields(AST.bracketarray)),
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
    expr6infix           = rule(
                                    this.expr5infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted6_binary)), this.expr5infix)
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
    argumentspec = rule(
            "{", this.context.ctx.push("spec"), this.context.stmt.statement, "}"//, this.context.ctx.pop("spec")
    )
    .yields(AST.argumentsspec)
    ;
    argumentdef = rule(this.context.ws.lr0ton(this.context.ref.typename), ":", this.context.ws.lr0ton(this.context.ref.varname), optional(this.argumentspec))
    .yields(AST.argumentdef)
    ;
    returndef = rule(this.context.ref.typename, optional(this.argumentspec))
    .yields(AST.returndef)
    ;
    argumentdefs = rule(this.argumentdef, many(this.context.op.infix_comma, this.argumentdef))
    .yields(AST.argumentdefs)
    ;
    methoddef = rule(
        this.context.util.block(
            all(
                optional(rule(this.context.kwrd.anyaccess, many(this.context.ws.space1ton, this.context.kwrd.anyaccess), this.context.ws.space1ton).yields(AST.anyaccess)),
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
                ),
            ), 
            many(this.context.stmt.statement))
    )
    .yields(AST.methoddef)
    ;

    macrodef = rule(
        rule(this.context.util.block(this.context.kwrd.macro, either(this.context.ref._member, this.context.val.str))).yields(named("macro")),
        rule(this.context.util.block(
            rule(
                this.context.kwrd.as,
                this.context.ws.space1ton,                
                this.context.stmt.macrospecification
            ), 
            this.context.stmt.statement)
        ).yields(named("as")),
    )
    .yields(AST.macrodef)
    ;
    macrodefs = rule(
        many(this.macrodef, optional(this.context.ws.ANY_WS))
    )
    .yields(AST.flatcst)
    ;

    membernames = rule(this.context.ref.member, many(optional(this.context.op.infix_comma, this.context.ref.member)))
    .yields((result:ResultTokens, cst:any) => {
        return flat(cst);
    });

    importdef = rule(this.context.kwrd.import, this.context.ws.space1ton, this.context.ref.member)
    .yields(AST.importdef)
    ;
    importdefs = rule(many(this.importdef, optional(this.context.ws.ANY_WS)))
    .yields(AST.flatcst)
    ;

    typedef_name = rule(this.context.ref.typename, many(this.context.op.infix_comma, this.context.ref.typename))
    .yields(AST.typedef_name)
    ;
    typedef_member = rule(this.context.ref.typename, this.context.op.infix_colon, this.membernames)
    .yields(AST.typedef_member)
    ;
    typedef_basetype = rule(this.context.ref.typename)
    .yields(AST.typedef_basetype)
    ;
    typedef = rule(
        this.context.util.block(this.context.kwrd.type, this.typedef_name),
        optional(this.context.util.block(this.context.kwrd.is, this.typedef_basetype)),
        optional(this.context.util.block(this.context.kwrd.with, this.typedef_member)),
        many(this.methoddef)
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

    public addMacro(macro:MacroDef):void {
        console.log("## VISIT MACRO")
        const identity = (x:MacroDef) => x.name
        if (this.macroDefs.find(x => identity(x) === identity(macro))) {
            throw new Error(`Macro ${identity(macro)} is already registered.`)
        }
        let parts = macro.rule.map((t:string) => {
            if (t.startsWith("$")) {
                return this.getRuleRef(t)
            } else {
                return this.ws.lr0ton(token(t, t))
            }
        })
        console.log(parts)
        this.macroDefs.push(macro)
        this.addRule({
            id: `$${macro.name}`,
            targetRuleId: macro.as,
            add: this.getRuleAdder(macro.as),
            rule: rule(...parts).yields(AST.expandmacro(macro))
        })
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