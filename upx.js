const shell = require('shelljs')

const UPX_EXE = 'D:/Software/upx394w/upx.exe'
const APP_PATH = './dist/tools-win32-x64'

// shell.exec(`${UPX_EXE} ${APP_PATH}/*.exe`)
// shell.exec(`${UPX_EXE} ${APP_PATH}/node.dll`)
// shell.exec(`${UPX_EXE} ${APP_PATH}/d3dcompiler_47.dll`)
// shell.exec(`${UPX_EXE} ${APP_PATH}/libGLESv2.dll`)
shell.exec(`${UPX_EXE} ${APP_PATH}/ffmpeg.dll`)
