const request = require('superagent')
require('superagent-proxy')(request)

request
  .get('http://ip.chinaz.com/getip.aspx')
  // .get('http://www.baidu.com/')
  .proxy('http://113.88.67.127:80')
  .timeout({
    response: 5000
  })
  .set({
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language':  'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'ip.chinaz.com',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
  })
  .end((err, res) => {
    if (err) {
      console.log(err)
    }
    console.log(res.text)
    console.log(res.headers)
  })