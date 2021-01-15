const {
    BrowserWindow
} = require("electron")
class AppWindow extends BrowserWindow {
    constructor(config, urlLocation) {
        const defaultConfig = {
            width: 800,
            height: 600,
            show: false,
            backgroundColor: '#fff',
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true // 解决外部找不到remote 模块
            }
        }
        const resConfig = {
            ...defaultConfig,
            ...config
        }
        super(resConfig)
        this.loadURL(urlLocation)
        this.once('ready-to-show', () => {
            this.show()
        })
    }

}
module.exports = AppWindow