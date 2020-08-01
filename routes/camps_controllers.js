// 引入数据模型
const Camps = require("../models/model_camps")
/*
 * @desc 获取数据
 * @route GET /api/v1/camps
 * @access 公开的
 */
exports.getcamps = async (req, res, next) => {
  try {
    const campData = await Camps.find()
    res.status(200).json({
      success: true,
      count: campData.length,
      data: campData,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    })
  }
}
exports.createcamp = async (req, res, next) => {
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
  try {
    const camp = await Camps.create(req.body)
    res.status(200).json({
      success: true,
      data: camp,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
}
exports.getcamp = async (req, res, next) => {
  try {
    const campData = await Camps.findById(req.params.id)

    // 空数据返回报错
    if (!campData) {
      return res.status(400).json({
        success: false
      })
    }

    res.status(200).json({
      success: true,
      data: campData,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    })
  }
}
exports.updatecamp = async (req, res, next) => {
  try {
    const campData = await Camps.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //返回新的结果
      runValidators: true // 运行更新验证
    })
    res.status(200).json({
      success: true,
      data: campData,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    })
  }
}
exports.deletecamp = async (req, res, next) => {
  try {
    const campData = await Camps.findByIdAndDelete(req.params.id)

    // 空数据返回报错
    if (!campData) {
      return res.status(400).json({
        success: false
      })
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    })
  }
}