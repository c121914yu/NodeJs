# 自定义命令行操作 mongoDB 数据库

1. 引入模块，连接数据库，搭建用户信息。
2. 实现增加用户，查询用户。
3. 实现删除用户，更新用户，所有用户信息功能并进行测试。
4. 通过 npm link 对项目进行整体测试。

## mongo 语法

**使用方法**:

1. 连接数据库
2. 创建数据表
3. 主程序引入数据表
4. 通过数据表.mongo 方法操作数据库

```js
// 连接数据库
/*
	path - mongoDB连接地址
*/
mongoose.connect(
	{ path },
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
)
// 创建用户信息框架
const customerScheam = mongoose.Schema({
	// 声明每一个数据的类型
	firstname: {
		type: String,
	},
})
module.exports = mongoose.model("Customer", customerScheam)

// 设引入数据表变量为customer
// 创建新数据
customer.create(data)

// 删除数据
customer.remove({ _id })

// 查询
customer.find() //查询全部
customer.find({ _id }) //指定id查找
customer.find(($or: [{ firstname: "string" }, { lastname: "string" }])) // 多条件查询

// 更新
customer.update({ _id }, data) //修改_id里的内容，用data替代
```

## commander，inquirer 库

```js
const program = require("commander")
const { prompt } = require("inquirer")
// 创建交互列表
const questions = [
	{
		type: "input",
		name: "firstname",
		message: "Customer First Name",
	},
	{
		type: "input",
		name: "lastname",
		message: "Customer Last Name",
	},
	{
		type: "input",
		name: "phone",
		message: "Customer Phone Number",
	},
	{
		type: "input",
		name: "email",
		message: "Customer Email Address",
	},
]
program
	.command("add") // 启动指令
	.alias("a") //简写
	.description("添加新用户") //描述
	.action(() => {
		//回调函数
		//交互界面,若不用交互界面直接调用函数
		prompt(questions).then((answers) => {
			addCustomer(answers)
		})
	})
```

## npm link 连接终端指令

```
// package.json
"bin": "./command.js",

// command.js
#!/usr/bin/env node
```
