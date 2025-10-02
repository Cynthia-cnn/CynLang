#!/usr/bin/env node
const fs=require("fs");
const {tokenize}=require("./lexer");
const {Parser}=require("./parser");
const {run}=require("./interpreter");

const file=process.argv[2];
if(!file){console.log("Usage: cyn <file.cyn>");process.exit(1);}
const code=fs.readFileSync(file,"utf8");
const tokens=tokenize(code);
const parser=new Parser(tokens);
const ast=parser.parse();
run(ast);