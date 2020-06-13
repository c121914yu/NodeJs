const express = require("express")
const app = express()

// 配置ejs引擎
app.set("view engine","ejs")
// 配置静态文件
app.use("/static",express.static("static"))

app.get("/",(req,res) => {
	res.render("home")
})

app.get("/news",(req,res) => {
	res.render("news")
})


app.listen(3000,() => {
	console.log("运行在3000口")
})