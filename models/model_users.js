const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, "请添加名字"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "请填写邮箱"],
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"请填写正确的邮箱地址",
		],
	},
	password: {
		type: String,
		required: [true, "请添加密码"],
		minlength: 6,
		select: false
	},
	role: {
		// 通常会自己先加一个admin，后续代码将admin删除掉
		type: String,
		enum: ["admin", "user", "visitor"],
		default: "user",
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

// 添加用户时对密码进行加密
userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSaltSync(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// 密码匹配
userSchema.methods.matchPassword = async function (enteredPsw) {
	return await bcrypt.compareSync(enteredPsw, this.password)
}

// 自定义方法 - 生成token
userSchema.methods.getSignedToken = function () {
	// 1. 内容。 2. 自定义加密形式。 3. 加密方式&过期时间
	return jwt.sign({
			id: this._id,
			name: this.name,
		},
		process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRE,
		}
	)
}

module.exports = mongoose.model("User", userSchema)