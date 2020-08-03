const express = require("express")
const router = express.Router()
// 引入控制器
const {
  getcamps,
  createcamp,
  getcamp,
  updatecamp,
  deletecamp
} = require("./camps_controllers.js")
// 路由重定向
const courses = require("./courses")
router.use("/:campsId/courses", courses)

// 封装查询
const advanceResults = require("../middleware/advanceResults")
const Camps = require("../models/model_camps")

// 路由根地址/api/v1/camps
// http://localhost:5000/api/v1/camps
router.route("/")
  .get(advanceResults(Camps, "courses"), getcamps)
  .post(createcamp) //针对相同请求地址不同请求方式进行封装

// http://localhost:5000/api/v1/camps/:id
router.route("/:id").get(getcamp).put(updatecamp).delete(deletecamp)

// http://localhost:5000/api/v1/camps/test/test
router.get("/test/test", (req, res) => {
  res.send("test")
})

module.exports = router