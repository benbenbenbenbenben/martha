class ResultTokens {
    tokens:any[];
    constructor() {
        this.tokens = [];
    }
    push(name:string, result:Result):number {
        this.tokens.push({name, result});
        return this.tokens.length;
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
        return this.location;
    }
    rewind(loc:number):void {
        this.location = loc;
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
            break;
        }
        // console.log(JSON.stringify(matches, null, 2));
        if (rule.yielder) {
            rule.yielder(tokens.tokens);
        }
        // rule(...matches);
    }
};

const rule:Function = (...patterns:any[]):any => {
    let predicates:any = ensurePredicates(...patterns);
    predicates.__rule__ = true;
    predicates.yields = (handler:Function):any => {
        predicates.yielder = handler;
        return predicates;
    };
    return predicates;
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
        return Result.composite(...consumed);
    };
};

const spaces:RegExp = /[ \t]*/;
const newline:RegExp = /\r\n|\r|\n/;
const indent:RegExp = /^[ \t]+/;

const ensurePredicates:Function = (...patterns:any[]):Function[] => {
    return patterns.map(pattern => {
        switch(pattern.__proto__.constructor.name) {
            case "String":
            return (input:Input):Result => {
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
            case "RegExp":
            return (input:Input):Result => {
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
            case "Function":
            return pattern;
            // subrule case
            case "Array":
            return all(...pattern);
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

let infix_whitespace:any = rule(spaces, optional(newline, indent));
let any_whitespace:any = rule(/[\t\r\n\s]*/);
let infix_comma:any = rule(/\s*,\s*/);

let typename:any = token("typename", /\w+/);
let typenames:any = rule(typename, many(optional(infix_comma, typename)));
let basetypename:any = token("basetypename", /\w+/);
let typedef:any = rule("type:", infix_whitespace, typenames, optional(any_whitespace, "is:", infix_whitespace, basetypename));
let typedefs:any = rule(many(typedef, optional(any_whitespace)));

let prettyprint:any = (x:any) => console.log(JSON.stringify(x, null, 2));

let source:string = `type:
    Party
is:
    Address

type:
    Buyer, Seller, BuyerRep, SellerRep
is:
    machine with:
        Party: this
        bool: sentCloseRequest
`;

parse(source)
(
    rule(typedefs).yields(prettyprint),
    rule("operator:", infix_whitespace, /\w+/, /\w+/)
);

