const mongoose = require("mongoose")

// 创建用户信息框架
const customerScheam = mongoose.Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  }
})

module.exports = mongoose.model("Customer", customerScheam)