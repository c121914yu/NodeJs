// 引入数据模型
const Camps = require("../models/model_camps")
// 引入自定义错误类
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
/*
 * @desc 获取数据
 * @route GET /api/v1/camps
 * @access 公开的
 */
exports.getcamps = asyncHandler(async (req, res, next) => {
  /*
   * gt: greater than 大于
   * gte 大于等于
   * lt 小于
   * lte 小于等于
   * in 在数组中,需要是数组类型
   */
  //console.log(req.query) //获取?后参数

  // 清除关键字及值
  let reqQuery = {
    ...req.query
  }
  const removeFileds = ["select", "sort", "page", "limit"]
  removeFileds.forEach(param => delete reqQuery[param])

  // let queryStr = JSON.stringify(reqQuery)
  // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // 查询所有数据
  let query = Camps.find(reqQuery)

  // 在获取到的所有数据上加条件
  //筛选key值
  if (req.query.select) {
    let select = req.query.select.split(",").join(' ')
    query.select(select)
  }
  //排序
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(' ')
    query = query.sort(sortBy) // 例如averageCost，则是价格由小到大，-averageCost价格由大到小
  } else { //默认按时间排序
    query.sort("-createdAt") //由大到小，即时间越新越在前
  }

  // 分页
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 2
  const startIndex = (page - 1) * limit
  query.skip(startIndex).limit(limit)
  // 记录上一页与下一页
  const total = await Camps.countDocuments()
  const endIndex = page * limit
  let pagination = {
    limit
  }
  pagination.prev = startIndex > 0 ? page - 1 : page
  pagination.next = endIndex < total ? page + 1 : page

  const campData = await query
  res.status(200).json({
    success: true,
    count: campData.length,
    pagination,
    data: campData,
  })
})
exports.createcamp = asyncHandler(async (req, res, next) => {
  // 写法1
  // Camps.create(req.body).then(data => {
  //   res.status(200).json({
  //     success: true,
  //     data: data,
  //   })
  // }).catch(err => {
  //   res.status(400).json({
  //     success: false,
  //     err
  //   })
  // })

  // 写法2
  const camp = await Camps.create(req.body)
  res.status(200).json({
    success: true,
    data: camp,
  })
})
exports.getcamp = asyncHandler(async (req, res, next) => {
  // try {
  const campData = await Camps.findById(req.params.id)

  // 空数据返回报错
  if (!campData)
    return next(new ErrorResponse(`找不到ID: ${req.params.id}`, 510))

  res.status(200).json({
    success: true,
    data: campData,
  })
  // } catch (error) {
  //   // res.status(400).json({
  //   //   success: false,
  //   //   error
  //   // })
  //   // next(new ErrorResponse(`Resoure not fount width id of ${req.params.id}`, 510))
  //   next(error)
  // }
})
exports.updatecamp = asyncHandler(async (req, res, next) => {
  const campData = await Camps.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //返回新的结果
    runValidators: true // 运行更新验证
  })

  if (!campData)
    return next(new ErrorResponse(`找不到ID: ${req.params.id}`, 510))

  res.status(200).json({
    success: true,
    data: campData,
  })
})
exports.deletecamp = asyncHandler(async (req, res, next) => {
  const campData = await Camps.findByIdAndDelete(req.params.id)
  // 空数据返回报错
  if (!campData)
    return next(new ErrorResponse(`找不到ID: ${req.params.id}`, 510))

  res.status(200).json({
    success: true,
    data: {},
  })
})