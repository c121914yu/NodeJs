# cheerio 库

服务器对 DOM 操作库

request(url,(err,res,html)=>{}) - 读取页面

```js
const $ = cheerio.load(html) // 初始化 cheerio
const content = $(".class") //根据class名获取
const content = $("#id") //根据ID获取
content.html() // 转换成html格式
content.text() // 获取content里全部文本信息
content.find("h1") // 获取content里h1标签,需要用.html方法转成html格式
content.children("") // 在第一层子元素中查找标签
content.parent() // 获取父级
content.next() //获取第一个子元素

$("li a").each((i, el) => {
	// 遍历li下所有a标签
	const item = $(el).text() //获取a的文本
	const link = $(el).attr("href") //获取a的href
})
```
