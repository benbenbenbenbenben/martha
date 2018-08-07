class ResultTokens {
    tokens:{name:string, result:Result}[];
    constructor() {
        this.tokens = [];
    }
    push(name:string, result:Result):number {
        this.tokens.push({name, result});
        return this.tokens.length;
    }
    dropafter(end:number): void {
        while (this.tokens.length > 0) {
            let temp:any = this.tokens.pop();
            if (temp.result.endloc > end) {
                continue;
            } else {
                this.tokens.push(temp);
                break;
            }
        }
    }
    one(name:string):string | any {
        const target:{name:string, result:Result}[] = this.tokens.filter(t => t.name === name);
        if (target.length > 0) {
            return target[0].result.value;
        } else {
            return null;
        }
    }
}
class Result {
    public success:boolean = false;
    public startloc:number = 0;
    public endloc:number = 0;
    public value:string = "";
    public children:Result[] = [];
    public static fault(input:Input):Result {
        return {
            success: false,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: []
        };
    }
    public static pass(input:Input):Result {
        return {
            success: true,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: []
        };
    }
    public static composite(...results:Result[]):Result {
        let result:Result = new Result();
        result.success = results.map(r => r.success).reduce((p, c) => p && c);
        result.children = results;
        result.startloc = results[0].startloc;
        result.endloc = results[results.length - 1].endloc;
        return result;
    }
}

class Input {
    source:string;
    location:number;
    state:any;
    tokens:ResultTokens = new ResultTokens();
    tokenyielders:any[] = [];
    constructor(source:string) {
        this.source = source;
        this.location = 0;
        this.state = 0;
    }
    indexOf(pattern:string | RegExp):number|any {
        if (typeof(pattern) === "string") {
            return this.source.substr(this.location).indexOf(pattern);
        } else {
            const r:any = pattern.exec(this.source.substr(this.location));
            if (r === null) {
                return { index: -1 };
            }
            return { value: r[0], index:r.index, length:r[0].length };
        }
    }
    begin(tokens:ResultTokens):number {
        this.tokens = tokens;
        this.tokenyielders = [];
        return this.location;
    }
    end():void {
        // do nothing
    }
    rewind(loc:number):void {
        this.location = loc;
        this.tokens.dropafter(loc);
    }
    consume(predicate:Function | any):Result {
        const startloc:number = this.location;
        const result:Result = predicate(this);
        let output:Result =  Result.fault(this);
        if (result.success === false) {
            this.location = startloc;
        } else {
            this.location = result.endloc;
            if (predicate.__token__) {
                this.yieldtoken(predicate.__token__, result);
            }
            output = result;
        }
        return output;
    }
    yieldtoken(name:string, result:Result):void {
        this.tokens.push(name, result);
    }
}
const parse:Function = (source:string) => (...rules:any[]):any => {
    // each rule is a predicate[]
    let input:Input = new Input(source);
    for (let rule of rules) {
        if (parserule(input, rule) === false) {
            break;
        }
    }
};

const parserule:Function = (input:Input, rule:any):any => {
    if (rule.breakonentry) {
        // tslint:disable-next-line:no-debugger
        debugger;
    }
    let tokens:ResultTokens = new ResultTokens();
    let ref:number = input.begin(tokens);
    let x:any;
    let matches:Result[] = [];
    for (let predicate of rule) {
        x = input.consume(predicate);
        matches.push(x);
        if (x.success === false) {
            break;
        }
    }
    if (x.success === false) {
        input.rewind(ref);
        return false;
    }
    // console.log(JSON.stringify(matches, null, 2));
    input.end();
    if (rule.yielder) {
        rule.yielder(tokens);
    }
    return true;
    // rule(...matches);
};

const rule:Function = (...patterns:any[]):any => {
    let predicates:any = ensurePredicates(...patterns);
    predicates.__rule__ = true;
    predicates.yields = (handler:Function):any => {
        predicates.yielder = handler;
        return predicates;
    };
    // this is not ideal
    predicates.append = (...patterns:any[]):any => {
        let newpredicates:any = ensurePredicates(...patterns);
        for (var newpredicate of newpredicates) {
            predicates.push(newpredicate);
        }
        return predicates;
    };
    //
    return predicates;
};

