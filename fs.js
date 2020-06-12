const fs = require("fs")
const path = require("path")

// mkdir / mkdirSync - 创建文件夹
// fs.mkdir("测试文件夹",(err) => {
// 	if(err) throw err //已存在文件夹则报错
// 	console.log("文件夹创建成功")
// })

// writeFile(路径，内容，回调) - 创建/写入文件
// fs.writeFile(path.join(__dirname,"/测试文件夹","hello.txt"),"Hello world\n",err => {
// 	if(err) throw err //已存在文件则覆盖，不存在则创建
// 	console.log("文件写入")
	
// 	// appendFile(路径，内容，回调) - 追加文件内容
// 	fs.appendFile(path.join(__dirname,"/测试文件夹","hello.txt"),"I love js",err => {
// 		if(err) throw err //已存在文件则覆盖，不存在则创建
// 		console.log("内容追加")
// 	})
// })

// readFile() - 读取文件
fs.readFile(path.join(__dirname,"/测试文件夹","hello.txt"),"utf-8",(err,data) => {
	if(err) throw err
	console.log(data)
})

// rename() - 重命名
fs.rename(path.join(__dirname,"/测试文件夹","hello.txt"),path.join(__dirname,"/测试文件夹","test.txt"),(err) => {
	if(err) throw err
	console.log("重命名成功")
})