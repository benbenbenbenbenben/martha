import { expect } from "chai";
import "mocha";
import { AST } from "../martha.ast";
import { Tibu, ResultTokens, Result } from "tibu";
import { Def, Exp, Stmt } from "../martha.grammar";
import { MethodAccess, Emit, Reference, Literal, Assignment, Plus, Mult, Minus, Gt, Dot_Prefix, ReturnDef, ArgumentDef, Lt, Statement, MethodDef } from "../martha.emit";
const { parse, rule, either, many, all, optional } = Tibu;

const flat = (arr:any[]): any[] => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
         acc.concat(flat(val)) : acc.concat(val), []);
}