const debugrule:Function = (...patterns:any[]):any => {
    let thisrule:any = rule(...patterns);
    thisrule.breakonentry = true;
    return thisrule;
};

const all:Function = (...patterns:any[]):(input:Input) => Result => {
    return (input:Input):Result => {
        let location:number = input.location;
        let consumed:Result[] = [];
        let fault:boolean = false;
        for (let pattern of ensurePredicates(...patterns)) {
            const nxt:Result = input.consume(pattern);
            if (nxt.success) {
                consumed.push(nxt);
            } else {
                input.rewind(location);
                // input.unconsume(...consumed);
                fault = true;
                break;
            }
        }
        if (fault) {
            return Result.fault(input);
        } else {
            return Result.composite(...consumed);
        }
    };
};

const optional:Function = (...patterns:any[]):(input:Input) => Result => {
    return (input:Input):Result => {
        let outcome:Result = all(...patterns)(input);
        if (outcome.success) {
            return outcome;
        } else {
            return Result.pass(input);
        }
    };
};

const either:Function = (...patterns:any[]):(input:Input) => Result => {
    return (input:Input):Result => {
        let outcome:Result = Result.fault(input);
        for (let pattern of ensurePredicates(...patterns)) {
            let current:Result = input.consume(pattern);
            if (current.success) {
                outcome = current;
                break;
            }
        }
        return outcome;
    };
};

const many:Function = (...patterns:any[]):(input:Input) => Result => {
    return (input:Input):Result => {
        let location:number;
        let consumed:Result[] = [];
        let current:Result;
        let nothingleft:boolean = false;
        while (true) {
            location = input.location;
            current = all(...patterns)(input);
            if (current.success) {
                consumed.push(current);
            } else {
                nothingleft = true;
            }
            // stalled
            if (input.location === location || nothingleft) {
                break;
            }
        }
        if (consumed.length === 0) {
            consumed = [Result.pass(input)];
        }
        return Result.composite(...consumed);
    };
};

const ensurePredicates:Function = (...patterns:any[]):Function[] => {
    return patterns.map(pattern => {
        let predicate:any = null;
        switch(pattern.__proto__.constructor.name) {
            case "String":
            predicate = (input:Input):Result => {
                const ix:number = input.indexOf(pattern);
                const success:boolean = ix === 0;
                const startloc:number = input.location;
                const endloc:number = input.location + pattern.length;
                return {
                    success,
                    startloc,
                    endloc,
                    value: pattern,
                    children: []
                };
            };
            predicate.toString = () => {
                return "string:" + pattern;
            };
            return predicate;
            case "RegExp":
            predicate = (input:Input):Result => {
                const rxix:any = input.indexOf(pattern);
                const success:boolean = rxix.index === 0;
                const startloc:number = input.location;
                const endloc:number = input.location + rxix.length;
                return {
                    success,
                    startloc,
                    endloc,
                    value: rxix.value,
                    children: []
                };
            };
            predicate.toString = () => {
                return "regex:" + pattern.toString();
            };
            return predicate;
            case "Function":
            return pattern;
            // subrule case, trampoline time!
            case "Array":
            return (input:Input):Result => {
                if (pattern.breakonentry) {
                    // tslint:disable-next-line:no-debugger
                    debugger;
                }
                if (pattern.yielder) {
                    const frozentokens:ResultTokens = input.tokens;
                    input.tokens = new ResultTokens();
                    const result:any = all(...pattern)(input);
                    if (result.success) {
                        pattern.yielder(input.tokens);
                    }
                    input.tokens = frozentokens;
                    return result;
                } else {
                    return all(...pattern)(input);
                }
            };
            default:
            throw new Error("oops");
        }
    });
};

let _:any = null;

let maketype:Function = (s:string) => {
    console.log(s);
};

const token:Function = (name:string, pattern:any):any => {
    pattern = ensurePredicates(pattern);
    pattern[0].__token__ = name;
    return pattern[0];
};

let prettyprint:any = (x:any) => console.log(JSON.stringify(x, null, 2));


