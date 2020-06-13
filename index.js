const express = require("express")
const app = express()

app.get("/",(req,res) => {
	console.log(req.url)
	res.send("主页")
})

app.get("/about",(req,res) => {
	console.log(req.url) // "/about"
	res.send("关于")
})

// req.params.id - 获取路由参数
app.get("/news/:id",(req,res) => {
	res.send("路由参数"+req.params.id)
})

// 监听端口
const PORT = 8000
app.listen(PORT,(err) => {
	console.log(`server is running in ${PORT}`)
})