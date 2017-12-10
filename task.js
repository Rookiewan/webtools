const HeartBeat = require('./heartBeat.js')

let heartBeat = new HeartBeat({
  showLog: true
})
heartBeat.doHeartBeat('PHPSESSID=tge0db23udgl88h9i63h77eqi7')
// heartBeat.startHeartBeat()