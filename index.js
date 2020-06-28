const express = require("express")
const multer = require("multer")
const ejs = require("ejs")
const path = require("path")
const fs = require("fs")

const app = express()

app.set("view engine","html")
app.engine("html",ejs.renderFile)

app.use("/public",express.static("public"))

app.get("/",(req,res) => {
	res.render("index")
})
app.get("/uploads/:name",(req,res) => {
	const rs = fs.createReadStream("./public/uploads/"+req.params.name)
	rs.pipe(res)
})

// 创建存储引擎
const storage = multer.diskStorage({
	destination: function(req,file,cb){
		// 存储路径
		cb(null,"./public/uploads/")
	},
	filename: function(req,file,cb){
		// 存储名,path.extname - 获取后缀
		cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
	}
})
// 初始化upload
const upload = multer({
	storage: storage,
	fileFilter: function(req,file,cb){
		checkFileType(file,cb)
	},
	limits: {
		fileSize: 10
	}
}).single("myImage")

// 捕获Post
app.post("/upload",(req,res) => {
	// res.send("test")
	upload(req,res,(err) => {
		if(err)
			res.render("index",{
				msg: err
			})
		else{
			if(req.file === undefined)
				res.render("index",{
					msg: "错误: 未选择文件"
				})
			else
				res.render("index",{
					msg: "上传成功!",
					file: `uploads/${req.file.filename}`
				})
		}
	})
})

function checkFileType(file,cb){
	// 允许扩展名格式
	const fileType = /jpeg|jpg|png|gif/
	// 验证扩展名
	const extname = fileType.test((file.originalname).toLowerCase())
	// 验证MIME
	const mimetype = fileType.test(file.mimetype)
	if(extname && mimetype)
		return cb(null,true)
	else
		cb("错误: 只支持图片格式") // post里err的内容
}

const PORT = 4000
app.listen(PORT,(err) => {
	if(err) throw err
	console.log(`server is running in ${PORT}`)
})