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

### 2.1 路由重定向

```js
// camps.js
// 路由重定向,引入course路由
//当请求地址为http://localhost:5000/api/v1/camps/:campsId/courses时跳转到course中路由
const courses = require("./courses")
router.use("/:campsId/courses", courses)

// course.js
// mergeParams合并参数，用于重定向.若不指定无法获取其他路由跳转过来的参数
const router = express.Router({
	mergeParams: true,
})
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

### 3.1 自定义错误中间件

```js
// 创建自定义错误类，在其他文件引用使用
class ErrorResponse extends Error {
	constructor(message, statusCode) {
		super(message)
		this.statusCode = statusCode
	}
}
```

### 3.2 异步中间件封装

```js
// async.js
// 将接口函数传入，正常运行时执行函数，错误时走next
const asyncHandler = (fun) => (req, res, next) => {
	Promise.resolve(fun(req, res, next)).catch(next)
}
module.exports = asyncHandler

// controllers.js
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

### 3.3 复杂查询中间件

从课程查询和机构查询的接口中可以看出，两者查询的代码几乎是一致的，所以我们考虑将两者的代码结合起来，使结构更加清晰。

1. 创建中间件文件:advcanceResults.js
2. 将相同代码放进中间件内，修改其中的模型变量，用参数表示。
3. 通过 res.advanceResult 返回结果。
4. 在路由中引入并使用中间件。
5. 在接口中去掉之前的代码，直接使用 res.advanceResult 作为返回结果。

## 4. 复杂 mongo 查询

请求地址:

> \*\*\*?select=name,averageCost&page=2&limit=3 - 从第 2 页开始筛选 3 条数据，并只要 name 跟 averageCost 字段。

> \*\*\*?select=name,averageCost&averageCost[$gte]=50&limit=5 - 筛选前 5 条 averageCost>=50 的数据，并只要 name 跟 averageCost 字段。

> \*\*\*?careers[$in]=人工智能&averageCost[$gte]=50&limit=5 - 筛选 5 条 careers 包含“人工智能”，且 averageCost>=50 的数据。

### 4.1 条件查询

```js
/*
	mongo条件查询,但是要求在符号前加入$,例如: averageCost:{$gt:50}
	通过req.query获取，请求地址后加入参数: averageCost[$gte]=50
 * $gt: greater than 大于
 * $gte 大于等于
 * $lt 小于
 * $lte 小于等于
 * $in 在数组中,key需要是数组类型
 */
```

### 4.2 筛选 key 值 - select

```js
// 注意需要先获取数据在进行筛选，即需要先find,但此时find不能包含Select关键字，顾需要去除
if (req.query.select) {
	let select = req.query.select.split(",").join(" ") //"name _id ...."形式，默认是逗号隔开
	query.select(select)
}
```

### 4.3 排序 - sort

```js
if (req.query.sort) {
	let sortBy = req.query.sort.split(",").join(" ")
	query = query.sort(sortBy) // 例如averageCost，则是价格由小到大，-averageCost价格由大到小
} else {
	//默认按时间排序
	query.sort("-createdAt") //由大到小，即时间越新越在前
}
```

### 4.4 分页 - page&limit

```js
const page = parseInt(req.query.page, 10) || 1
const limit = parseInt(req.query.limit, 10) || 2
const startIndex = (page - 1) * limit
query.skip(startIndex).limit(limit) //从startIndex下标开始查询，查询limit条数据
// 记录上一页与下一页
const total = await Camps.countDocuments() //获取总数据长度
const endIndex = page * limit
let pagination = {
	limit,
}
pagination.prev = startIndex > 0 ? page - 1 : page
pagination.next = endIndex < total ? page + 1 : page
```

### 4.5 关联查询 - populate

```js
// courses_controllers.js
// 由于courses是后续添加的数据，camps为1级数据，所以course可以自动关联camps
// 会在mscamp中打印相应camsId的1级数据
query = Courses.find(reqQuery).populate({
	path: "mscamp",
	select: "name description",
})

// camps_controllers.js
// 直接使用populate关联无效，需要在模型中进行配置
let query = Camps.find(reqQuery).populate("courses")

// model_camps.js
// 1. 在schema后添加
{
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}

// 配置virtuals
campsSchema.virtual("courses", {
  ref: "Course", // 关联的模型名
  localField: "_id", // 自身需要关联的标识符
  foreignField: "mscamp", // 关联模型存储自身的标识符key值
  justOne: false // 多个数据
})
```

### 4.6 连带删除 - 前置钩子周期函数

前面提到，camps 为 1 级数据，course 为 2 级数据，当删除 camps 时，我们希望可以将其相关联的 course 一起删除掉。

```js
// model_camps.js
// 配置前置钩子,用于连带删除.remove钩子函数特制删除数据，会将执行该钩子的数据删掉后再执行函数内容
campsSchema.pre("remove", async function (next) {
	// this._id - 当前数据的ID值
	// this.model("Course") 获取到Course模型
	await this.model("Course").deleteMany({
		mscamp: this._id,
	})
	next()
})

// camps_controllers.js
// 去掉之前findByIdAndDelete方法，变成先找到数据，再执行删除函数
const campData = await Camps.findById(req.params.id)
// 执行前置钩子周期,remove会默认删除当前数据，并执行一些其他方法
campData.remove()
```

## 5. 用户模型

### 5.1 密码加密

在创建用户时对用户输入的密码进行加密。

```js
// model_users.js
const bcrypt = require("bcryptjs")
// 添加用户时对密码进行加密
userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSaltSync(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// 自定义方法 - 密码匹配
userSchema.methods.matchPassword = async function (enteredPsw) {
	return await bcrypt.compareSync(enteredPsw, this.password)
}
```

### 5.2 token && cookie'

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
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	)
}

// controllers.js
// 生成token并存储到cookie
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

### 5.3 数据关联

机构数据和课程数据都会包含一个 user 属性，用于记录是哪个 user 创建的数据，此时需要关联。

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

## 6. 用户鉴权

### 6.1 登录保护

将用户分为登录和未登录，部分接口只能在登录状态下访问。通过 protect 中间件判断。

```js
// auth.js
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
	// 校验token是否存在
	if (!token) return next(new ErrorResponse("无权访问", 530))
	try {
		// 解析token
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		// 查询用户
		let user = await User.findById(decoded.id)
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

### 6.2 身份验证

部分接口仅能由部分身份的用户访问，所以除了检验是否登录外，还需要检验身份情况。同样通过中间件进行判断，放在 protect 后执行。

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

### 6.3 越级保护

admin 可以修改 user 创建的信息，但是 user 不能修改 admin 创建的信息。

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
