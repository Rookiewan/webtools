const { app, BrowserWindow, ipcMain, Tray } = require('electron')
const path = require('path')
const url = require('url')
const HeartBeat = require('./modules/heartBeat.js')

let mainWin
let winsCount = 0
let wins = {}
let tray = null

function createWindow ({ page = 'index.html', width = 800, height = 600, parent = null }) {
  let windowParams = {
    width,
    height,
    icon: path.resolve(__dirname, './assets/icon.png'),
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      allowRunningInsecureContent: true
    }
  }
  if (parent) {
    windowParams.parent = parent
  }
  let win = new BrowserWindow(windowParams)
  win.loadURL(url.format({
    pathname: path.join(__dirname, page),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools()
  wins[win.id] = {
    win: win,
    instance: null
  }
  win.webContents.executeJavaScript(`window.WIN_ID='${win.id}'`)

  // 即将被关闭
  win.on('close', e => {
    win.webContents.send('onClose')
    e.preventDefault()
  })
  // 被关闭后释放资源
  win.on('closed', e => {
    // try {
    //   wins[win.id].instance.stop()
    // } catch (err) {}
    // try {
    //   wins[winId].win.destroy()
    // } catch (err) {
    //   console.log(err)
    // }
    // delete wins[win.id]
  })

  return win
}

app.on('ready', () => {
  mainWin = createWindow({})
  tray = new Tray(path.resolve(__dirname, './assets/icon.png'))
  tray.setToolTip('tools，双击显示')
  tray.on('double-click', () => {
    Object.keys(wins).map(winId => {
      wins[winId].win.show()
    })
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWin === null) {
    mainWin = createWindow()
  }
})

// 打开新页面
ipcMain.on('open-page', (event, page) => {
  let pageUrl = 'index.html'
  let width = 800
  let height = 600
  switch (page) {
    case 'heartBeat':
      pageUrl = 'heart-beat.html'
      width = 900
      height = 660
      break
    default:
  }
  let _win = createWindow({
    page: pageUrl,
    width,
    height,
    parent: mainWin
  })
})

// 心跳服务
ipcMain.on('heart-beat', (event, { option, params, winId }) => {
  // let winId = event.sender.id
  switch (option) {
    case 'doBeat':
      // opt: 1 启动, 2 停止, 3手动心跳
      let { opt, options } = params
      if (opt === 1) {
        let heartBeat = new HeartBeat(options)
        wins[winId].instance = heartBeat
        event.sender.send('doBeat', JSON.parse(JSON.stringify(wins[winId].instance)))
        heartBeat.startHeartBeat()
        heartBeat.onBeatBack(instance => {
          event.sender.send('doBeat', instance)
        })
        heartBeat.onCookieBeatBack(cookie => {
          event.sender.send('doBeatCookie', cookie)
        })
      } else if (opt === 2) {
        wins[winId].instance.stop()
      } else if (opt === 3) {
        wins[winId].instance.beatByHand()
      }
      break
    default:
  }
})

ipcMain.on('closePage', (event) => {
  let winId = event.sender.id
  console.log('close ' + winId)
  try {
    wins[winId].instance.stop()
  } catch (err) {}
  try {
    wins[winId].win.destroy()
  } catch (err) {}
  delete wins[winId]
})
