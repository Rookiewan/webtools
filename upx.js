const shell = require('shelljs')

const UPX_EXE = 'D:/Software/upx394w/upx.exe'
const APP_PATH = './dist/heartBeat-win32-x64'

shell.exec(`${UPX_EXE} ${APP_PATH}/*.exe`)
shell.exec(`${UPX_EXE} ${APP_PATH}/node.dll`)
