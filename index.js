const request = require("request")
const cheerio = require("cheerio")

request("https://blog.csdn.net/yjltop/article/details/105250468", (err, response, html) => {
  if (err) throw err
  if (response.statusCode === 200) {
    // console.log(html)
    const $ = cheerio.load(html);
    const content = $(".context-box");
    // console.log(content.html());
    // console.log(content.text());
    // console.log(content.find("h5").html());
    const h5 = content.children(".content").children("h5");
    // console.log(h5.html());
    // const parent = h5.parent();
    // console.log(parent.html());
    // console.log(parent.next().html());

    // console.log($("li a").html());
    $("li a").each((i, el) => {
      const item = $(el).text();
      const link = $(el).attr("href");
      // console.log(item);
      console.log(link);

    })
  }
})