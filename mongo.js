const mongoose = require("mongoose")

// 连接数据库
mongoose.connect(
	"mongodb+srv://c121914:121914yu@cluster0.hn4j1.mongodb.net/Cluster0?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
)

// 引入customer模块
const Customer = require("./customers")

// 添加用户
const addCustomer = (customer) => {
	Customer.create(customer)
		.then((res) => {
			console.info("新用户已添加...")
			mongoose.connection.close()
		})
		.catch((err) => {
			console.error(err)
			mongoose.connection.close()
		})
}

// 查找用户
const findCustomer = (name) => {
	// 不区分大小写
	const search = new RegExp(name, "i")
	Customer.find({
		// 或条件查询
		$or: [
			{
				firstname: search,
			},
			{
				lastname: search,
			},
		],
	})
		.then((customer) => {
			console.info(customer)
			console.info(`${customer.length} 个匹配`)
			mongoose.connection.close()
		})
		.catch((err) => {
			mongoose.connection.close()
		})
}
// id查找
const findByID = (_id) => {
	Customer.find({_id})
	.then(res => {
		console.log(res)
		mongoose.connection.close()
	})
	.catch((err) => {
		mongoose.connection.close()
	})
}

// 更新用户
const updateCustomer = (_id, customer) => {
	Customer.update({ _id }, customer).then((res) => {
		console.info("用户信息已经更新...")
		mongoose.connection.close()
	})
}

// 删除用户
const removeCustomer = (_id) => {
	Customer.remove({ _id }).then((res) => {
		console.info("用户已删除...")
		mongoose.connection.close()
	})
}

// 获取所有用户
// 查找用户
const listCustomer = (name) => {
	Customer.find().then((customer) => {
		console.info(customer)
		console.info(`${customer.length} 个用户`)
		mongoose.connection.close()
	})
}

// 输出方法
module.exports = {
	addCustomer,
	findCustomer,
	findByID,
	updateCustomer,
	removeCustomer,
	listCustomer,
}
