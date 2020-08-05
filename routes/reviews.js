const express = require("express")
// mergeParams合并参数，用于重定向
const router = express.Router({
  mergeParams: true
})
// 引入控制器
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require("./reviews_controllers.js")

// 路由鉴权
const {
  protect
} = require("../middleware/auth")

// 封装查询
const advanceResults = require("../middleware/advanceResults")
const Review = require("../models/model_reviews")

// http://localhost:5000/api/v1/reviews
router.route("/")
  .get(advanceResults(Review, {
    path: "mscamp",
    select: "name description",
  }), getReviews)
  .post(protect, createReview)

router.route("/:id")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview)

module.exports = router