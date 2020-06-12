## 路径模块 - path

1. path.parse(路径,通常是__filename) - 返回路径对象  
2. path.dirname(__filename) - 返回目录名，绝对路径  
3. path.basename(__filename) - 返回path最后一部分  
4. path.extname(__filename) - 返回文件扩展名  
5. path.join(__filename) - 串联路径  

## 文件模块 - fs
所有方法都有同步，后加Sync

1. mkdir(path) - 创建文件夹  
2. writeFile(路径，内容，回调) - 创建/写入文件
3. appendFile(路径，内容，回调) - 追加文件内容  
4. readFile() - 读取文件  
5. rename(oldPath,newPath) - 重命名


## 操作系统 - os

1. os.platform() - 返回标示操作系统字符串
2. os.arch() - 返回cup架构
3. os.cpu() - 返回内核信息
4. os.freemen() - 返回系统空闲内存（以字节为单位)
5. os.totalmen() - 返回系统总内存
6. os.homedir() - 返回用户的主目录路径
7. os.uptime() - 系统正常运行时间（单位：秒)

## url模块

创建一个url路径
const myUrl = new URL("https://ke.qq.com:8000/webcourse/index.html?cid=2468298&term_id=102572764&taid=9015269500758474&vid=5285890802934207648")

1. myUrl.href - 获取路径
2. myUrl.host - 获取域名（包含端口)
3. myUrl.hostname - 获取域名（不含端口)
4. myUrl.pathname - 获取域名后的path
5. myUrl.search - 获取路径?后的内容
6. myUrl.searchparams - 获取对象参数列表
7. myUrl.searchparams.append("name",value) - 添加参数
8. myUrl.searchparams.forEach((value,name)=>{}) - 遍历参数

## 时间模块 - events

```js
// 创建myEmitter类
class MyEmitter extends Events{}
// 实例化对象
const myEmitter = new MyEmitter()
// 注册时间
myEmitter.on("event",(e) => {
	// 若不用setImnmediate则为同步
	setImmediate(() => { //转化成异步
		console.log(e)
	})
})
// 触发事件
myEmitter.emit("event","这是参数")
console.log("异步显示")
```

## http服务器模块
