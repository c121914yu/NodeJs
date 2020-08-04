const express = require("express")
// mergeParams合并参数，用于重定向
const router = express.Router({
  mergeParams: true
})
// 引入控制器
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("./courses_controllers.js")

// 路由鉴权
const {
  protect,
  authoriza
} = require("../middleware/auth")

// 封装查询
const advanceResults = require("../middleware/advanceResults")
const Course = require("../models/model_course")

// http://localhost:5000/api/v1/course
router.route("/")
  .get(advanceResults(Course, {
    path: "mscamp",
    select: "name description",
  }), getCourses)
  .post(protect, authoriza("admin", "user"), createCourse)

// http://localhost:5000/api/v1/course/:id
router.route("/:id")
  .get(getCourse)
  .put(protect, authoriza("admin", "user"), updateCourse)
  .delete(protect, authoriza("admin", "user"), deleteCourse)

module.exports = router