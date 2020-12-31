const {
    app,
    BrowserWindow
} = require("electron")
const isDev = require('electron-is-dev')
let mainWin;

app.on('ready', () => {
   mainWin = new BrowserWindow({
       width:1024,
       height:680,
       webPreferences: {
           nodeIntegration: true,
           enableRemoteModule: true // 解决外部找不到remote 模块
       }
   })
   console.log(isDev);
   const urlLocation = isDev ? 'http://localhost:3000' : ''
   mainWin.loadURL(urlLocation)
//    mainWin.webContents.openDevTools()
})