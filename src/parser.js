const AST = require("./ast");

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    peek() { return this.tokens[this.pos]; }
    consume() { return this.tokens[this.pos++]; }
    match(...expected) {
        if (expected.includes(this.peek())) return this.consume();
        return null;
    }
    expect(token, msg) {
        if (this.peek() === token) return this.consume();
        throw new Error(`[ParserError] ${msg}, ketemu: '${this.peek()}' (pos ${this.pos})`);
    }

    parse() {
        const stmts = [];
        while (this.pos < this.tokens.length) stmts.push(this.statement());
        return new AST.Program(stmts);
    }

    statement() {
        let tok = this.peek();
        if (tok === "biarkan") return this.letStmt();
        if (tok === "tulis") return this.printStmt();
        if (tok === "jika") return this.ifStmt();
        if (tok === "ulang") return this.loopStmt();
        if (tok === "fungsi") return this.funcStmt();
        if (tok === "kembalikan") {
            this.consume();
            return new AST.Return(this.expression());
        }
        // Expression statement
        const expr = this.expression();
        return expr;
    }

    // biarkan x = 10
    letStmt() {
        this.consume(); // 'biarkan'
        const name = this.consume();
        this.expect("=", "Expected '=' di deklarasi variabel");
        const expr = this.expression();
        return new AST.Let(name, expr);
    }

    // tulis "Halo"
    printStmt() {
        this.consume(); // 'tulis'
        return new AST.Print(this.expression());
    }

    // jika cond [maka] ... [selain itu ...] selesai
    ifStmt() {
        this.consume(); // 'jika'
        const cond = this.expression();
        this.match("maka"); // opsional

        const thenBranch = [];
        while (this.peek() !== "selain itu" && this.peek() !== "selesai") {
            thenBranch.push(this.statement());
        }

        let elseBranch = [];
        if (this.peek() === "selain itu") {
            this.consume();
            while (this.peek() !== "selesai") {
                elseBranch.push(this.statement());
            }
        }
        this.expect("selesai", "Expected 'selesai' untuk menutup jika");
        return new AST.If(cond, thenBranch, elseBranch);
    }

    // ulang i dari 1 sampai 5 [maka] ... selesai
    loopStmt() {
        this.consume(); // 'ulang'
        const varName = this.consume();

        let start, end;
        if (this.match("dari")) {
            start = this.expression();
            this.expect("sampai", "Expected 'sampai' di loop");
            end = this.expression();
        } else {
            // sintaks alternatif i 1..10
            start = this.expression();
            this.expect("..", "Expected '..' di loop");
            end = this.expression();
        }

        this.match("maka"); // opsional

        const body = [];
        while (this.peek() !== "selesai") {
            body.push(this.statement());
        }
        this.consume(); // 'selesai'
        return new AST.Loop(varName, start, end, body);
    }

    // fungsi nama(param1, param2) [maka] ... selesai
    funcStmt() {
        this.consume(); // 'fungsi'
        const name = this.consume();
        this.expect("(", "Expected '(' di fungsi");

        const params = [];
        while (this.peek() !== ")") {
            params.push(this.consume());
            if (this.peek() === ",") this.consume();
        }
        this.consume(); // ')'

        this.match("maka"); // opsional

        const body = [];
        while (this.peek() !== "selesai") {
            body.push(this.statement());
        }
        this.consume(); // 'selesai'
        return new AST.Func(name, params, body);
    }

    // ======== EXPRESSIONS ========
    expression() {
        return this.logicOr();
    }

    logicOr() {
        let left = this.logicAnd();
        while (this.peek() === "atau" || this.peek() === "||") {
            this.consume();
            let right = this.logicAnd();
            left = new AST.Binary(left, "||", right);
        }
        return left;
    }

    logicAnd() {
        let left = this.equality();
        while (this.peek() === "dan" || this.peek() === "&&") {
            this.consume();
            let right = this.equality();
            left = new AST.Binary(left, "&&", right);
        }
        return left;
    }

    equality() {
        let left = this.comparison();
        while (["==", "!="].includes(this.peek())) {
            let op = this.consume();
            let right = this.comparison();
            left = new AST.Binary(left, op, right);
        }
        return left;
    }

    comparison() {
        let left = this.addition();
        while (["<", ">", "<=", ">="].includes(this.peek())) {
            let op = this.consume();
            let right = this.addition();
            left = new AST.Binary(left, op, right);
        }
        return left;
    }

    addition() {
        let left = this.term();
        while (["+", "-"].includes(this.peek())) {
            let op = this.consume();
            let right = this.term();
            left = new AST.Binary(left, op, right);
        }
        return left;
    }

    term() {
        let left = this.unary();
        while (["*", "/"].includes(this.peek())) {
            let op = this.consume();
            let right = this.unary();
            left = new AST.Binary(left, op, right);
        }
        return left;
    }

    unary() {
    if (["-", "!", "tidak", "bukan"].includes(this.peek())) {
        let op = this.consume();
        let right = this.unary();
        return new AST.Unary(op, right);
    }
    return this.factor();
}

    factor() {
        let tok = this.consume();

        // literal number
        if (/^\d+$/.test(tok)) return new AST.NumberLit(Number(tok));
        // literal string
        if (/^".*"$/.test(tok)) return new AST.StringLit(tok.slice(1, -1));
        // literal boolean
        if (tok === "benar" || tok === "ya") return new AST.BoolLit(true);
        if (tok === "salah" || tok === "nggak") return new AST.BoolLit(false);

        // Identifier: variable / call
        if (/^[A-Za-z_]\w*$/.test(tok)) {
            if (this.peek() === "(") {
                this.consume(); // '('
                const args = [];
                while (this.peek() !== ")") {
                    args.push(this.expression());
                    if (this.peek() === ",") this.consume();
                }
                this.consume(); // ')'
                return new AST.Call(tok, args);
            }
            return new AST.Var(tok);
        }

        // Grouping
        if (tok === "(") {
            let expr = this.expression();
            this.expect(")", "Expected ')' di grouping expr");
            return expr;
        }

        throw new Error(`[ParserError] Unexpected token '${tok}' di pos ${this.pos}`);
    }
}

module.exports = { Parser };