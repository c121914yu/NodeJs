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

// 封装查询
const advanceResults = require("../middleware/advanceResults")
const Course = require("../models/model_course")

// http://localhost:5000/api/v1/course
router.route("/")
  .get(advanceResults(Course, {
    path: "mscamp",
    select: "name description",
  }), getCourses)
  .post(createCourse)

// http://localhost:5000/api/v1/course/:id
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router