#!/usr/bin/env node

const program = require("commander")
const {
	addCustomer,
	findCustomer,
	findByID,
	updateCustomer,
	removeCustomer,
	listCustomer,
} = require("./mongo")

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

// 设置版本信息和描述信息
program.version("1.0.0").description("自定义命令行界面")

// 添加用户指令
// program
//   .command("add <firstname> <lastname> <phone> <email>")
//   .alias("a") //简写
//   .description("添加新用户") //描述
//   .action((firstname, lastname, phone, email) => {
//     addCustomer({
//       firstname,
//       lastname,
//       phone,
//       email
//     })
// })

// 添加用户 - 交互式
program
	.command("add") // 启动指令
	.alias("a") //简写
	.description("添加新用户") //描述
	.action(() => {
		//回调函数
		//交互界面
		prompt(questions).then((answers) => {
			addCustomer(answers)
		})
	})

// 查找用户指令
program
	.command("find <name>")
	.alias("f")
	.description("查找用户")
	.action((name) => findCustomer(name))

// 指定id查找
program
	.command("search <_id>")
	.alias("s")
	.description("ID查找用户")
	.action((_id) => {
		console.log("find")

		findByID(_id)
	})

// 删除
program
	.command("remove <_id>")
	.alias("r")
	.description("删除用户")
	.action((_id) => removeCustomer(_id))

// 更新
program
	.command("update <_id>")
	.alias("u")
	.description("更新用户")
	.action((_id) => {
		prompt(questions).then((answers) => {
			updateCustomer(_id, answers)
		})
	})

// 所有用户
program
	.command("list")
	.alias("l")
	.description("获取所有用户")
	.action(() => listCustomer())

// 测试命令
program.parse(process.argv)
