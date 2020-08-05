const express = require("express")
const router = express.Router()
// 引入控制器
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgetPassword,
  resetPassword
} = require("./auth_controllers.js")

// 路由鉴权
const {
  protect,
} = require("../middleware/auth")

router.post("/register", register)
router.post("/login", login)
router.post("/forgetpassword", forgetPassword)
router.get("/me", protect, getMe)
router.put("/updatedetails", protect, updateDetails)
router.put("/updatepassword", protect, updatePassword)
router.put("/resetPassword/:token", resetPassword)

module.exports = router