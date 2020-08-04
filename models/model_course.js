const mongoose = require("mongoose")
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, "请添加课程名字"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "请添加课程描述"],
  },
  weeks: {
    type: Number,
    required: [true, "请添加学习周期"],
  },
  tuition: {
    type: String,
    required: [true, "请添加课程价格"],
  },
  minimumSkill: {
    type: String,
    required: [true, "请添加课程等级"],
    enum: ["初级", "中级", "高级"]
  },
  mscamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Camp",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})


module.exports = mongoose.model("Course", courseSchema)