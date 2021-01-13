
const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
                label: 'Clouddoc',
                submenu: [{
                        label: '关于Clouddoc',
                        role: 'about',
                            click: (menuItem, browserWindow, event) => {

                            }
                    },
                    {
                        label: '设置',
                            click: (menuItem, browserWindow, event) => {

                            }
                    },
                    {
                        type: '服务',
                        role: 'services',
                            click: (menuItem, browserWindow, event) => {

                            }
                    },
                    {
                        label: '隐藏',
                        role: 'hide',
                            click: (menuItem, browserWindow, event) => {

                            }
                    },
                    {
                        label: '退出',
                         role: isMac ? 'close' : 'quit',
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
                label: '保存',
                role: '',
                accelerator: 'CmdOrCtrl+S',
                    click: (menuItem, browserWindow, event) => {
                        browserWindow.webContents.send('create-saved-file')
                    }
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
                label: '导入',
                role: '',
                accelerator: 'CmdOrCtrl+I',
                    click: (menuItem, browserWindow, event) => {
                        browserWindow.webContents.send('create-import-file')
                    }
            },
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
                type: 'separator',
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