// 引入模块
const request = require('request');
const cheerio = require('cheerio');

request('https://thenewstep.cn/msonline/', (err, response, html) => {
    if(!err && response.statusCode == 200) {
        // console.log(html);

        const $ = cheerio.load(html);
        const home = $('#home');
        // console.log(home.html());
        // console.log(home.text());

        // const output = home.find('h1').text();
        // const output = home.children('div').children('h1').text();
        // const output = home.children('div').children('h1').next().text();
        // const output = home.children('div').children('h1').parent().text();

        // console.log(output);

        // 遍历导航
        $('li a').each((i, el) => {
            const item = $(el).text();
            const link = $(el).attr('href');
            console.log(item, link);
        })
    }
})