const advanceResult = (model, populate) => async (req, res, next) => {
  // 清除关键字及值
  let reqQuery = {
    ...req.query
  }
  const removeFileds = ["select", "sort", "page", "limit"]
  removeFileds.forEach(param => delete reqQuery[param])

  // 查询所有数据
  let query
  // 含campsId时添加限定条件
  if (req.params.campsId) {
    query = model.find({
      mscamp: req.params.campsId,
      ...reqQuery
    })
  } else
    query = model.find(reqQuery)

  // 在获取到的所有数据上加条件
  //筛选key值
  if (req.query.select) {
    let select = req.query.select.split(",").join(' ')
    query.select(select)
  }
  //排序
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(' ')
    query.sort(sortBy) // 例如averageCost，则是价格由小到大，-averageCost价格由大到小
  } else { //默认按时间排序
    query.sort("-createdAt") //由大到小，即时间越新越在前
  }

  // 分页
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 5
  const startIndex = (page - 1) * limit
  query.skip(startIndex).limit(limit)
  // 记录上一页与下一页
  const total = await model.countDocuments()
  const endIndex = page * limit
  let pagination = {
    limit
  }
  pagination.prev = startIndex > 0 ? page - 1 : page
  pagination.next = endIndex < total ? page + 1 : page

  if (populate) {
    query.populate(populate)
  }

  const results = await query

  res.advanceResult = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  }
  next()
}

module.exports = advanceResult