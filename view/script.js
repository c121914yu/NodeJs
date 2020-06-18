// socket.io设置
// 1. 实现与服务器连接
var socket = io.connect("http://localhost:5000")

// 获取节点
const output = document.getElementById("output")
const feedback = document.getElementById("feedback")
const message = document.getElementById("message")
const handle = document.getElementById("handle")
const btn = document.getElementById("send")

const name = ["余金隆","邓丹婵","点点","小dark","rabit"]
handle.value = getName()
function getName(){
	return name[Math.floor(Math.random()*name.length)]
}

btn.onclick = () => {
	const content = message.value
	const obj = handle.value
	if(obj === ""){
		alert("发送对象不能为空")
		return
	}
	else if(content === ""){
		alert("内容为空")
		return
	}
	else{
		// 传输至服务器
		socket.emit("chat",{
			handle: obj,
			message: content
		})
		message.value = ""
	}
}

message.onfocus = () => {
	socket.emit("typing",handle.value)
}
message.onfocusout = () => {
	socket.emit("typing",handle.value)
}

// 获取服务器传来的数据
socket.on("chat",(data) => {
	feedback.innerHTML = ""
	output.innerHTML += 
	`
		<p><strong>${data.handle}:${data.message}</strong></p>
	`
})

// 获取广播数据
socket.on("typing",(data) => {
	feedback.innerHTML = 
	`
		<p><em>${data}正在输入...</em></p>
	`
})