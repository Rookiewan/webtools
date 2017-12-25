const HeartBeat = require('./heartBeat.js')

let heartBeat = new HeartBeat({
  showLog: true
})
heartBeat.doHeartBeat('PHPSESSID=a1m50gpb3l8v20evos1l3e5mv3')
// heartBeat.startHeartBeat()