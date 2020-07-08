const express = require("express")
const app = express()
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")

const expressLayouts = require("express-ejs-layouts")
// 设置ejs
app.use(expressLayouts)
app.set("view engine", "ejs")

// 数据库
const mongoose = require("mongoose")
// dbConfig
const db = require("./config/keys").mongoURI

// 连接数据库
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("数据库连接成功")
  })
  .catch((err) => console.log(err))


// body parser配置
app.use(express.urlencoded({
  extended: false
}))
// 设置express-seesion
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}))
// 设置connect flash
app.use(flash())

// 设置全局变量显示内存提示
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
})

// passport配置
require('./config/passport')(passport);
// passport 中间件
app.use(passport.initialize());
app.use(passport.session());

// 使用路由
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`server is running in ${PORT}`))