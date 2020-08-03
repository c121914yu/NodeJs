const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {
  // console.log(err);
  // id数据源报错
  if (err.name === "CastError") { // catch跳出报错
    const msg = `ID格式错误,id: ${err.value}`
    err = new ErrorResponse(msg, 511)
  }

  // 字段重复
  else if (err.code === 11000) { // catch跳出报错
    const msg = `${Object.keys(err.keyValue).map(val => val)}字段重复`
    err = new ErrorResponse(msg, 520)
  }
  // 校验失败
  else if (err.name === "ValidationError") { // catch跳出报错
    const msg = Object.values(err.errors).map(val => val.message)
    err = new ErrorResponse(msg, 511)
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "请求错误"
  })
}

module.exports = errorHandler