// 确保用户认证
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    // 是否包含验证信息
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', '请先登录以便查看更多...');
    res.redirect('/users/login');
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }

    res.redirect('/dashboard');
  }
};