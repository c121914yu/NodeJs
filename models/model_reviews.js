const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewsSchema = new Schema({
  title: {
    type: String,
    required: [true, "请添加评论标题"],
  },
  text: {
    type: String,
    required: [true, "请添加评论内容"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "请评分，范围1-10分"],
    default: 10
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


module.exports = mongoose.model("Review", reviewsSchema)