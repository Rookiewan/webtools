const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const request = require('superagent')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  request
    .get('https://www.baidu.com')
    .end((err, res) => {
      if (err) {
        throw err
      }
      console.log(res.text)
    })

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
