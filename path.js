const path = require("path")

// path.basename() - 返回path最后一部分
console.log("path： " + __filename) //返回绝对路径
console.log("path-lastname: " + path.basename(__filename)) //path.js

// path.dirname() - 返回目录名
console.log("目录名: " + path.dirname(__filename))
console.log("目录名: " + __dirname) //两者相等

// path.extname() - 返回文件扩展名
console.log(path.extname(__filename)) //.js

// path.parse() - 返回对象
console.log(path.parse(__filename)) //路径所有信息

// path.join() - 串联路径
console.log(path.join(__dirname,"test","hello.html"))