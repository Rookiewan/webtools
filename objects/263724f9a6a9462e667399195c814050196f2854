
const request = require('superagent')
const fs = require('fs')
const path = require('path')
const asyncLib = require('async')

// cookies 列表
let cookies = []

// cookies 文件名
const cookiesFilename = 'cookies.txt'
// 投票页面 url
const URL = 'http://www.zghyyw.com/index.php?m=Termin&c=VoteGoodActor&a=vote&opid=6ff61f410886e10d33ec96ae02c6deef'
// 投票的请求 url
const VOTE_URL = 'http://www.zghyyw.com/index.php?m=Termin&c=VoteGoodActor&a=do_vote'

// test
const My_COOKIE = 'PHPSESSID=a1m50gpb3l8v20evos1l3e5mv3'
const EXPIRE_COOKIE = 'PHPSESSID=1i3tqgmh7s8392sdd1lhmt3g24'

// 计时器
let counter = null
// 一分钟
const ONE_MINUTE = 1000 * 60
// 心跳间隔
const BEAT_INTERVAL = ONE_MINUTE * 5
// 每次心跳最大并发数
const LIMIT = 10
// 本次心跳循环次数
let beatCount = 0

readCookies(cookiesFilename)
let totalCount = cookies.length
// doVote()
// doHeartBeat(EXPIRE_COOKIE)
startHeartBeat()

function startHeartBeat () {
  const _LIMIT = cookies.length >= LIMIT ? LIMIT : cookies.length
  if (cookies.length > 0) {
    asyncLib.mapLimit(cookies, _LIMIT, (cookie, callback) => {
      // if (!cookie.active) {
      //   callback(null)
      //   return
      // }
      doHeartBeat(cookie.cookie)
        .then(() => {
          cookie.active = true
          callback(null)
        })
        .catch(err => {
          cookie.active = false
          callback(null)
        })
    }, (err) => {
      if (err) {
        throw err
      }
      // removeCookies()
      let successCount = cookies.filter(_ => _.active === true).length
      console.log('\n')
      console.log('心跳间隔: ' + (BEAT_INTERVAL / 1000) + '秒')
      console.log('总数量: ' + totalCount)
      console.log('心跳成功数量: ' + successCount)
      console.log('心跳次数: ' + (++beatCount))
      console.log('\n\n')
      counter = setTimeout(startHeartBeat, BEAT_INTERVAL)
    })
  } else {
    clearTimeout(counter)
  }
}

// 投票
function doVote (cookie) {
  request
    .post(VOTE_URL)
    .set({
      'Host': 'www.zghyyw.com',
      'Connection': 'keep-alive',
      // 'Content-Length': 148,
      'Accept': '*/*',
      'Origin': 'http://www.zghyyw.com',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Le X820 Build/FEXCNFN5902605092S; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043632 Safari/537.36 MicroMessenger/6.5.19.1140 NetType/WIFI Language/zh_CN',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Referer': 'http://www.zghyyw.com/index.php?m=Termin&c=VoteGoodActor&a=vote&opid=3fe339e16bab15d6f6103043b7f4d6e2',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,en-US;q=0.8',
      'Cookie': cookie
    })
    .end((err, res) => {
      if (err) {
        throw err
      }
      console.log(res.text)
    })
}

// 心跳
function doHeartBeat (cookie) {
  return new Promise((resolve, reject) => {
    request
      .get(URL)
      .set({
        'Host': 'www.zghyyw.com',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': 1,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/wxpic,image/sharpp,*/*;q=0.8',
        'Referer': 'http://www.zghyyw.com/index.php?m=Termin&c=VoteGoodActor&a=index&from=singlemessage',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/wxpic,image/sharpp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,en-US;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; Le X820 Build/FEXCNFN5902605092S; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043632 Safari/537.36 MicroMessenger/6.5.19.1140 NetType/WIFI Language/zh_CN',
        'Cookie': cookie
      })
      .end((err, res) => {
        if (err) {
          // throw err
          console.log(err)
        }
        const regx = /中国电视好演员投票/
        if (regx.test(res.text)) {
          // 心跳成功
          console.log(cookie + ' >>> 心跳成功')
          resolve()
        } else{
          console.log(cookie + ' >>> 心跳失败')
          reject()
        }
      })
  })
}

// 每次心跳后更新cookies列表
function removeCookies () {
  let newCookies = []
  cookies.map((_, i) => {
    if (_.active) {
      newCookies.push(_)
    }
  })
  cookies = newCookies
}

// 读取cookies
function readCookies (cookiesFileName) {
  let cookiesStr = fs.readFileSync(path.resolve(__dirname, cookiesFileName)).toString()
  cookiesStr.split('\r\n').map(_ => {
    try {
      let cookie = _.split(';')[0]
      if (cookie) {
        cookies.push({
          active: true,
          cookie
        })
      }
    } catch (err) {}
  })
}
