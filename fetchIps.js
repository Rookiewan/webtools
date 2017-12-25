const request = require('superagent')
const cheerio = require('cheerio')
const async = require('async')
const fs = require('fs')
require('superagent-proxy')(request)
const IP_URL = 'http://www.xicidaili.com/nt/'
const TOTAL_PAGE = 20
const LIMIT = 5
let pageOffset = 1


// fetchAllIps()

function fetchAllIps () {
  let urls = new Array(TOTAL_PAGE)
  for (let i = 0; i < urls.length; i++) {
    urls[i] = `${IP_URL}${pageOffset++}`
  }
  async.mapLimit(urls, LIMIT, async (url) => {
    console.log(url)
    let res = await fetchIpsByPage(url)
    return res
  }, (err, result) => {
    if (err) {
      console.log(err)
    }
    let ips = []
    result.map(_ => {
      ips = ips.concat(_)
    })
    fs.writeFile('./ips.txt', ips.join('\r\n'), (err) => {
      if (err) {
        throw err
      }
      console.log('write file success')
    })
  })
}

function fetchIpsByPage (url) {
  return new Promise((resolve, reject) => {
    request
      .get(url)
      // .proxy('http://121.43.178.58:3128')
      .set({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Host': 'www.xicidaili.com',
        'If-None-Match': 'W/"29a5730de315359c771883b75d637c45"',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
      })
      .end((err, res) => {
        if (err) {
          reject()
          console.log(err)
        }
        let $ = cheerio.load(res.text)
        let rows = $('tr')
        let _ips = []
        rows.each((i, ele) => {
          try {
            let row = $(ele).children()
            let ip = $(row[1]).text()
            let port = $(row[2]).text()
            let protocol = $(row[5]).text()
            if (/http/.test(protocol.toLowerCase())) {
              _ips.push(`${protocol}://${ip}:${port}`)
            }
          } catch (err) {}
        })
        resolve(_ips)
      })
  })
}
