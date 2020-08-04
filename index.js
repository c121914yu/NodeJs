const express = require("express")
// colors中间件 - 为打印文字添加颜色
const colors = require("colors")
const app = express()

// 配置body解析
app.use(express.json())

// 配置cookie
const cookieParser = require("cookie-parser")
app.use(cookieParser())

const dotenv = require("dotenv")
dotenv.config({
	path: "./config/config.env",
})

// 引入数据库
const connectDB = require("./config/db")
// 连接数据库
connectDB()

// 引入路由
const camps = require("./routes/camps.js")
const courses = require("./routes/courses.js")
const auth = require("./routes/auth.js")
// 挂载路由
//请求地址带/api/v1/camps时执行router里的路由监听,router里不需要再写/api/v1/camps
app.use("/api/v1/camps", camps)
app.use("/api/v1/course", courses)
app.use("/api/v1/auth", auth)

// 自定义中间件
// const logger = require("./middleware/logger")
// app.use(logger)

// 自定义报错中间件
const errorHandler = require("./middleware/error.js")
app.use(errorHandler)

// morgan中间件 - 打印请求地址与响应结果，时间
const morgan = require("morgan")
app.use(morgan("dev"))

const PORT = process.env.PORT || 3000
const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} node on ${PORT}`.blue
	)
)

// 处理报错
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`.red)
	// 关闭服务器 & 退出程序
	server.close(() => {
		process.exit(1)
	})
})