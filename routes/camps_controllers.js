// 引入数据模型
const Camps = require("../models/model_camps")
// 引入自定义错误类
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

/*
  1. select - 选择指定字段
  2. sort - 按某个字段排序
  3. page & limit - 获取第N页，M条数据
  4. campsId - 获取特定camsId内的数据
  5. gt: greater than 大于
  6. gte 大于等于
  7. lt 小于
  8. lte 小于等于
  9. in 在数组中,需要是数组类型
 */

/*
 * @desc 获取所有数据
 * @route GET /api/v1/camps
 * @access public
 */
exports.getcamps = asyncHandler(async (req, res, next) => {
  //console.log(req.query) //获取?后参数
  res.status(200).json(res.advanceResult)
})

/*
 * @desc 创建数据
 * @route POST /api/v1/camps
 * @access private
 */
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

/*
 * @desc 获取单个数据
 * @route GET /api/v1/camps/:id
 * @access public
 */
exports.getcamp = asyncHandler(async (req, res, next) => {
  // try {
  const campData = await Camps.findById(req.params.id).populate("courses")

  // 空数据返回报错
  if (!campData)
    return next(new ErrorResponse(`找不该ID机构数据: ${req.params.id}`, 510))

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

/*
 * @desc 更新单个数据
 * @route PUT /api/v1/camps/:id
 * @access private
 */
exports.updatecamp = asyncHandler(async (req, res, next) => {
  const campData = await Camps.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //返回新的结果
    runValidators: true // 运行更新验证
  })

  if (!campData)
    return next(new ErrorResponse(`找不该ID机构数据: ${req.params.id}`, 510))

  res.status(200).json({
    success: true,
    data: campData,
  })
})

/*
 * @desc 删除数据，同时删除相关联课程
 * @route DELETE /api/v1/camps/:id
 * @access private
 */
exports.deletecamp = asyncHandler(async (req, res, next) => {
  // const campData = await Camps.findByIdAndDelete(req.params.id)
  const campData = await Camps.findById(req.params.id)
  // 空数据返回报错
  if (!campData)
    return next(new ErrorResponse(`找不该ID机构数据: ${req.params.id}`, 510))

  // 执行前置钩子周期,remove会默认删除当前数据，并执行一些其他方法
  campData.remove()

  res.status(200).json({
    success: true,
    msg: course.name + " 机构删除成功",
    data: {},
  })
})