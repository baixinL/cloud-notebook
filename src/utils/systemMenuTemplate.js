const {
    app,
    ipcMain
} = require('electron')
const isMac = process.platform === 'darwin'
const name = app.getName()
const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
                label: name,
                submenu: [{
                        label: `关于${name}`,
                        role: 'about',
                            click: (menuItem, browserWindow, event) => {

                            }
                    },
                    {
                        label: '设置',
                        accelerator: 'Command+,',
                            click: (menuItem, browserWindow, event) => {

                            }
                    },
                    {
                        type: '服务',
                        role: 'services',
                        submenu: []
                    },
                    {
                        label: `隐藏${name}`,
                        role: 'hide',
                         accelerator: 'Command+H',
                            click: (menuItem, browserWindow, event) => {

                            }
                    },
                    {
                        label: '隐藏其它',
                        role: 'hideothers',
                        accelerator: 'Command+Alt+H',
                        click: (menuItem, browserWindow, event) => {

                        }
                    },
                    {
                        label: '显示全部',
                        role: 'unhide',
                        click: (menuItem, browserWindow, event) => {

                        }
                    },
                    {
                        label: '退出',
                         role: 'quit',
                             click: (menuItem, browserWindow, event) => {

                             }
                    }
                ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: '文件',
        submenu: [
            {
                label: '新建',
                role: '',
                accelerator: 'CmdOrCtrl+N',
                click:(menuItem, browserWindow, event)=>{
                    browserWindow.webContents.send('create-new-file')
                }
            },
            {
                type: 'separator',
            },
            {
                label: '保存',
                role: '',
                accelerator: 'CmdOrCtrl+S',
                    click: (menuItem, browserWindow, event) => {
                        browserWindow.webContents.send('create-saved-file')
                    }
            },
            {
                type: 'separator',
            },
            {
                label: '搜索',
                role: '',
                accelerator: 'CmdOrCtrl+P',
                    click: (menuItem, browserWindow, event) => {
                        browserWindow.webContents.send('create-search-file')
                    }
            },
            {
                type: 'separator',
            },
            {
                label: '导入',
                role: '',
                accelerator: 'CmdOrCtrl+I',
                    click: (menuItem, browserWindow, event) => {
                        browserWindow.webContents.send('create-import-file')
                    }
            },
            ...(isMac ? []: [
                {
                    type: 'separator',
                }, {
                    label: '设置',
                    accelerator: 'Ctrl+,',
                    click: (menuItem, browserWindow, event) => {
                        ipcMain.emit('set-location-url')
                    }
                }
            ])
        ]
    },
    // { role: 'editMenu' }
    {
        label: '编辑',
        submenu: [{
                label:'撤销',
                role: 'undo',
                accelerator: 'CmdOrCtrl+Z',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                label: '重做',
                role: 'redo',
                accelerator: 'CmdOrCtrl+Y',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                
                label: '剪切',
                role: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                label: '复制',
                role: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                label: '粘贴',
                role: 'paste',
                accelerator: 'CmdOrCtrl+V',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                label: '全选',
                role: 'selectAll',
                accelerator: 'CmdOrCtrl+A',
                    click: (menuItem, browserWindow, event) => {

                    }
            }
        ]
    },
    // { role: 'viewMenu' }
    {
        label: '视图',
        submenu: [{
                label: '刷新当前页面',
                role: 'reload',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                label: '开发者工具',
                role: 'toggleDevTools',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                label: '进入全屏模式',
                role: 'togglefullscreen',
                    click: (menuItem, browserWindow, event) => {

                    }
            }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: '窗口',
        submenu: [{
            label: '最小化',
                role: 'minimize',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
            {
                label: '关闭',
                role: 'close',
                    click: (menuItem, browserWindow, event) => {

                    }
            },
        ]
    },
    {
        role: '帮助',
        submenu: [{
            label: 'Learn More',
            click: async () => {
                const {
                    shell
                } = require('electron')
                await shell.openExternal('https://electronjs.org')
            }
        }]
    }
]
 module.exports = {
    template
 };