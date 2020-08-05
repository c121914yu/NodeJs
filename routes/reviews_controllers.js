// 引入数据模型
const Review = require("../models/model_reviews")
const Camps = require("../models/model_camps")
// 引入自定义错误类
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

/*
 * @desc 获取所有评论信息
 * @route GET /api/v1/reviews
 * @route GET /api/v1/camps/:campsId/reviews
 * @access public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResult)
})

/*
 * @desc 获取某条评论信息
 * @route GET /api/v1/reviews/:id
 * @access public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  if (!review)
    return next(new ErrorResponse("该评论不存在", 530))
  res.status(200).json({
    succcess: true,
    data: review
  })
})

/*
 * @desc 创建评论
 * @route POST /api/v1/camps/:campsId/reviews
 * @params
 *  title: String
 *  text: String
 *  rating: Number
 * @access private
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  // 查询机构数据是否存在
  const mscamp = await Camps.findById(req.params.campsId)

  // 未查到，返回报错
  if (!mscamp)
    return next(new ErrorResponse(`该ID机构数据不存在: ${req.params.campsId}`, 510))

  // 查到有mscamp数据，追加课程数据
  req.body.user = req.user.id
  req.body.mscamp = req.params.campsId
  const review = await Review.create(req.body)

  res.status(200).json({
    success: true,
    data: review
  })
})

/*
 * @desc 更新单个评论
 * @route PUT /api/v1/reviews/:id
 * @access private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review)
    return next(new ErrorResponse(`找不该ID评论: ${req.params.id}`, 510))

  // 身份验证 - 如果是user则只能修改自己的评论
  if (req.user.role !== "admin" && review.user.toString() !== req.user.id)
    return next(new ErrorResponse(`该用户无权限更新此评论`, 510))

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //返回新的结果
    runValidators: true // 运行更新验证
  })

  res.status(200).json({
    success: true,
    data: review,
  })
})

/*
 * @desc 删除评论
 * @route DELETE /api/v1/reviews/:id
 * @access private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review)
    return next(new ErrorResponse(`找不该ID课程数据: ${req.params.id}`, 510))

  // 身份验证 - 如果是user则只能删除自己的评论
  if (req.user.role !== "admin" && review.user.toString() !== req.user.id)
    return next(new ErrorResponse(`该用户无权限删除此评论`, 510))

  review.remove()

  res.status(200).json({
    success: true,
    msg: review.title + " 评论删除成功",
  })
})