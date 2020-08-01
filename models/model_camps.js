const mongoose = require("mongoose")
const Schema = mongoose.Schema

const campsSchema = new Schema({
  name: {
    type: String,
    required: [true, "请填写培训课程的名字"],
    unique: true,
    trim: true,
    maxLength: [50, "课程名字不能超过50个字"],
  },
  description: {
    type: String,
    required: [true, "请填写培训的课程描述"],
    maxlength: [500, "课程描述不能超过500个字"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "请填写合法的网址",
    ],
  },
  phone: {
    type: String,
    match: [/^[1][3,4,5,7,8][0-9]{9}$/, "请填写正确的手机号码"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "请填写正确的邮箱地址",
    ],
  },
  address: {
    type: String,
    default: "四川省成都市武侯区来福士T2办公区7层",
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "前端开发",
      "小程序开发",
      "后端开发",
      "跨平台开发",
      "数据分析",
      "数据挖掘",
      "人工智能",
    ],
  },
  online: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Camp", campsSchema)

// {
//   "_id": "5d713995b721c3bb38c1f5d0",
//   "user": "5d7a514b5d2c12c7449be045",
//   "name": "米修前端0基础训练营",
//   "description": "高中以上学历,有一些计算机基础知识,课程将会从最基础开始讲解,穿插实战巩固知识.最终达到企业的要求, 上岗工作!",
//   "website": "https://www.thenewstep.cn",
//   "phone": "17686668866",
//   "email": "27732357@qq.com",
//   "address": "四川省成都市武侯区来福士T2办公区7层",
//   "careers": ["前端开发", "小程序开发", "跨平台开发"],
//   "online": false,
//   "averageCost": 38
// },