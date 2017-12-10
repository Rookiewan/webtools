const HeartBeat = require('./heartBeat.js')

let heartBeat = new HeartBeat({
  showLog: true
})
// heartBeat.doHeartBeat('PHPSESSID=m8dpf1tia8kd2pcteiof3vcal5')
heartBeat.startHeartBeat()