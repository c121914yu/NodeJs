const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

dotenv.config({
  path: "./config/config.env"
})

const Camp = require("./models/model_camps")
mongoose.connect(process.env.NET_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

// 读取本地数据
const campsData = JSON.parse(fs.readFileSync(`${__dirname}/_data/mscamps.json`, "utf-8"))

// 导入数据
const importData = async () => {
  try {
    await Camp.create(campsData)
    console.log("数据存储成功".green);
    process.exit()
  } catch (error) {
    console.log(error);
  }
}

// 删除数据
const deleteData = async () => {
  try {
    await Camp.deleteMany()
    console.log("数据删除成功".red);
    process.exit()
  } catch (error) {
    console.log(error);
  }
}

if (process.argv[2] === "-i")
  importData()
else if (process.argv[2] === "-d")
  deleteData()