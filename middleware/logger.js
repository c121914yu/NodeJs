// 创建中间件
const logger = (req, res, next) => {
  // 方法，协议，主机
  // GET http://localhost:5000/api/v1/camps 
  console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`);
  next()
}
module.exports = logger