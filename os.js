const os = require("os")

// os.platform() - 返回标示操作系统字符串
console.log(os.platform())

// os.arch() - 返回cup架构
console.log(os.arch())

// os.cpu() - 返回内核信息
console.log(os.cpus())

// os.freemen() - 返回系统空闲内存（以字节为单位)
console.log(os.freemem())

// os.totalmen() - 返回系统总内存
console.log(os.totalmem())

// os.homedir() - 返回用户的主目录路径
console.log(os.homedir())

// os.uptime() - 系统正常运行时间（单位：秒)
console.log(os.uptime())