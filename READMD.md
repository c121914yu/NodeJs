# node express 框架搭建接口

## 1. 请求的方法

> get - 请求数据
> post - 创建数据
> put - 更新数据
> delete - 删除数据

## 2. 搭建路由及优化

```js
// route.js
// 使用router并导出
const express = require("express")
const router = express.Router()
module.exports = router

// index.js
// 引入路由，实现分离
const routes = require("./routes/camps.js")
// 请求地址带/api/v1/camps时执行router里的路由监听,router里不需要再写/api/v1/camps
// 由此可以实现不同请求地址指向不同文件
app.use("/api/v1/camps", routes)
```

经过上面的引用后 routes 里的根请求地址为 "/api/v1/camps"

```js
// route.js
app.get("/", (req, res) => {}) //实际请求地址为 http://localhost:5000/api/v1/camps

// 考虑到相同地址不同请求方式时可以对路由进行进一步封装
// camps_controllers.js
exports.getcamps = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: "获取所有数据",
	})
}
exports.createcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: "创建数据",
	})
}
// route.js
const { getcamps, createcamp } = require("./camps_controllers.js")
	// 实际请求地址为 http://localhost:5000/api/v1/camps
	// 执行get时走getcamps方法，post时执行createcamp方法
	.router.route("/")
	.get(getcamps)
	.post(createcamp)
```

## 3. 中间件

```js
// logger.js
// 自定义中间件
const logger = (req, res, next) => {
	// 方法，协议，主机
	// GET http://localhost:5000/api/v1/camps
	console.log(
		`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
	)
	next()
}
module.exports = logger

// index.js
const logger = require("./middleware/logger")
app.use(logger)
// 也可以直接使用网上下载的中间件
// morgan中间件 - 打印请求地址与响应结果，时间
const morgan = require("morgan")
app.use(morgan("dev"))
```
