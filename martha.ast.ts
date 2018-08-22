import { Tibu, Result, ResultTokens, Input, IRule, IToken, Pattern, IRuleAction } from "tibu";
const { parse, token, rule, all, many, optional, either } = Tibu;

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}

class AST {
    static trap:IRuleAction = (r, c):any => {
        console.log(JSON.stringify(r,null,2));
        console.log(JSON.stringify(c,null,2));
        // tslint:disable-next-line:no-debugger
        debugger;
    }

    static prefixop(result:ResultTokens, cst:any):any {
        return { op: "prefix", parameters: [result.tokens[0].name] };
    }

    static postfixop(result:ResultTokens, cst:any):any {
        return { op: "postfix", parameters: [result.tokens[0].name] };
    }

    static argumentsspec(result:ResultTokens, cst:any):any {
        let modcst = flat(cst)
        if (result.tokens.length) {
            if (result.one("dot")) {
                if (modcst[0].reference) {
                    modcst[0].reference = `this.${modcst[0].reference}`
                } // TODO: else error case
            } else {
                modcst.unshift({ op: result.tokens[0].name })
                modcst.unshift({ reference:"this" })
            }
        }
        return { op: "argspec", parameters: [...modcst] }
    }

    static argumentdef(result:ResultTokens, cst:any):any {
        return { 
            op: "argdef", 
            parameters: cst 
                ? [result.one("varname"), result.one("typename"), ...flat(cst)] 
                : [result.one("varname"), result.one("typename")] 
        }
    }

    static argumentdefs(result:ResultTokens, cst:any):any {
        return {
            op: "argdefs",
            parameters: flat(cst)
        }
    }

    static returndef(result:ResultTokens, cst:any):any {
        return {
            op: "returndef",
            parameters: cst 
                ? [ result.one("typename"), ...flat(cst) ] 
                : [ result.one("typename") ]
        }
    }

    static typedef(result:ResultTokens, cst:any):any {
        let types:any[] = flat(cst)
            .filter(x => x)
            .filter(x => x.name)
            .map((name:any) => {
                let type:any = {
                    name: name.name[0]
                };
                flat(cst).filter(x => x).forEach(part => {
                    if (part.basetype) {
                        type.basetype = part.basetype[0];
                    }
                    if (part.members) {
                        type.members = type.members ? [...type.members, ...part.members]
                                                    : [...part.members];
                    }
                });
                return type;
        });
        return {
            types: flat(types)
        };
    }

    static typedef_member(result:ResultTokens, cst:any):any {
        return {
            members: flat(cst)
                    .filter(x => x)
                    .filter(x => x.reference)
                    .map(x => {
                        return {
                            type:result.one("typename"),
                            name:x.reference
                        };
                    })
        };
    }

    static typedef_name(result:ResultTokens, cst:any):any {
        return {
            name: result.get("typename")
        };
    }

    static typedef_basetype(result:ResultTokens, cst:any):any {
        return {
            basetype: result.get("typename")
        };
    }

    static atomparen(result:ResultTokens, cst:any):any {
        return {
            op: "parenthesis",
            parameters: cst ? flat(cst) : undefined
        };
    }

    static atomcall(result:ResultTokens, cst:any):any {
        return {
            op: "call",
            parameters: cst === undefined ? [
                result.get("member")
            ] : [
                result.get("member"),
                ...flat(cst)
            ]
        };
    }

    static atomliteral(result:ResultTokens, cst:any):any {
        return {
            op: "literal",
            parameters: [result.tokens[0].name, result.tokens[0].result.value]
        };
    }

    static atomarrliteral(result:ResultTokens, cst:any):any {
        return {
            op:"arrayliteral",
            parameters: cst === undefined ? [] : flat(cst)
        };
    }

    static atomobjliteral(result:ResultTokens, cst:any):any {
        return {
            op:"literal",
            parameters: result.get("member")
            ? ["object", ...result.get("member").map((m:string,i:any) => { return { op:"assign", parameters:[m, ...flat(cst)[i]] };})]
            : ["object"]
        };
    }

    static atommember(result:ResultTokens, cst:any):any {
        return flat(cst);
    }

    static atom(result:ResultTokens, cst:any):any {
        return flat(cst);
    }

    static exp(result:ResultTokens, cst:any):any {
        if (result.tokens.length) {
            const ext:any = result.tokens.map((t, i) => [{op:t.name}, flat(cst)[i + 1]]);
            return flat([cst[0]].concat(...ext));
        }
        return flat(cst);
    }

    static flatcst(result:ResultTokens, cst:any):any {
        return flat(cst);
    }

    static reference(result:ResultTokens, cst:any):any {
        return { reference: result.get("member").join(".") };
    }
}

export {
    AST
};