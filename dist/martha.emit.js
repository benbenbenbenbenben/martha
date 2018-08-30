"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MethodAccess {
    constructor() {
        this.ispublic = false;
        this.isprivate = false;
        this.isprotected = false;
        this.isinternal = false;
    }
}
exports.MethodAccess = MethodAccess;
class Reference {
    constructor() {
        this.name = "";
    }
}
exports.Reference = Reference;
class Literal {
    constructor() {
        this.type = "";
        this.value = "";
    }
}
exports.Literal = Literal;
class Assignment {
}
exports.Assignment = Assignment;
class Emit {
    static Emit(ctor, m) {
        //return new ctor()
        return Object.assign(new ctor(), m);
    }
}
exports.Emit = Emit;
//# sourceMappingURL=martha.emit.js.map