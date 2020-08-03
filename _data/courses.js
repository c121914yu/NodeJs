const Course = require("../models/Course.js");
const Mscamp = require("../models/Mscamp.js");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");

/**
 * @desc    获取所有课程数据
 * @route   GET /api/v1/courses
 * @route   GET /api/v1/mscamps/:mscampId/courses
 * @access  公开的
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.mscampId) {
    const courses = await Course.find({
      mscamp: req.params.mscampId
    });
    return res
      .status(200)
      .json({
        success: true,
        count: courses.length,
        data: courses
      });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @desc    根据ID获取某个课程数据
 * @route   GET /api/v1/courses/:id
 * @access  公开的
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "Camp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course
  });
});

/**
 * @desc    添加课程数据
 * @route   POST /api/v1/mscamps/:mscampId/courses
 * @access  private
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.mscamp = req.params.mscampId;
  req.body.user = req.user.id;
  // 先查询米修机构的数据是否存在
  const mscamp = await Mscamp.findById(req.params.mscampId);

  // 没查到,返回错误信息
  if (!mscamp) {
    return next(
      new ErrorResponse(
        `Resource not found with id of ${req.params.mscampId}`,
        404
      )
    );
  }

  // 确定当前的id和登录的用户id是一致的
  if (mscamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`该用户${req.user.id}无权限删除此数据`, 401));
  }

  // 查到有mscamp数据,然后追加课程数据
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

/**
 * @desc    根据id更新课程数据
 * @route   PUT /api/v1/course/:id
 * @access  private
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  // 确定当前的id和登录的用户id是一致的
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`该用户${req.user.id}无权限更新此课程数据`, 401)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

/**
 * @desc    根据id删除课程数据
 * @route   DELETE /api/v1/courses/:id
 * @access  private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  // 确定当前的id和登录的用户id是一致的
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`该用户${req.user.id}无权限删除此课程数据`, 401)
    );
  }

  course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});