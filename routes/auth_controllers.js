// 引入数据模型
const User = require("../models/model_users")
// 引入自定义错误类
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

/*
 * @desc 注册用户
 * @route POST /api/v1/auth/register
 * @param:
 *  name: String
 *  email: Email,
 *  password: String,
 * @access public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    role,
    password
  } = req.body

  // 注册用户
  const user = await User.create({
    name,
    email,
    role,
    password,
  })

  sendTokenRes(user, 200, res)
})

/*
 * @desc 登录
 * @route POST /api/v1/auth/login
 * @param:
 *  email: Email,
 *  password: String,
 * @access public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const {
    email,
    password
  } = req.body

  if (!email || !password)
    return next(new ErrorResponse("请填写邮箱和密码", 520))

  // 查询用户
  let user = await User.findOne({
    email
  }).select("+password")
  if (!user)
    return next(new ErrorResponse("该邮箱未注册", 521))

  const isMatch = await user.matchPassword(password)
  if (!isMatch)
    return next(new ErrorResponse("密码错误", 522))

  sendTokenRes(user, 200, res)
})

/*
 * @desc 获取用户个人信息
 * @route GET /api/v1/auth/me
 * @param:
 *  email: Email,
 *  password: String,
 * @access private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  let user = req.user
  if (!user)
    return next(new ErrorResponse("用户不存在", 523))
  res.status(200).json({
    success: true,
    user
  })
})

/*
 * @desc 更新个人信息
 * @route PUT /api/v1/auth/updatedetails
 * @param:
 *  email: Email,
 *  password: String,
 * @access private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  let filedsToUpdate = {}
  if (req.body.name)
    filedsToUpdate.name = req.body.name
  if (req.body.email)
    filedsToUpdate.email = req.body.email

  const user = await User.findByIdAndUpdate(req.user.id, filedsToUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    user
  })
})

/*
 * @desc 更新密码
 * @route PUT /api/v1/auth/updatepassword
 * @param:
 *  email: Email,
 *  password: String,
 * @access private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  // 旧密码 && 新密码
  const user = await User.findById(req.user.id).select("+password")

  // 判断旧密码是否正确
  if (!(await user.matchPassword(req.body.currentPassword)))
    return next(new ErrorResponse("旧密码错误", 524))
  // 存储新密码
  user.password = req.body.newPassword
  await user.save()

  sendTokenRes(user, 200, res)
})

/*
 * @desc 忘记密码
 * @route POST /api/v1/auth/forgetpassword
 * @param:
 *  email: Email,
 * @access public
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 根据email获取用户信息
  const user = await User.findOne({
    email: req.body.email
  }).select("+password")

  if (!user)
    return next(new ErrorResponse("用户不存在", 511))

  // 设置user的reset参数
  const resetToken = crypto.randomBytes(20).toString("hex")
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  user.resetPasswordExpire = Date.now() + 2 * 60 * 1000

  // 发送邮件，包含重置密码的地址
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`
  const message = `你正在重置密码，请点击链接: ${resetUrl}`

  // 调用发送
  try {
    await sendEmail({
      email: user.email,
      subject: "重置密码",
      message
    })
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    return next(new ErrorResponse("邮件发送失败", 526))
  }

  // 存储 - 不进行格式校验
  await user.save({
    validateBeforeSave: false
  })

  res.status(200).json({
    success: true,
    resetToken
  })
})

/*
 * @desc 重置密码
 * @route PUT /api/v1/auth/resetpassword/:token
 * @param:
 *  password: password,
 * @access public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 加密token，使其与数据库中的相同
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
  // 查询数据库中的角色
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { //有效时间大于现在
      $gt: Date.now()
    }
  })

  if (!user)
    return next(new ErrorResponse("该链接已过期", 527))

  // 重置密码
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  sendTokenRes(user, 200, res)
})

// 生成token并存储到cookie
const sendTokenRes = (user, statusCode, res) => {
  // 生成token
  const token = user.getSignedToken()

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), //30天过期 
    httpOnly: true
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token
    })
}