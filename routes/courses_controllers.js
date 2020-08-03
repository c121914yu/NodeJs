// 引入数据模型
const Courses = require("../models/model_course")
const Camps = require("../models/model_camps")
// 引入自定义错误类
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

/*
  1. select - 选择指定字段
  2. sort - 按某个字段排序
  3. page & limit - 获取第N页，M条数据
  4. campsId - 获取特定camsId内的数据
  5. gt,gte,lt,lte,in - 条件筛选
*/

/*
 * @desc 获取所有课程
 * @route GET /api/v1/course
 * @route GET /api/v1/camps/:campsId/courses
 * @access 公开的
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResult)
})

/*
 * @desc 创建课程数据
 * @route POST /api/v1/camps/:campsId/courses
 * @access private
 */
exports.createCourse = asyncHandler(async (req, res, next) => {
  // 查询机构数据是否存在
  const mscamp = await Camps.findById(req.params.campsId)

  // 未查到，返回报错
  if (!mscamp)
    return next(new ErrorResponse(`该ID机构数据不存在: ${req.params.campsId}`, 510))

  // 查到有mscamp数据，追加课程数据
  const course = await Courses.create({
    ...req.body,
    mscamp: req.params.campsId
  })

  res.status(200).json({
    success: true,
    data: course
  })
})

/*
 * @desc 获取单个数据
 * @route POST /api/v1/course/:id
 * @access public
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate({
    path: "mscamp",
    select: "name description"
  })

  if (!course)
    return next(new ErrorResponse(`找不到该ID课程数据: ${req.params.id}`, 510))

  res.status(200).json({
    success: true,
    data: course
  })
})

/*
 * @desc 更新单个数据
 * @route PUT /api/v1/course/:id
 * @access private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //返回新的结果
    runValidators: true // 运行更新验证
  })

  if (!course)
    return next(new ErrorResponse(`找不该ID课程数据: ${req.params.id}`, 510))

  res.status(200).json({
    success: true,
    data: course,
  })
})

/*
 * @desc 删除数据
 * @route DELETE /api/v1/course/:id
 * @access private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findByIdAndDelete(req.params.id)

  if (!course)
    return next(new ErrorResponse(`找不该ID课程数据: ${req.params.id}`, 510))

  res.status(200).json({
    success: true,
    msg: course.title + " 课程删除成功",
    data: {},
  })
})