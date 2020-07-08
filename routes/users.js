const express = require("express")
const passport = require("passport")
const router = express.Router()
// 用户模型
const users = require("../modules/user")

const bcrypt = require("bcryptjs")
const {
  route
} = require(".")

router.get("/login", (req, res) => {
  res.render("login")
})
router.get("/register", (req, res) => {
  res.render("register")
})

// 注册页
router.post("/register", (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body
  // 错误处理
  let errors = []
  // 验证所有内容
  if (!name || !email || !password || !password2)
    errors.push({
      msg: "请输入所有内容"
    })
  if (password != password2)
    errors.push({
      msg: "两次密码不一致"
    })
  if (password.length < 6)
    errors.push({
      msg: "密码长度应大于6位"
    })

  // 判断是否有错误
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    // 检测是否存在数据库
    users.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: "邮箱已存在"
        })
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const salt = bcrypt.genSaltSync(10)
        const newUser = new users({
          name,
          email,
          password: bcrypt.hashSync(password, salt),
        })
        // 保存数据库中
        newUser.save().then(data => {
            req.flash("success_msg", "您已完成注册，可以进行登录")
            console.log("注册成功");
            res.redirect("/users/login")
          })
          .catch(err => console.log(err))
      }
    })
  }

})

// 登录验证
router.post("/login", (req, res, next) => {
  // 使用本地验证方案
  passport.authenticate("local", {
    successRedirect: "/dashboard", //成功跳转
    failureRedirect: "/users/login", //失败跳转
    failureFlash: true
  })(req, res, next)
})

// login out
router.get("/logout", (req, res) => {
  req.logOut()
  req.flash("success_msg", "已退出登录")
  res.redirect("/users/login")
})

module.exports = router