const spaces:RegExp = /[ \t]*/;
const newline:RegExp = /\r\n|\r|\n/;
const indent:any = token("indent", /^[ \t]+/);

let _INDENT:string = "";

let IND:any = rule(newline, indent).yields((x:any) => {
    _INDENT = x.tokens[0].result.value;
});
let getIndent:any = (input:Input):Result => {
    let index:number = input.source.substring(input.location).indexOf(_INDENT);
    if (index === 0) {
        input.location += _INDENT.length;
        return Result.pass(input);
    }
    return Result.fault(input);
};

let lit_or_name:RegExp = /[a-z0-9][a-z0-9_\.]*/i;

let IND_WS:any = rule(spaces, optional(IND));
let ANY_WS:any = rule(/[\t\r\n\s]*/);
let infix_comma:any = rule(/\s*,\s*/);

let type:any = token("typename", /\w+/);
let types:any = rule(type, many(optional(infix_comma, type)));
let base:any = token("basetypename", /\w+/);

let membername:any = token("membername", /\w+/);
let membernames:any = rule(membername, many(optional(infix_comma, membername)));

let startstate:any = token("startstate", /\w+/);
let statename:any = token("statename", /\w+/);

let arg:any = rule(token("arg", lit_or_name));
let args:any = rule(arg, many(infix_comma, arg));

let type_arg:any = rule(token("arg_t", lit_or_name), ":", token("arg_n", lit_or_name));
let type_args:any = rule(type_arg, many(infix_comma, type_arg));

let op:any = rule(spaces, token("op", /\=|\+\=|\-\=|and|or|not|xor/), spaces);
let expr_assign:any = rule(token("lhs", /\w+/), op, token("rhs", /\w+/))
    .yields((y:any) => {
        return {
            op: "binaryoperator",
            parameters: [
                y.one("op"),
                y.one("lhs"),
                y.one("rhs")
            ]
        };
    });
let expr_call:any = rule(token("method", /\w+/), "(", either(type_args, args), ")", ":")
    .yields((y:any) => {
        return {
            op: "methodcall",
            parameters: [
                y.one("method")
            ]
        };
    });
let expr_op:any = rule(op, token("rhs", /\w+/))
    .yields((y:any) => {
        return {
            op: "prefixoperator",
            parameters: [
                y.one("op"),
                y.one("rhs")
            ]
        };
    });

let stmt_expression:any = rule(either(expr_assign, expr_call, expr_op));
let stmt_case:any = rule(IND_WS, token("case", /case/), spaces, stmt_expression, ":", /*statements*/)
    .yields((y:any) => {
        console.log(y);
    });
let stmts_case:any = rule(many(stmt_case))
    .yields((y:any) => {
        console.log(y);
    });
let stmt_switch:any = rule("switch", spaces, token("switchinput", lit_or_name), ":", stmts_case);
let statements:any = rule(either(stmt_switch));
// this is probably not a "nice" way to do this
// stmt_case.append(statements);

let typedef:any = rule(
    ANY_WS,
    "type:",
    IND_WS,
    types,
    optional(ANY_WS, "is:", IND_WS, base),
    optional(IND_WS, "with:", IND_WS, many(
        optional(
            either(
                all(spaces, newline, getIndent), // this is automatically the last IND from IND_WS
                spaces
            )
        ),
        token("membertype", /\w+/),
        /\s*\:\s*/,
        membernames
    )),
    optional(IND_WS, "start:", IND_WS, startstate),
    optional(IND_WS, "state", spaces, statename, ":", IND_WS, many(
        optional(newline, getIndent),
        statements,
    ))
).yields(prettyprint);

let typedefs:any = rule(many(typedef, optional(ANY_WS)));

let source:string = `
type:
    Document
is:
    machine with:
        Hash: this
        Signature: buyer, seller, buyerRep, sellerRep
        Party: rejecter
    start:
        initialise
    state initialise:
        switch input:
            case sign(Buyer:x):
                halt

`;

parse(source)
(
    rule(typedefs).yields(prettyprint),
    rule("operator:", IND_WS, /\w+/, /\w+/)
);

