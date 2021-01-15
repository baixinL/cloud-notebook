const {
    app,
    Menu,
    ipcMain
} = require("electron")
const isDev = require('electron-is-dev')
const { template } = require('./src/utils/systemMenuTemplate')
const AppWindow = require('./src/class/AppWindow')
const path = require('path')
let mainWin;
console.log('ready');
app.on('ready', () => {
    console.log('new AppWindow');
    const urlLocation = isDev ? 'http://localhost:3000' : ''
    mainWin = new AppWindow({
         width: 1024,
         height: 680
    }, urlLocation)
    mainWin.on('closed', () => {
        mainWin = null
    })
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    ipcMain.on('set-location-url', () => {
        //创建子窗口settings.html
        console.log(path.resolve(__dirname, './src/settings/settings.html'));
        let childWin = new AppWindow({
            width: 500,
            height: 400,
            parent: mainWin
        }, `file://${path.resolve(__dirname, './src/settings/settings.html')}`)
        childWin.on('closed', () => {
            childWin = null
        })
        childWin.on('close', (e) => {
            e.preventDefault();
            childWin.webContents.send('close')
        })
    })
})

