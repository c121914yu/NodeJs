[1 环境与库](#1)

[2 请求方式](#2)

[3 路由及优化](#3)

&emsp;[3.1 路由搭建](#3-1)

&emsp;[3.2 路由优化](#3-2)

&emsp;[3.3 路由重定向](#3-3)

[4 中间件](#4)

&emsp;[4.1 自定义错误插件](#4-1)

&emsp;[4.2 异步中间件封装](#4-2)

&emsp;[4.3 复杂查询中间件](#4-3)

[5 用户模型](#5)

&emsp;[5.1 密码加密](#5-1)

&emsp;[5.2 token & cookie](#5-2)

&emsp;[5.3 数据关联](#5-3)

[6 用户鉴权](#6)

&emsp;[6.1 登录验证](#6-1)

&emsp;[6.2 身份验证](#6-2)

&emsp;[6.3 越级保护](#6-3)

[7 MongoDB 用法](#7)

&emsp;[7.1 连接](#7-1)

&emsp;[7.2 模型设计](#7-2)

&emsp;[7.3 常用操作方法](#7-3)

&emsp;&emsp;最近两周上了吴老师的 Node 搭建接口课程，对搭建接口有了进一步的了解，涉及基本的增删查改，中间件的封装，接口抽离，身份验证等，干货满满，基本可以满足中小应用的上线要求。[腾讯课堂](https://ke.qq.com/user/index/index.html#/plan/cid=2839695&term_id=102950601)，为了保护版权我仅上传自己的[代码](https://github.com/c121914yu/NodeJs/tree/API_1)， 感兴趣的小伙伴可以购买课程详细查看。

## <span id="1" class="title">1 环境与库</span>

加粗的为插件库，也可以直接下载源码的 package.json 查看详细。

1. Node & npm 必备不多说。
2. mongoDB 数据库 & **mongoose**，—— 各厂商的 mongoDB 都比较贵，可以考虑本地搭建一个，或者 [领取免费 mongoDB](https://www.mongodb.com/),可以在这个地址里领取 512M 的免费空间，缺点就是是国外的连接的时候有那么点慢，但是使用的时候问题不大。
3. **express** —— 框架
4. **dotenv** —— 引入环境变量，一些账户密码，经常修改的参数可以放在环境变量中。
5. **jsonwebtoken** —— 生成 token，用于生成用户信息的 token。
6. **bcryptjs** —— 加密
7. **cookie-parser** —— 识别和返回 cookie。
8. **nodemailer** —— 发送邮件。

## <span id="2" class="title">2 请求方式</span>

1. GET - 获取数据。
2. POST - 创建数据。
3. PUT - 更新数据。
4. DELETE - 删除数据。

&emsp;&emsp;当然可以只用一个 POST 或者只用 GET 和 POST 也是可以的，但是这样子会需要定义多个不同名称的接口地址，当然还是会有一些区别的。

**GET 与 POST 区别**

1. GET 参数通过 URL 传递，最多 64KB，一般浏览器都会限制 url 长度在 2k 字节；POST 参数放在 request body 中无大小限制。
2. GET 请求会被浏览器主动 cache,POST 不会。
3. GET 请求参数会被保留在浏览器历史中，POST 不会。
4. GET 请求中非 ASCII 字符需要转码，POST 不用。
5. 浏览器输入网址为 GET 请求。可以用来调试，但是 POST 请求不能直接通过浏览器调试。
6. GET 产生一个 TCP 数据包，POST 产生两个，先发 header 再发 data。

**POST 与 PUT 区别**  
&emsp;&emsp;PUT 被定义为 idempotent 方法，而 POST 不是。如果一个方法重复执行多次，产生的效果是一样的，那就是 idempotent 的。 所以 PUT 请求，后一次会把前一次覆盖，而 POST 不会，但通常是通过接口监听后通过指令操作数据库，所以不会有太多的区别。

### <span id="3" class="title">3 路由及优化</span>

### <span id="3-1" class="title">3.1 路由搭建</span>

&emsp;&emsp;Express 提供非常简便的路由抽离方法，可以将不同请求地址的路由分配到不同文件中。

```js
// index.js - 入口文件
const express = require("express")
const app = express()
// 引入路由
const camps = require("./routes/camps.js")
// 挂载路由
/* 
	例如本地监听5000端口，当请求地址为： 
	 http://localhost:5000/api/v1/camps/... 
	会在camps里查询相应的监听地址。
*/
app.use("/api/v1/camps", camps)

// camps.js - camps路由
const express = require("express")
const router = express.Router()
// 请求地址为: http://localhost:5000/api/v1/camps
router.get("/", (req, res) => {})
module.exports = router
```

### <span id="3-2" class="title">3.2 路由优化</span>

&emsp;&emsp;由于路由中还会引入路由守卫，身份验证，封装查询等，所以可以将接口函数单独抽离到一个文件中，在路由文件对地址进行监听后依次执行中间件最后执行接口函数。

```js
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

// camps.js
const { getcamps, createcamp } = require("./camps_controllers.js")
// 实际请求地址为 http://localhost:5000/api/v1/camps
// 执行get时走getcamps方法，post时执行createcamp方法
router.route("/").get(getcamps).post(createcamp)
```

### <span id="3-3" class="title">3.3 路由重定向</span>

&emsp;&emsp;此方法主要用于相关联数据的请求，例如 Demo 中涉及获取指定机构的课程数据，设计的接口地址是 **/api/v1/camps/:campsId/courses** 此时 Express 会分配到 camps.js 中查询接口，但是我们希望它在 course.js 中得到监听，方便与查询所有课程数据的接口进行合并。

```js
// camps.js
/*
	当请求地址为:
		http://localhost:5000/api/v1/camps/:campsId/courses
	时跳转到course中路由
*/
const courses = require("./courses")
router.use("/:campsId/courses", courses)

// course.js
// mergeParams合并参数，用于重定向.若不指定无法获取其他路由跳转过来的参数
const router = express.Router({
	mergeParams: true,
})
// 此时除了监听到index.js分配的默认请求地址外，还会监听到camps.js分配的地址
router.route("/")
```

### <span id="4" class="title">4 插件 & 中间件</span>

&emsp;&emsp;不严格区分的话中间件又可以称为插件，中间件通常是在监听到请求后，执行接口函数前执行；插件是在需要的文件中引入并手动触发。可以用于身份验证，封装方法等。

### <span id="4-1" class="title">4.1 自定义错误插件</span>

```js
// 创建自定义错误类，在其他文件引用使用
class ErrorResponse extends Error {
	constructor(message, statusCode) {
		super(message)
		this.statusCode = statusCode
	}
}
model.exports = ErrorResponse

// camps_controllers.js
const ErrorResponse = require("../utils/errorResponse")
// 直接next创建一个错误，并返回结果。
return next(new ErrorResponse("该角色只能创建一个机构", 511))
```

### <span id="4-2" class="title">4.2 异步中间件封装</span>

&emsp;&emsp;在操作数据库时通常会需要使用 try,catch，但是每一次操作都写一次会显得很麻烦，因此可以将整个接口函数放入异步 promise 中。

```js
// async.js
// 将接口函数传入，正常运行时执行函数，错误时走next
const asyncHandler = (fun) => (req, res, next) => {
	Promise.resolve(fun(req, res, next)).catch(next)
}
module.exports = asyncHandler

// camps_controllers.js
// 去掉之前的try catch,用时asyncHandler替代
exports.deletecamp = asyncHandler(async (req, res, next) => {
	const campData = await Camps.findByIdAndDelete(req.params.id)
	// 空数据返回报错
	if (!campData)
		return next(new ErrorResponse(`找不到ID: ${req.params.id}`, 510))

	res.status(200).json({
		success: true,
		data: {},
	})
})
```

### <span id="4-3" class="title">4.3 复杂查询中间件</span>

&emsp;&emsp;从课程查询和机构查询的接口中可以看出，两者查询的代码几乎是一致的，所以我们考虑将两者的代码结合起来，使结构更加清晰。

> 运行流程:
>
> 1. 监听到请求.
> 2. 执行 advanceResults 中间件.
> 3. 中间件根据参数查询数据库内容.
> 4. 结果存储到 req 中.
> 5. 接口函数返回查询结果。

**设计流程:**

1. 创建中间件文件:advcanceResults.js
2. 将相同代码放进中间件内，修改其中的模型变量，用参数表示。
3. 通过 res.advanceResult 返回结果。
4. 在路由中引入并使用中间件。
5. 在接口中去掉之前的代码，直接使用 res.advanceResult 作为返回结果。

### <span id="5" class="title">5 用户模型</span>

### <span id="5-1" class="title">5.1 密码加密</span>

&emsp;&emsp;在用户注册或者修改密码等需要对密码进行存储时，不会直接明文存储密码，而是对密码进行加密后在进行存储。

```js
// model_users.js
const bcrypt = require("bcryptjs")
// 保存信息时密码进行加密
userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSaltSync(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// 自定义方法 - 密码匹配
userSchema.methods.matchPassword = async function (enteredPsw) {
	return await bcrypt.compareSync(enteredPsw, this.password)
}
```

### <span id="5-2" class="title">5.2 token & cookie</span>

&emsp;&emsp;用户身份验证的令牌，某些接口请求时需要先验证用户信息，再决定是否允许执行接口函数。

```js
// index.js
// 配置cookie
const cookieParser = require("cookie-parser")
app.use(cookieParser())

// model_users.js
// 自定义方法 - 生成token
const jwt = require("jsonwebtoken")
userSchema.methods.getSignedToken = function () {
	// 1. 内容。 2. 自定义加密形式。 3. 加密方式&过期时间
	return jwt.sign(
		{
			id: this._id,
			name: this.name,
		},
		process.env.JWT_SECRET, // 环境变量
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	)
}

// controllers.js
// 封装函数 - 生成token并存储到cookie
const sendTokenRes = (user, statusCode, res) => {
	// 生成token - 调用自定义方法
	const token = user.getSignedToken()

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		), //30天过期
		httpOnly: true,
	}

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
	})
}
```

### <span id="5-3" class="title">5.3 数据关联</span>

&emsp;&emsp;机构数据，课程数据和评论都会包含 user 项，用于记录是哪个 user 创建的数据。 代码中用到 req.user 是在执行登录验证中间件后生成的数据，可以查看 6.1 的说明。

```js
// model_camps.js
// 加入user值
user: {
	type: mongoose.Schema.ObjectId,
	ref: "User",
	required: true
}

// camps_controllers.js
// 创建数据中加入:
req.body.user = req.user.id //加入用户id
// 如果用户是admin,那么可以创建多个机构信息，否则只能创建1个
const publishedCamp = await Camps.findOne({
	user: req.user.id
})
if (publishedCamp && req.user.role !== "admin")
	return next(new ErrorResponse("该角色只能创建一个机构", 511))
```

### <span id="6" class="title">6 用户鉴权</span>

### <span id="6-1" class="title">6.1 登录验证</span>

&emsp;&emsp;将用户分为登录和未登录，部分接口只能在登录状态下访问。通过 protect 中间件判断。

```js
// auth.js - 定义中间件方法
// 鉴权是否登录
exports.protect = asyncHandler(async (req, res, next) => {
	let token
	// 判断是否携带token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1]
	} else if (req.headers.cookie) {
		token = req.headers.cookie.split("=")[1]
	}
	// token不存在
	if (!token) return next(new ErrorResponse("无权访问", 530))
	try {
		// 解析token
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		// 查询用户
		let user = await User.findById(decoded.id)
		// 未找到用户
		if (!user) return next(new ErrorResponse("无权访问", 530))
		// 将user信息赋值给req，方便调用
		req.user = user
		next()
	} catch (error) {
		return next(new ErrorResponse("无权访问", 530))
	}
})

// 在需要保护的路由中引入protect,如:
// 会先执行protect里的内容，如果错误会直接next(error)，正确则next继续执行createcamp里的方法
router.route("/").post(protect, createcamp)
```

### <span id="6-2" class="title">6.2 身份验证</span>

&emsp;&emsp;部分接口仅能由部分身份的用户访问，所以除了检验是否登录外，还需要检验身份情况，即 admin 可以控制所有的数据，而 user 只能控制部分数据。同样通过中间件进行判断，放在 protect 后执行。

```js
// auth.js
// 通过用户角色，控制访问路由权限
exports.authoriza = (...roles) => {
	// roles: Array,将所有传进来的身份组合成一个数组，再判断该用户身份是否在数组中。
	return (req, res, next) => {
		// 用户的权限不包含在roles中，则无法访问路由
		if (!roles.includes(req.user.role))
			return next(new ErrorResponse("无权访问该路由", 524))
		next()
	}
}
// 调用时与portect类似
// 验证登录后会获取到用户的信息，再执行authoriza,此时会验证用户是否为admin或user,不满足条件时会直接返回提示。
router.route("/").post(protect, authoriza("admin", "user"), createcamp) //针对相同请求地址不同请求方式进行封装
```

### <span id="6-3" class="title">6.3 越级保护</span>

&emsp;&emsp;admin 可以修改 user 创建的信息，但是 user 不能修改 admin 创建的信息，同时 user 只能修改自己的数据，而不能修改其他 user 的数据。

```js
// 在请求接口函数中加入一段身份验证信息。
/*
	1. 查询对应数据。
	2. 判断数据的user是不是当前登录的user，或者是管理员。
*/
// 身份验证 - 如果是user则只能删除自己创建的课程
if (req.user.role !== "admin" && course.user.toString() !== req.user.id)
	return next(new ErrorResponse(`该用户无权限删除此课程`, 510))
```

### <span id="7" class="title">7 MongoDB 用法</span>

### <span id="7-1" class="title">7.1 连接</span>

```js
// db.js
const mongoose = require("mongoose")
const connectDB = async () => {
	const conn = await mongoose.connect(process.env.NET_MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	console.log(`MongoDB success: ${conn.connection.host}`.green.bold)
}
module.exports = connectDB

// index.js
// 引入数据库
const connectDB = require("./config/db")
// 连接数据库
connectDB()
```

### <span id="7-2" class="title">7.2 模型设计</span>

&emsp;&emsp;mongoDB 的特点在于提前为数据设好一个框架，随后直接调用方法进行操作，而不需要像 sql 一样写一窜语句。以评论信息模型为例：

```js
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewsSchema = new Schema({
	title: {
		type: String, // 类型
		required: [true, "请添加评论标题"], //是否必填，第二个参数为未填写时的错误提示
	},
	text: {
		type: String,
		required: [true, "请添加评论内容"],
	},
	rating: {
		type: Number,
		min: 1, // 最小值
		max: 10, // 最大值
		required: [true, "请评分，范围1-10分"],
		default: 10,
	},
	mscamp: {
		type: mongoose.Schema.ObjectId, //数据关联
		ref: "Camp", // 关联的其他模型
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})
/*
	enum: ["admin", "user", "visitor"], // 只能包含其中字段
	default: "user", // 默认值
	select: false // 查询时是否返回
*/
module.exports = mongoose.model("Review", reviewsSchema)

// 前置钩子函数 - 执行响应操作前会执行
// 添加用户时对密码进行加密
userSchema.pre("save", async function (next) {
	// 不能用箭头函数，this指向当前数据
	const salt = await bcrypt.genSaltSync(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// 自定义方法
// 密码匹配
userSchema.methods.matchPassword = async function (enteredPsw) {
	return await bcrypt.compareSync(enteredPsw, this.password)
}
```

### <span id="7-3" class="title">7.3 常用操作方法</span>

```js
// 以 user模型为例子
const User = require(模型路径)

// 添加数据
User.create(data)

// 删除数据1
User.findByIdAndDelete(id)
// 删除数据2
const user = User.findById(id)
user.remove()
// 删除数据3 - 批量删除满足条件的数据
User.deleteMany({name:***})

// 查找数据1 - 查询满足条件的所有数据
const user = User.find(条件)
// 查找数据2 - 查询单个
const user = User.findOne(条件)
const user = User.findById(id)

// 修改数据1
const user = User.findByIdAndUpdate(id,new Data,{
  new: true, //返回新的数据
  runValidators: true
})
// 修改数据2
const user = User.findById(id)
user.name = ***
user.save()

// 数据筛选与调整
// 只返回某些字段 - select("key1 key2 ..."),id必定会返回
const user = User.find(条件).select("name sex")

// 排序 - sort("key1 -key2 ...")
// 带 - 号表示逆序
const user = User.find(条件).sort("-createAt") // 按创建时间返回

// 分页 - skip & limit
const user = User.find(条件).skip(5).limit(5) //从第5条数据开始返回5条数据
const page = 5
const limit = 5
const startIndex = (page - 1) * limit
User.find(条件).skip(startIndex).limit(limit) //返回第5页的数据，每页5条
```
