# socket.io通信接口

1. 创建聊天应用，渲染界面。  
2. 使用socket.io通信接口。  
3. 实现客户端消息发送。  
4. 实现客户端广播信息。  

## 客户端方法

<script src="https://cdn.bootcdn.net/ajax/libs/socket.io/2.3.0/socket.io.dev.js"></script>

> io.connect("http://localhost:5000") - 连接服务器
> socket.emit(event,data) - 向客户端提交事件，event名需要对应  
> socket.on(event,data) - 接受客户端事件，event名需要对应  


## 服务器端方法

```js
// 初始化io
const io = socket(server)
io.on("connection",(socket) => {
	// socket.id - 每个用户的唯一id
	console.log(socket.id + " 已连接")
	
	// 接受客户端请求
	socket.on("chat",(data) => {
		// 向所有客户端发送请求
		io.sockets.emit("chat",data)
	})
	
	socket.on("typing",(data) => {
		// 向非来源客户端发送请求
		socket.broadcast.emit("typing",data)
	})
})
```