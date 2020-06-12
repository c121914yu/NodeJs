const Events = require("events")

// 创建myEmitter类
class MyEmitter extends Events{}

// 实例化对象
const myEmitter = new MyEmitter()

// 注册时间
myEmitter.on("event",(e) => {
	setImmediate(() => { //转化成异步
		console.log(e)
	})
})

// 触发事件
myEmitter.emit("event","这是参数")

console.log("异步显示")