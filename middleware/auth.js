const User = require("../models/model_users")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const jwt = require("jsonwebtoken")

// 鉴权是否登录
exports.protect = asyncHandler(async (req, res, next) => {
  let token
  // 判断是否携带token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  } else if (req.headers.cookie) {
    token = req.headers.cookie.split("=")[1]
  }
  // 校验token是否存在
  if (!token)
    return next(new ErrorResponse("无权访问 - token错误", 530))
  try {
    // 解析token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // 查询用户
    let user = await User.findById(decoded.id)
    if (!user)
      return next(new ErrorResponse("无权访问 - 用户不存在", 530))
    req.user = user
    next()
  } catch (error) {
    return next(new ErrorResponse("无权访问", 530))
  }
})

// 通过用户角色，控制访问路由权限
exports.authoriza = (...roles) => {
  // roles: Array,包含所有传进来的参数
  return (req, res, next) => {
    // 用户的权限不包含在roles中，则无法访问路由
    if (!roles.includes(req.user.role))
      return next(new ErrorResponse("无权访问该路由", 524))
    next()
  }
}