// 引入数据模型
const User = require("../models/model_users")
// 引入自定义错误类
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const {
  use
} = require("./auth")

/*
 * @desc 获取所有用户
 * @route GET /api/v1/auth/users
 * @access private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResult)
})

/*
 * @desc 获取单个用户
 * @route GET /api/v1/auth/users/:id
 * @access private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user)
    return next(new ErrorResponse("该用户不存在", 520))
  res.status(200).json({
    success: true,
    data: user
  })
})

/*
 * @desc 修改用户信息
 * @route PUT /api/v1/users/:id
 * @access private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id)
  if (!user)
    return next(new ErrorResponse("用户不存在", 523))

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: user
  })
})

/*
 * @desc 删除用户
 * @route DELETE /api/v1/users/:id
 * @access private
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  if (req.params.id === req.user.id)
    return next(new ErrorResponse("无法删除管理员", 523))
  const user = await User.findById(req.params.id)
  if (!user)
    return next(new ErrorResponse("用户不存在", 523))
  user.remove()
  res.status(200).json({
    success: true,
    msg: "用户删除成功: " + user.name
  })
})