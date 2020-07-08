// 本地验证策略
const localStrategy = require("passport-local").Strategy
const users = require("../modules/user")
const bcrypt = require("bcryptjs")

module.exports = function (passport) {
  passport.use(
    new localStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      // 匹配用户
      users.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, {
            message: "用户不存在"
          })
        } else {
          // 匹配密码
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
              return done(null, user)
            } else
              return done(null, false, {
                message: "密码错误"
              })
          })
        }
      })
    })
  )
  // 序列化和反序列化
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    users.findById(id, function (err, user) {
      done(err, user);
    });
  });
}