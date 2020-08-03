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
