"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tibu_1 = require("tibu");
const { parse, token, rule, all, many, optional, either } = tibu_1.Tibu;
const martha_ast_1 = require("./martha.ast");
const martha_program_1 = require("./martha.program");
const martha_emit_1 = require("./martha.emit");
const flat = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
        acc.concat(flat(val)) : acc.concat(val), []);
};
class WithParserContext {
    constructor(context) {
        this.context = context;
    }
}
// helpers
const manysep = (sep, ...pattern) => {
    return optional(...pattern, many(sep, ...pattern));
};
const prettyprint = (x) => console.log(JSON.stringify(x, null, 2));
const op = (order, r2l, name, pattern) => {
    return Object.assign(token(name, pattern), { order, r2l });
};
const oneormore = (refrule) => {
    return rule(refrule, many(refrule));
};
const named = (name) => {
    return (result, cst) => {
        return { named: name, result, cst };
    };
};
class Ctx {
    constructor(context) {
        this.context = context;
        this.contexts = [];
    }
    push(ctx) {
        return (input) => {
            this.contexts.push(ctx);
            return tibu_1.Result.pass(input);
        };
    }
    pop(ctx) {
        return (input) => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                this.contexts.pop();
                return tibu_1.Result.pass(input);
            }
            return tibu_1.Result.fault(input);
        };
    }
    peek(ctx) {
        return (input) => {
            if (this.contexts && this.contexts[this.contexts.length - 1] === ctx) {
                return tibu_1.Result.pass(input);
            }
            return tibu_1.Result.fault(input);
        };
    }
    clear() {
        return (input) => {
            this.contexts = [];
            return tibu_1.Result.pass(input);
        };
    }
}
exports.Ctx = Ctx;
// const op
// let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
class Mcro {
    constructor() {
        this._let = token("let", "let");
        this._new = token("new", "new");
        this._typeof = token("typeof", "typeof");
        this._sizeof = token("sizeof", "sizeof");
        this._addrof = token("addrof", /addrof|addressof/);
        this.stateof = token("stateof", "stateof");
        this.delete = token("delete", "delete");
        this.return = token("return", "return");
        // state transition operator
        this.swapto = token("swapto", "swapto");
    }
    get macros() {
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
        ];
    }
}
exports.Mcro = Mcro;
class Op {
    constructor() {
        // binary infix
        this.assign = token("assign", "=");
        this.pluseq = token("pluseq", "+=");
        this.minuseq = token("minuseq", "-=");
        this.multeq = token("multeq", "*=");
        this.powereq = token("powereq", "**=");
        this.diveq = token("diveq", "/=");
        this.modeq = token("modeq", "%=");
        this.careteq = token("careteq", "^=");
        this.ampeq = token("ampeq", "&=");
        this.pipeeq = token("pipeeq", "|=");
        this.shleq = token("shleq", "<<=");
        this.shreq = token("shreq", ">>=");
        this.lt = token("lt", "<");
        this.lte = token("lte", "<=");
        this.gt = token("gt", ">");
        this.gte = token("gte", ">=");
        this.dot = token("dot", ".");
        this.conditionaldot = token("conditionaldot", "?.");
        this.plus = token("plus", "+");
        this.minus = token("minus", "-");
        this.div = token("div", "/");
        this.mult = token("mult", "*");
        this.mod = token("mod", "%");
        this.power = token("power", "**");
        this.range = token("range", "..");
        // prefix/suffix
        this.plusplus = token("plusplus", "++");
        this.minusminus = token("minusminus", "--");
        this.splat = token("splat", "...");
        this.infix_comma = rule(/\s*,\s*/);
        this.infix_colon = rule(/\s*\:\s*/);
        this.lsquare = token("lsquare", "[");
        this.rsquare = token("rsquare", "]");
        this.lcurly = token("lcurly", "{");
        this.rcurly = token("rcurly", "}");
        this.langle = token("langle", "<");
        this.rangle = token("rangle", ">");
        this.lparen = token("lparen", "(");
        this.rparen = token("rparen", ")");
        this.arrow = token("arrow", "->");
        this.exc = token("exc", "!");
        this.tilde = token("tilde", "~");
        this.amp = token("amp", "&");
        this.caret = token("caret", "^");
        this.pipe = token("pipe", "|");
        this.ampamp = token("ampamp", "&&");
        this.pipepipe = token("pipepipe", "||");
        this.eqeq = token("eq", "==");
        this.noteq = token("eq", "!=");
        this.shiftleft = token("shiftleft", "<<");
        this.shiftright = token("shiftright", ">>");
    }
    /**
     * token producer: binary operators
     */
    get anybinary() {
        return either(this.assign, this.pluseq, this.lt, this.lte, this.gt, this.gte, this.dot, this.plus, this.minus, this.div, this.mult, this.mod);
    }
    get anyprefix() {
        return either(this.plusplus, this.minusminus);
    }
    get anypostfix() {
        return either(this.plusplus, this.minusminus);
    }
    /**
     * 0. left to right
     */
    get postfixOperators() {
        return [
            // lparen,rparen,lsquare,rsquare
            // Op.arrow,
            // Op.dot,
            // Op.conditionaldot,
            this.plusplus,
            this.minusminus,
        ];
    }
    /**
     * right to left
     */
    get sorted1_prefix() {
        return [
            this.plusplus,
            this.minusminus,
            this.plus,
            this.minus,
            this.exc,
            this.tilde,
            this.splat,
        ];
    }
    /**
     * left to right
     */
    get sorted2_binary() {
        return [
            this.dot,
            this.power,
            this.mult,
            this.div,
            this.mod,
        ];
    }
    /**
     * left to right
     */
    get sorted3_binary() {
        return [
            this.plus,
            this.minus,
        ];
    }
    /**
     * left to right
     */
    get sorted4_binary() {
        return [
            this.shiftleft,
            this.shiftright,
        ];
    }
    /**
     * left to right
     */
    get sorted5_binary() {
        return [
            this.lt,
            this.lte,
            this.gt,
            this.gte,
        ];
    }
    /**
     * left to right
     */
    get sorted6_binary() {
        return [
            this.eqeq,
            this.noteq,
        ];
    }
    /**
     * left to right (precedence implied)
     */
    get sorted7_binary() {
        return [
            this.ampamp,
            this.amp,
            this.caret,
            this.pipepipe,
            this.pipe,
            this.range,
        ];
    }
    /**
     * right to left
     */
    get sorted9_binary() {
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
        ];
    }
    get sortedA_binary() {
        return [
            this.infix_comma
        ];
    }
}
exports.Op = Op;
class Val extends WithParserContext {
    constructor(context) {
        super(context);
        this.bool = token("bool", /true|false/);
        this.integer = token("integer", /[\d]+/);
        this.str = token("string", /"[^"]*"|'[^']*'/);
    }
    get anyliteral() {
        return either(this.bool, this.integer, this.str);
    }
}
exports.Val = Val;
class Kwrd {
    constructor(context) {
        // access
        this.public = token("public", /public/);
        this.private = token("private", /private/);
        this.internal = token("internal", /internal/);
        this.protected = token("protected", /protected/);
        this.export = token("export", "export");
        this.extern = token("extern", "extern");
        this.abstract = token("abstract", "abstract");
        this.async = token("async", /async/);
        this.atomic = token("atomic", /atomic/);
        this.critical = token("critical", /critical/);
        this.static = token("static", /static/);
        this.ctor = token("ctor", /constructor/);
        this.macro = "macro";
        this.when = "when";
        this.use = "use";
        this.type = "type";
        this.interface = "interface";
        this.is = "is";
        this.as = "as";
        this.with = "with";
        this.import = "import";
        this.context = context;
    }
    get anyaccess() {
        return either(this.public, this.private, this.internal, this.protected);
    }
}
exports.Kwrd = Kwrd;
class Ref extends WithParserContext {
    constructor(context) {
        super(context);
        // members and variables
        this._member = token("member", /[a-z_\$\@][a-z0-9\$\@]*/i);
        this.varname = token("varname", /[a-z_\$\@][a-z0-9\$\@]*/i);
        this.member = rule(this._member, many(this.context.op.dot, this._member))
            .yields(martha_ast_1.AST.reference);
        this.typename = token("typename", /[a-z_\$\@][a-z0-9\$\@]*/i);
    }
}
exports.Ref = Ref;
class Ws extends WithParserContext {
    constructor(context) {
        super(context);
        this.space0ton = /[ \t]*/;
        this.space1ton = /[ \t]+/;
        this.newline = /\r\n|\r|\n\r|\n/;
        this.indent = token("indent", /^[ \t]+/);
        this.emptyline = rule(/\s*$/, this.newline);
        this.emptylines = rule(many(this.emptyline));
        this.IND = rule(this.newline, this.indent).yields(function (result) {
            this._indent = result.tokens[0].result.value;
        });
        this.getIndent = (input) => {
            let index = input.source.substring(input.location).indexOf(this.IND._indent);
            if (index === 0) {
                input.location += this.IND._indent.length;
                return tibu_1.Result.pass(input);
            }
            return tibu_1.Result.fault(input);
        };
        this.IND_WS = rule(this.space0ton, optional(this.IND));
        this.ANY_WS = rule(/[\t\r\n\s]*/);
        this.lr0ton = (token) => rule(this.space0ton, token, this.space0ton);
    }
}
exports.Ws = Ws;
class Util extends WithParserContext {
    constructor(context) {
        super(context);
        this.indents = [];
        this.pushIndent = rule(this.context.ws.space0ton, this.context.ws.newline, this.context.ws.indent).yields((r) => {
            console.log(r.one("indent").length);
            this.indents.push(r.one("indent"));
        });
        this.peekIndent = rule(this.context.ws.newline, (input) => {
            let index = input.source.substring(input.location).indexOf(this.indents[this.indents.length - 1]);
            if (index === 0) {
                input.location += this.indents[this.indents.length - 1].length;
                return tibu_1.Result.pass(input);
            }
            return tibu_1.Result.fault(input);
        });
        this.popIndent = rule((input) => {
            this.indents.pop();
            return tibu_1.Result.pass(input);
        });
        this.EOF = rule((input) => input.location === input.source.length ?
            tibu_1.Result.pass(input) : tibu_1.Result.fault(input));
        this.block = (begin, repeat) => rule(begin, /[ \t]*:[ \t]*/, either(all(this.pushIndent, repeat, many(this.peekIndent, repeat), this.popIndent), all(repeat, /\s*/), all(repeat, this.EOF), all(optional(/\s*/), this.EOF)));
    }
}
exports.Util = Util;
class Exp extends WithParserContext {
    constructor(context) {
        super(context);
        this.atomliteral = rule(this.context.val.anyliteral)
            .yields(martha_ast_1.AST.atomliteral);
        this.atomlambdaliteral = rule(rule(either(all("(", () => this.context.def.argumentdefs, ")"), all("(", optional(this.context.ref._member, many(this.context.op.infix_comma, this.context.ref._member)), ")"), () => this.context.def.argumentdef, this.context.ref._member)).yields(named("spec")), this.context.ws.lr0ton("=>"), rule(() => this.context.stmt.statement).yields(named("body")))
            .yields(martha_ast_1.AST.atomlambdaliteral);
        this.atommember = rule(this.context.ref.member)
            .yields(martha_ast_1.AST.atommember);
        /**
         * MACRO INSERTION
         */
        this.atominsert = [];
        /**
         * cst producer
         */
        this.subatom = rule(either(
        /**/
        (input) => {
            //console.log("looking for insert", this.atominsert.length)
            if (this.atominsert.length)
                return rule(either(...this.atominsert));
            else
                return tibu_1.Result.fault(input);
        }, this.atomlambdaliteral, oneormore(rule("(", optional(() => this.exprAinfix), ")").yields(martha_ast_1.AST.bracketparen)), oneormore(rule(/[ \t]*\{/, many(this.context.ws.ANY_WS, () => this.exprAinfix, this.context.ws.ANY_WS), /[ \t]*\}/).yields(martha_ast_1.AST.bracketcurly)), oneormore(rule("[", optional(() => this.exprAinfix), "]").yields(martha_ast_1.AST.bracketarray)), this.atomliteral, this.atommember));
        this.atom = rule(either(rule(this.subatom, many(this.context.ws.space0ton, this.subatom)), rule(this.context.ctx.peek("spec")).yields(martha_ast_1.AST.thisref)))
            .yields(martha_ast_1.AST.atom);
        /**
         * cst producer
         */
        this.expr0postfix = rule(this.atom, many(either(...this.context.op.postfixOperators))).yields(martha_ast_1.AST.postfixexpr);
        this.expr1prefix = rule(many(either(...this.context.op.sorted1_prefix)), this.expr0postfix).yields(martha_ast_1.AST.prefixexpr);
        this.expr2infix = rule(this.expr1prefix, many(this.context.ws.lr0ton(either(...this.context.op.sorted2_binary)), this.expr1prefix)).yields(martha_ast_1.AST.binaryexpr);
        this.expr3infix = rule(this.expr2infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted3_binary)), this.expr2infix)).yields(martha_ast_1.AST.binaryexpr);
        this.expr4infix = rule(this.expr3infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted4_binary)), this.expr3infix)).yields(martha_ast_1.AST.binaryexpr);
        this.expr5infix = rule(this.expr4infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted5_binary)), this.expr4infix)).yields(martha_ast_1.AST.binaryexpr);
        this.expr6infix = rule(this.expr5infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted6_binary)), this.expr5infix)).yields(martha_ast_1.AST.binaryexpr);
        this.expr7infix = rule(this.expr6infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted7_binary)), this.expr6infix)).yields(martha_ast_1.AST.binaryexpr);
        this.expr9infix = rule(this.expr7infix, many(this.context.ws.lr0ton(either(...this.context.op.sorted9_binary)), this.expr7infix)).yields(martha_ast_1.AST.binaryexpr);
        this.exprAinfix = rule(this.expr9infix, many(this.context.ws.lr0ton(either(...this.context.op.sortedA_binary)), this.expr9infix)).yields(martha_ast_1.AST.commaexpr);
    }
}
exports.Exp = Exp;
class Stmt extends WithParserContext {
    constructor(context) {
        super(context);
        this.statement = rule(either(
        // rule(either(...Mcro.macros), Ws.space0ton, () => Stmt.statement).yields(AST.call),
        // rule(this.context.exp.exprAinfix, "(", () => Stmt.statement, ")").yields(AST.calluser),
        // rule(this.context.exp.exprAinfix, Ws.space1ton, () => Stmt.statement).yields(AST.calluser),
        many(this.context.exp.exprAinfix, optional(this.context.ctx.clear()))))
            .yields(martha_ast_1.AST.statement);
        this.macrospecification = rule(token("insert", /\$\w+/), this.context.ws.lr0ton("("), many(either(rule(this.context.ws.lr0ton(token("rulereference", /\$[a-z0-9\.]+/i))), //.yields(named("reference"))),
        rule(this.context.ws.lr0ton(token("ruleword", /\w+/))) //.yields(named("word")))
        )), this.context.ws.lr0ton(")"));
    }
}
exports.Stmt = Stmt;
class Def extends WithParserContext {
    constructor(context) {
        super(context);
        this.argumentspec = rule("{", this.context.ctx.push("spec"), this.context.stmt.statement, "}" //, this.context.ctx.pop("spec")
        )
            .yields(martha_ast_1.AST.argumentsspec);
        this.argumentdef = rule(optional(this.context.op.splat), this.context.ws.lr0ton(this.context.ref.typename), many(this.context.ws.lr0ton(this.context.ref.typename)), ":", this.context.ws.lr0ton(this.context.ref.varname), optional(this.argumentspec))
            .yields(martha_ast_1.AST.argumentdef);
        this.returndef = rule(this.context.ref.typename, optional(this.argumentspec))
            .yields(martha_ast_1.AST.returndef);
        this.argumentdefs = rule(this.argumentdef, many(this.context.op.infix_comma, this.argumentdef))
            .yields(martha_ast_1.AST.argumentdefs);
        this.methoddef = rule(this.context.util.block(all(optional(rule(this.context.kwrd.anyaccess, many(this.context.ws.space1ton, this.context.kwrd.anyaccess), this.context.ws.space1ton).yields(martha_ast_1.AST.anyaccess)), optional(this.context.kwrd.abstract, this.context.ws.space1ton), optional(this.context.kwrd.export, this.context.ws.space1ton), optional(this.context.kwrd.extern, this.context.ws.space1ton), optional(this.context.kwrd.static, this.context.ws.space1ton), optional(this.context.kwrd.async, this.context.ws.space1ton), optional(this.context.kwrd.atomic, this.context.ws.space1ton), optional(this.context.kwrd.critical, this.context.ws.space1ton), either(all(this.returndef, this.context.ws.space1ton, token("name", /\w+/)), this.context.kwrd.ctor), optional(this.context.ws.lr0ton(this.context.op.lparen), optional(this.argumentdefs), this.context.ws.lr0ton(this.context.op.rparen))), this.context.stmt.statement))
            .yields(martha_ast_1.AST.methoddef);
        this.methoddec = rule(optional(rule(this.context.kwrd.anyaccess, many(this.context.ws.space1ton, this.context.kwrd.anyaccess), this.context.ws.space1ton).yields(martha_ast_1.AST.anyaccess)), optional(this.context.kwrd.export, this.context.ws.space1ton), optional(this.context.kwrd.extern, this.context.ws.space1ton), optional(this.context.kwrd.static, this.context.ws.space1ton), optional(this.context.kwrd.async, this.context.ws.space1ton), optional(this.context.kwrd.atomic, this.context.ws.space1ton), optional(this.context.kwrd.critical, this.context.ws.space1ton), either(all(this.returndef, this.context.ws.space1ton, token("name", /\w+/)), this.context.kwrd.ctor), optional(this.context.ws.lr0ton(this.context.op.lparen), optional(this.argumentdefs), this.context.ws.lr0ton(this.context.op.rparen)));
        this.macrodef = rule(rule(this.context.util.block(this.context.kwrd.macro, either(this.context.ref._member, this.context.val.str))).yields(named("macro")), rule(this.context.util.block(rule(this.context.kwrd.as, this.context.ws.space1ton, this.context.stmt.macrospecification), this.context.stmt.statement)).yields(named("as")))
            .yields(martha_ast_1.AST.macrodef);
        this.macrodefs = rule(many(this.macrodef, optional(this.context.ws.ANY_WS)))
            .yields(martha_ast_1.AST.flatcst);
        this.membernames = rule(this.context.ref.member, many(optional(this.context.op.infix_comma, this.context.ref.member)))
            .yields((result, cst) => {
            return flat(cst);
        });
        this.importdef = rule(this.context.kwrd.import, this.context.ws.space1ton, this.context.ref.member)
            .yields(martha_ast_1.AST.importdef);
        this.importdefs = rule(many(this.importdef, optional(this.context.ws.ANY_WS)))
            .yields(martha_ast_1.AST.flatcst);
        this.typedef_name = rule(this.context.ref.typename, many(this.context.op.infix_comma, this.context.ref.typename))
            .yields(martha_ast_1.AST.typedef_name);
        this.typedef_type = rule(this.context.ref.typename, many(this.context.ws.lr0ton(this.context.ref.typename)), 
        // TODO: generic
        // indexer
        optional(this.context.op.lsquare, optional(either(() => this.typedef_type, all(this.context.ref.typename, many(this.context.ws.lr0ton(this.context.ref.typename))))), this.context.op.rsquare));
        this.typedef_member = rule(this.typedef_type, this.context.op.infix_colon, this.membernames, optional(this.context.ws.lr0ton(this.context.op.assign), this.context.exp.subatom))
            .yields(martha_ast_1.AST.typedef_member);
        this.typedef_basetype = rule(this.context.ref.typename)
            .yields(martha_ast_1.AST.typedef_basetype);
        this.typedef = rule(this.context.util.block(rule(this.context.kwrd.type, this.context.ws.space1ton, this.typedef_name), rule(optional(this.context.util.block(this.context.kwrd.is, this.typedef_basetype)), many(this.typedef_member), many(this.methoddef))))
            .yields(martha_ast_1.AST.typedef);
        this.typedefs = rule(many(this.typedef, optional(this.context.ws.ANY_WS)))
            .yields(martha_ast_1.AST.flatcst);
    }
}
exports.Def = Def;
class ParserContext {
    constructor() {
        // defs
        this.macroDefs = [];
        this.ruleRegistry = [];
        this.op = new Op();
        this.mcro = new Mcro();
        this.ctx = new Ctx(this);
        this.kwrd = new Kwrd(this);
        this.ws = new Ws(this);
        this.util = new Util(this);
        this.ref = new Ref(this);
        this.val = new Val(this);
        this.exp = new Exp(this);
        this.stmt = new Stmt(this);
        this.def = new Def(this);
        this.imports = rule(optional(this.def.importdefs));
        this.macros = rule(optional(this.def.macrodefs));
        this.types = rule(optional(this.def.typedefs));
        this.statements = rule(many(this.stmt.statement));
        this.program = rule(this.ws.ANY_WS, this.imports, this.macros, this.types);
        // register built in rules
        this.addRuleInternal({ id: "$statement",
            rule: rule(() => this.stmt.statement),
            add: (r) => {
                //
                console.log("STATEMENT INSERT");
            }
        });
        this.addRuleInternal({ id: "$atom.reference",
            rule: this.ref.member,
            add: (r) => {
                //
                console.log("ATOMREFERENCE INSERT");
            }
        });
        this.addRuleInternal({ id: "$atom.range",
            rule: this.exp.expr7infix,
            add: (r) => {
                //
                console.log("ATOMRANGE INSERT");
            }
        });
        this.addRuleInternal({ id: "$atom",
            rule: this.exp.subatom,
            add: (r) => {
                //
                console.log("ATOM INSERT");
                this.exp.atominsert.push(r);
            }
        });
    }
    getRuleAdder(id) {
        const rule = this.ruleRegistry.find(r => r.id === id);
        if (rule) {
            return rule.add;
        }
        throw new Error(`No rule exists for ${id}. If this is a macro it must be imported.`);
    }
    getRuleRef(id) {
        const rule = this.ruleRegistry.find(r => r.id == id);
        if (rule && rule.rule) {
            return rule.rule;
        }
        throw new Error(`No rule exists for ${id}. If this is a macro it must be imported.`);
    }
    addRuleInternal(ref) {
        this.ruleRegistry.push(ref);
    }
    addRule(ref) {
        console.log("adding rule", ref);
        this.ruleRegistry.push(ref);
        const target = this.ruleRegistry.find(x => x.id == ref.targetRuleId);
        console.log("target", ref.rule);
        if (target && ref.rule) {
            target.add(ref.rule);
        }
    }
    addMacro(macro) {
        console.log("## VISIT MACRO");
        const identity = (x) => x.name;
        if (this.macroDefs.find(x => identity(x) === identity(macro))) {
            throw new Error(`Macro ${identity(macro)} is already registered.`);
        }
        let parts = macro.rule.map((t) => {
            if (t.startsWith("$")) {
                return this.getRuleRef(t);
            }
            else {
                return this.ws.lr0ton(token(t, t));
            }
        });
        console.log(parts);
        this.macroDefs.push(macro);
        this.addRule({
            id: `$${macro.name}`,
            targetRuleId: macro.as,
            add: this.getRuleAdder(macro.as),
            rule: rule(...parts).yields(martha_ast_1.AST.expandmacro(macro))
        });
    }
    parse(source) {
        let program = new martha_program_1.ProgramDef();
        parse(source)(this.ws.ANY_WS, this.program
            .yields((_, cst) => {
            const fcst = flat(cst);
            program.imports = fcst.filter(x => x instanceof martha_emit_1.ImportDef) || [];
            program.macros = fcst.filter(x => x instanceof martha_emit_1.MacroDef) || [];
            program.types = fcst.filter(x => x instanceof martha_emit_1.TypeDef) || [];
            // TODO program.statements = fcst.filter(x => x instanceof Statement)
        }));
        return program;
    }
}
exports.ParserContext = ParserContext;
//# sourceMappingURL=martha.grammar.js.map