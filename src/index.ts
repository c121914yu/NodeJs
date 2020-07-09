import express from "express"
const app: express.Application = express()

const add = (a: number, b: number): number => a + b

app.get("/", (req, res) => {
	console.log(add(5, 6))
	res.send("hello world!")
})

app.listen(4000, () => console.log("服务器运行"))
