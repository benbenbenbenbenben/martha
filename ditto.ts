import { Input } from "./ditto.Input";
import { Result } from "./ditto.Result";
import { ResultTokens } from "./ditto.ResultTokens";

class Ditto {
    public static tests:(() => ({actual:any, expected:any, source:string}))[] = [];
    public static flat(arr:any[]):any[] {
        return arr.reduce(
            (a, b) => a.concat(Array.isArray(b) ? Ditto.flat(b) : b), []
        );
    }
    public static parse(source:string):(...rules:any[]) => any {
        let input:Input = new Input(source);
        return (...rules:any[]): any => {
            for (let rule of rules) {
                if (Ditto.parserule(input, rule) === false) {
                    break;
                }
            }
            return null;
        };
    }
    public static parserule(input:Input, rule:any):any {
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
            rule.yielder(tokens, matches.map(match => match.yielded));
        }
        return true;
        // rule(...matches);
    }
    public static rule(...patterns:any[]):IRule {
        let predicates:any = Ditto.ensurePredicates(...patterns);
        predicates.__rule__ = true;
        predicates.yields = (handler:IRuleAction):any => {
            predicates.yielder = handler;
            return predicates;
        };
        predicates.passes = (source:string, expected:any):IRule => {
            Ditto.tests.push(() => {
                let result:any = null;
                Ditto.parse(source)(Ditto.rule(
                    predicates
                ).yields((r,c) => {
                    result = c[0];
                    return null;
                }));
                return { expected: expected, actual: result, source: predicates.toString() };
            });
            return predicates;
        };
        return predicates;
    }
    public static debugrule(...patterns:any[]):any {
        let thisrule:any = Ditto.rule(...patterns);
        thisrule.breakonentry = true;
        return thisrule;
    }
    public static ensurePredicates(...patterns:any[]):Function[] {
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
                        children: [],
                        yielded: undefined // pattern
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
                        children: [],
                        yielded: undefined // rxix.value
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
                predicate = (input:Input):Result => {
                    if (pattern.breakonentry) {
                        // tslint:disable-next-line:no-debugger
                        debugger;
                    }
                    if (pattern.yielder) {
                        const frozentokens:ResultTokens = input.tokens;
                        input.tokens = new ResultTokens();
                        const result:Result = Ditto.all(...pattern)(input);
                        if (result.success) {
                            let subruleyield:any = pattern.yielder(input.tokens, result.yielded);
                            result.yielded = subruleyield;
                        }
                        input.tokens = frozentokens;
                        return result;
                    } else {
                        return Ditto.all(...pattern)(input);
                    }
                };
                predicate.toString = () => {
                    return "pred:" + pattern.map((p:any) => p.toString()).join("/");
                };
                return predicate;
                default:
                throw new Error("oops");
            }
        });
    }

    public static all(...patterns:any[]):(input:Input) => Result {
        return (input:Input):Result => {
            let location:number = input.location;
            let consumed:Result[] = [];
            let fault:boolean = false;
            for (let pattern of Ditto.ensurePredicates(...patterns)) {
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
    }

    public static optional(...patterns:any[]):(input:Input) => Result {
        return (input:Input):Result => {
            let outcome:Result = Ditto.all(...patterns)(input);
            if (outcome.success) {
                return outcome;
            } else {
                return Result.pass(input);
            }
        };
    }

    public static either(...patterns:any[]):(input:Input) => Result {
        return (input:Input):Result => {
            let outcome:Result = Result.fault(input);
            for (let pattern of Ditto.ensurePredicates(...patterns)) {
                let current:Result = input.consume(pattern);
                if (current.success) {
                    outcome = current;
                    break;
                }
            }
            return outcome;
        };
    }

    public static many(...patterns:any[]):(input:Input) => Result {
        return (input:Input):Result => {
            let location:number;
            let consumed:Result[] = [];
            let current:Result;
            let nothingleft:boolean = false;
            while (true) {
                location = input.location;
                current = Ditto.all(...patterns)(input);
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
    }

    public static token(name:string, pattern:RegExp | string):IToken {
        let func:Function[] = Ditto.ensurePredicates(pattern);
        (func[0] as any).__token__ = name;
        return func[0];
    }
}

interface IRuleAction {
    (this:any, result:ResultTokens, yielded:any):any | void;
}
interface IToken {
}
interface IRule {
    (...pattern:any[]): IRule;
    yields(yielder:IRuleAction):IRule;
    passes(source:string, expect:any):IRule;
}
export {
    Ditto,
    Result,
    ResultTokens,
    Input,

    IToken,
    IRule
};