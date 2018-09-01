"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const tibu_1 = require("tibu");
const { parse, rule, either, many, all, optional } = tibu_1.Tibu;
const flat = (arr) => {
    return arr.reduce((acc, val) => Array.isArray(val) ?
        acc.concat(flat(val)) : acc.concat(val), []);
};
//# sourceMappingURL=martha.expr.spec.js.map