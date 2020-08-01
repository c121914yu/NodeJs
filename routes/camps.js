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

// 路由根地址/api/v1/camps
// http://localhost:5000/api/v1/camps
router.route("/").get(getcamps).post(createcamp) //针对相同请求地址不同请求方式进行封装

// http://localhost:5000/api/v1/camps/:id
router.route("/:id").get(getcamp).put(updatecamp).delete(deletecamp)

// http://localhost:5000/api/v1/camps/test/test
router.get("/test/test", (req, res) => {
  res.send("test")
})

module.exports = router