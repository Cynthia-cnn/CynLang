const AST=require("./ast");

class Env { 
    constructor(parent=null){ 
        this.vars={}; 
        this.parent=parent; 
    }
    get(n){ 
        if(n in this.vars) return this.vars[n]; 
        if(this.parent) return this.parent.get(n); 
        throw new Error("Undefined var "+n); 
    }
    set(n,v){ this.vars[n]=v; }
}

function evalNode(node,env) {
    if(node instanceof AST.Program){ 
        node.statements.forEach(s=>evalNode(s,env)); 
    }
    
    else if(node instanceof AST.Let){ 
        env.set(node.name,evalNode(node.expr,env)); 
    }
    else if(node instanceof AST.Assign){ 
        if(env.get(node.name)!==undefined) 
            env.set(node.name,evalNode(node.expr,env)); 
        else 
            throw new Error("Undefined var "+node.name); 
    }
    else if(node instanceof AST.Print){ 
        console.log(evalNode(node.expr,env)); 
    }
    
    else if(node instanceof AST.NumberLit){ 
        return node.value; 
    }
    else if(node instanceof AST.StringLit){ 
        return node.value; 
    }
    else if(node instanceof AST.BoolLit){ 
        return node.value; 
    }
    else if(node instanceof AST.Var){ 
        return env.get(node.name); 
    }
    
    else if(node instanceof AST.Binary){
        let l=evalNode(node.left,env), r=evalNode(node.right,env);
        switch(node.op){
            case "+": return l+r;
            case "-": return l-r;
            case "*": return l*r;
            case "/": return l/r;
            case "==": return l==r;
            case "!=": return l!=r;
            case "<": return l<r;
            case ">": return l>r;
            case "<=": return l<=r;
            case ">=": return l>=r;
            case "&&": return l && r;
            case "||": return l || r;
        }
    }
    else if(node instanceof AST.Unary){
        let v=evalNode(node.expr,env);
        if(node.op==="-") return -v;
        if(node.op==="!" || node.op==="tidak" || node.op==="bukan") return !v;
    }
    
    else if(node instanceof AST.If){
        if(evalNode(node.cond,env)){ 
            node.thenBranch.forEach(s=>evalNode(s,env)); 
        } else { 
            node.elseBranch.forEach(s=>evalNode(s,env)); 
        }
    }
    
    else if(node instanceof AST.Loop){
        for(let i=evalNode(node.start,env); i<=evalNode(node.end,env); i++){
            env.set(node.varName,i);
            node.body.forEach(s=>evalNode(s,env));
        }
    }
    
    else if(node instanceof AST.Func){ 
        env.set(node.name,node); 
    }
    else if(node instanceof AST.Call){
        let f=env.get(node.name);
        if(!(f instanceof AST.Func)) throw new Error(`${node.name} bukan fungsi`);
        let local=new Env(env);
        f.params.forEach((p,i)=>local.set(p,evalNode(node.args[i],env)));
        let ret;
        f.body.forEach(s=>{
            if(s instanceof AST.Return) ret=evalNode(s.expr,local);
            else evalNode(s,local);
        });
        return ret;
    }
    
    else if(node instanceof AST.Return){ 
        return evalNode(node.expr,env); 
    }
}

function run(ast){ 
    let env=new Env(); 
    evalNode(ast,env); 
}

module.exports={run};