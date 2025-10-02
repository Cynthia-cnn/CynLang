class Program { constructor(statements) { this.statements = statements; } }
class Let { constructor(name, expr) { this.name = name; this.expr = expr; } }
class Assign { constructor(name, expr) { this.name = name; this.expr = expr; } }
class Print { constructor(expr) { this.expr = expr; } }

class NumberLit { constructor(value) { this.value = value; } }
class StringLit { constructor(value) { this.value = value; } }
class BoolLit { constructor(value) { this.value = value; } }

class Var { constructor(name) { this.name = name; } }
class Binary { constructor(left, op, right) { this.left=left; this.op=op; this.right=right; } }
class Unary { constructor(op, expr) { this.op=op; this.expr=expr; } }

class If { constructor(cond, thenBranch, elseBranch) { this.cond=cond; this.thenBranch=thenBranch; this.elseBranch=elseBranch; } }
class Loop { constructor(varName,start,end,body) { this.varName=varName; this.start=start; this.end=end; this.body=body; } }

class Func { constructor(name,params,body) { this.name=name; this.params=params; this.body=body; } }
class Call { constructor(name,args) { this.name=name; this.args=args; } }
class Return { constructor(expr) { this.expr=expr; } }

module.exports = { 
    Program, Let, Assign, Print,
    NumberLit, StringLit, BoolLit,
    Var, Binary, Unary,
    If, Loop, Func, Call, Return
};