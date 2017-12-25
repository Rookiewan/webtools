const request = require('superagent')
const fs = require('fs')
const path = require('path')
const asyncLib = require('async')

class HeartBeat {
  constructor (params = {}) {
    const ONE_MINUTE = 1000 * 60
    const VOTE_URL = 'http://www.zghyyw.com/index.php?m=Termin&c=VoteGoodActor&a=do_vote'
    const PAGE_URL = 'http://m9c2ecb95.wxvote.youtoupiao.com/page/show/id/412eb24d.html'
    const BEAT_INTERVAL = ONE_MINUTE * 5
    const LIMIT = 10
    const CONFIG = {
      cookieFilePath: 'cookies.txt',
      url: PAGE_URL,
      interval: BEAT_INTERVAL,
      limit: LIMIT,
      successFlag: 'lalalala',
      showLog: false
    }
    this.config = Object.assign({}, CONFIG, params)
    this.cookies = []
    this.counter = null
    this.beatCount = 0 // 心跳总次数
    this.totalCount = 0 // cookies 总数
    this.successCount = 0 //当前心跳 成功次数
    this.execCount = 0 // 当前心跳 执行次数
    this.looping = false
    this.beatCallback = () => {}
    this.cookieBeatBack = () => {}
    this.init()
    this.readCookies(this.config.cookieFilePath)
  }
  init () {
    try {
      let { protocol } = this.config
      let arr = protocol.split('\n').map(_ => /:/.test(_) && _)
      let protocols = {}
      arr.map(_ => {
        if (_) {
          let _row = _.split(':')
          protocols[_row[0].trim()] = _row.slice(1).join(':').trim()
        }
      })
      this.config.protocols = protocols
    } catch (err) {}
  }
  // 读取cookies
  readCookies (cookiesFileName) {
    let filePath = cookiesFileName
    if (!/(\/|\\)/.test(cookiesFileName)) {
      // 传入的是文件名
      filePath = path.resolve(__dirname,cookiesFileName)
    }
    let cookiesStr = fs.readFileSync(filePath).toString()
    cookiesStr.split('\r\n').map(_ => {
      try {
        let cookie = _.split(';')[0]
        if (cookie) {
          this.cookies.push({
            active: true,
            cookie
          })
        }
        this.totalCount = this.cookies.length
      } catch (err) {}
    })
  }
  startHeartBeat (handMode) {
    this.looping = true
    this.successCount = 0
    this.execCount = 0
    const _LIMIT = this.cookies.length >= this.config.limit ? this.config.limit : this.cookies.length
    if (this.cookies.length > 0) {
      asyncLib.mapLimit(this.cookies, _LIMIT, (cookie, callback) => {
        if (!this.looping) {
          callback(null)
          return
        }
        // if (!cookie.active) {
        //   callback(null)
        //   return
        // }
        this.doHeartBeat(cookie.cookie)
          .then(() => {
            cookie.active = true
            this.successCount++
            try {
              this.cookieBeatBack(Object.assign({}, cookie, {
                successCount: this.successCount,
                execCount: this.execCount
              }))
            } catch (err) {}
            callback(null)
          }, (err) => {
            cookie.active = false
            try {
              this.cookieBeatBack(Object.assign({}, cookie, {
                successCount: this.successCount,
                execCount: this.execCount
              }))
            } catch (err) {}
            callback(null)
          })
      }, (err) => {
        if (err) {
          // throw err
          console.log(err)
        }
        // removeCookies()
        this.successCount = this.cookies.filter(_ => _.active === true).length
        this.beatCount++
        if (this.config.showLog) {
          console.log('\n')
          console.log('心跳间隔: ' + (this.config.interval / 1000) + '秒')
          console.log('总数量: ' + this.totalCount)
          console.log('心跳成功数量: ' + this.successCount)
          console.log('心跳次数: ' + (this.beatCount))
          console.log('\n\n')
        }
        try {
          if(this.looping) {
            this.beatCallback({
              beatCount: this.beatCount,
              totalCount: this.totalCount,
              successCount: this.successCount,
              looping: this.looping
            })
          }
        } catch (err) {}
        if (!handMode && this.looping) {
          this.counter = setTimeout(() => {
            this.startHeartBeat()
          }, this.config.interval)
        }
      })
    } else {
      this.stop()
    }
  }
  // 心跳
  doHeartBeat (cookie) {
    return new Promise((resolve, reject) => {
      request
        .get(this.config.url)
        .set(Object.assign(this.config.protocols, {
          'Cookie': cookie
        }))
        .end((err, res) => {
          if (err) {
            // throw err
            console.log(err)
            reject()
          }
          this.execCount++
          const regx = new RegExp(this.config.successFlag)
          try {
            if (regx.test(res.text)) {
              // 心跳成功
              if (this.config.showLog) {
                console.log(cookie + ' >>> 心跳成功')
              }
              resolve()
            } else{
              if (this.config.showLog) {
                console.log(cookie + ' >>> 心跳失败')
              }
              reject()
            }
          } catch (err) {
            reject()
          }
        })
    })
  }
  // 每次心跳后更新cookies列表
  removeCookies () {
    let newCookies = []
    this.cookies.map((_, i) => {
      if (_.active) {
        newCookies.push(_)
      }
    })
    this.cookies = newCookies
  }
  // 投票
  doVote (cookie) {
    request
      .post(this.config.voteUrl)
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
  // 停止心跳
  stop () {
    // try {
    //   this.beatCallback({
    //     beatCount: this.beatCount,
    //     totalCount: this.totalCount,
    //     successCount: this.successCount,
    //     looping: this.looping
    //   })
    // } catch (err) {}
    clearTimeout(this.counter)
    this.totalCount = 0
    this.beatCount = 0
    this.cookies = []
    this.looping = false
  }
  // 每次更新完成 回调
  onBeatBack (callback) {
    this.beatCallback = callback
  }
  // 每个cookie心跳回调
  onCookieBeatBack (callback) {
    this.cookieBeatBack = callback
  }
  // 手动心跳
  beatByHand () {
    // TODO: 手动心跳冲突
    clearTimeout(this.counter)
    this.handMode = true
    // this.startHeartBeat(true)
  }
}

module.exports = HeartBeat

// let heartBeat = new HeartBeat({
  // interval: 10000
// })
// heartBeat.startHeartBeat()
