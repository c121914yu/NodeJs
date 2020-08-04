const express = require("express")
const router = express.Router()

const {
  getUsers,
  getUser,
  deleteUser,
  updateUser
} = require("./users_controllers")

// 封装查询
const advanceResults = require("../middleware/advanceResults")
const Users = require("../models/model_users")

// 路由鉴权
const {
  protect,
  authoriza,
} = require("../middleware/auth")

router.use(protect)
router.use(authoriza("admin"))

router.get("/", advanceResults(Users), getUsers)
router.route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = router