const express = require("express")
const app = express()
const socket = require("socket.io")

// 请求界面
app.use(express.static("view"))

const PORE = 5000
const server = app.listen(PORE,(err) => {
	if(err) throw err
	console.log(`server is running in ${PORE}...`)
})

// 设置socket.io
const io = socket(server)
// 客户端与服务器连接
io.on("connection",(socket) => {
	console.log(socket.id + " 已连接")
	
	// 获取客户端数据 - chat对应客户端事件
	socket.on("chat",(data) => {
		io.sockets.emit("chat",data)
	})
	
	// 获取从客户端的typing事件
	socket.on("typing",(data) => {
		console.log(data)
		socket.broadcast.emit("typing",data)
	})
})