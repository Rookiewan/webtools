"use strict";

const fs = require("fs");
const shelljs = require("shelljs");
const through = require("through2");
const asyncLib = require('async')

let buf = fs.readFileSync("./hashes.txt")
buf = buf.toString();
let hashes = []
buf.replace(/dangling blob (\w+)/gi,function (matached, hash) {
    hashes.push(hash)
});

// hashes = hashes.slice(0, 10)

let all = hashes.length;
let left = all;
// asyncLib.mapLimit(hashes, 40, (hash, callback) => {
//   let fullContent = ""
//   let stdout = shelljs.exec("git show "+hash,{silent:true}).stdout;
//   let input = through();
//   console.log((left--)+"/"+all);
//   //TODO:through2原来是为了处理stdout流的异步数据引入的,当前同步过程下不需要
//   input.pipe(through((buf,_,next)=>{
//       fullContent = fullContent+buf.toString();
//       next(null,buf)
//   },flush=>{
//       if (matchContent(fullContent)){
//           fs.writeFile("./objects/"+hash,fullContent)
//       }
//       flush()
//   }))

//   input.push(stdout);
//   input.push(null);
//   callback(null)
// })
hashes.forEach(hash=>{
    let fullContent = ""
    let stdout = shelljs.exec("git show "+hash,{silent:true}).stdout;
    let input = through();
    console.log((left--)+"/"+all);
    //TODO:through2原来是为了处理stdout流的异步数据引入的,当前同步过程下不需要
    input.pipe(through((buf,_,next)=>{
        fullContent = fullContent+buf.toString();
        next(null,buf)
    },flush=>{
        if (matchContent(fullContent)){
            fs.writeFile("./objects/"+hash,fullContent)
        }
        flush()
    }))

    input.push(stdout);
    input.push(null);
})

function matchContent(content){
  // return true
  // return /(APP_PATH)/.test(content)
  return /www\.baidu\.com/.test(content)
    // ... 匹配规则
}