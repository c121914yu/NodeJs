const http = require("http")

// 创建服务器
// http.createServer((req,res) => {
// 	if(req.url === "/"){
// 		console.log(req.url)
// 		res.write("hello world")
// 		res.end()
// 	}
// }).listen(5000,() => {
// 	console.log("服务器运行...")
// })

// 引入模板
const path = require("path")
const fs = require("fs")

const server = http.createServer((req,res) => {
	// if(req.url === "/"){
	// 	fs.readFile(path.join(__dirname,"home.html"),(err,data) => {
	// 		if(err) throw err
	// 		res.writeHead(200,{"Content-Type": "text/html"})
	// 		res.end(data)
	// 	})
	// }
	// else if(req.url === "/about"){
	// 	fs.readFile(path.join(__dirname,"about.html"),(err,data) => {
	// 		if(err) throw err
	// 		res.writeHead(200,{"Content-Type": "text/html"})
	// 		res.end(data)
	// 	})
	// }
	// else if(req.url === "/api/user"){
	// 	const user = {
	// 		name: "余金隆",
	// 		age: 20
	// 	}
	// 	res.writeHead(200,{"Content-Type": "application/json"})
	// 	res.end(JSON.stringify(user))
	// }
	
	// 创建变量存储文件路径
	let filePath = path.join(__dirname,req.url === "/" ? "home.html" : req.url+".html")
	// 初始化content-type
	let contentType = "text/html"
	// 文件扩展名
	let extname = path.extname(filePath)
	// 通过扩展名判断contentType
	switch(extname){
		case ".js":contentType="text/javascript";break;
		case ".css":contentType="text/css";break;
		case ".json":contentType="application/json";break;
		case ".png":contentType="image/png";break;
		case ".jpg":contentType="image/jpg";break;
	}
	console.log(filePath)
	fs.readFile(filePath,(err,data) => {
		if(err){
			if(err.code === "ENOENT"){
				fs.readFile(path.join(__dirname,"404.html"),(err,data) => {
					if(err) throw err
					res.writeHead(200,{"Content-Type": "text/html"})
					res.end(data,"utf-8")
				})
			}
			else{
				res.writeHead(500)
				res.end("服务器错误: "+err.code)
			}
		}
		else{
			res.writeHead(200,{'Content-Type':contentType})
			res.end(data,"utf-8")
		}
	})
})
const PORT = process.env.PORT || 9999
server.listen(PORT,() => {
	console.log(`服务器已经在${PORT}端口运行`)
})