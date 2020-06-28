## 图片上传

```js
// 1. 引入插件
const multer = require("multer")
// 2. 配置存储引擎
const storage = multer.diskStorage({
	destination: function(req,file,cb){// 存储路径
		cb(null,"./public/uploads/")
	},
	filename: function(req,file,cb){// 存储名
		// fieldname - 上传时的name
		// originalname - 存储在计算机上的文件名
		// path.extname - 获取后缀
		cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
	}
})
// 3. 初始化upload
const upload = multer({
	storage: storage,
	fileFilter: function(req,file,cb){
		checkFileType(file,cb)// 格式筛选
	},
	limits: {
		fileSize: 10
	}
}).single("myImage") // myImage - input的name
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

// 4. 捕获上传
upload(req,res,(err) => {
	if(err) // 例如：格式错误时会提示错误
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
```