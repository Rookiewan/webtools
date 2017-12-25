const http = require('http')

let option = {
  host: '122.114.122.212',
  port: '9999',
  method: 'GET',
  path: 'http://ip.chinaz.com/getip.aspx',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language':  'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'ip.chinaz.com',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
  }
}

let body = ''
let req = http.request(option, res => {
  console.log(res.statuscode)
  res.on('data', d => {
    body += d
  }).on('end', () => {
    console.log(res.headers)
    console.log(body)
  })
}).on('error', err => {
  console.log(err)
})
req.end()