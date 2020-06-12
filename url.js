const url = require("url")

const myUrl = new URL("https://ke.qq.com:8000/webcourse/index.html?cid=2468298&term_id=102572764&taid=9015269500758474&vid=5285890802934207648")

// 序列化url
console.log(myUrl.href)

// host（包含端口)
console.log(myUrl.host)

// hostname（不含端口)
console.log(myUrl.hostname)

// pathname(域名后的path)
console.log(myUrl.pathname)

// search - ?后的内容
console.log(myUrl.search)

// searchparams - 获取对象参数
console.log(myUrl.searchParams)

// append() - 添加参数
myUrl.searchParams.append("test","qwe-24")

// forEach(value,name) - 遍历参数
myUrl.searchParams.forEach((value,name) => {
	console.log(`${name} : ${value}`)
})