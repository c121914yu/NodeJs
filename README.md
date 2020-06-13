## express框架

```js
app.get("/about",(req,res) => {
	console.log(req.url) // "/about"
	res.send("主页")
})
```

1. req.params.id - 获取路由参数
2. app.use("/static",express.static("static")) - 定义静态目录