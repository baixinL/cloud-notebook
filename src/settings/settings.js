const {
    remote,
    ipcRenderer
} = require("electron")
const Store = require('electron-store')
const store = new Store({'name': 'settings'});
let {
    accessKey = '',
    secretKey = '',
    bucketName = '',
    defaultLocationUrl = ''
} = store.store
    console.log(store);
const $ = (selector) => {
    const doms = selector ? document.querySelectorAll(selector) : []
    return doms.length > 1 ? doms : doms[0]
}

document.addEventListener('DOMContentLoaded',()=>{
    console.log('DOMContentLoaded');
    $('#savedFileLocation').value = defaultLocationUrl || ''
    $('#accessKey').value = accessKey || ''
    $('#secretKey').value = secretKey || ''
    $('#bucketName').value = bucketName || ''
    const win = remote.getCurrentWindow()
    $('#select-new-location').addEventListener('click', (event) => {
        console.log('click');
        remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openDirectory']
        }).then(result => {
            if (!result.canceled && Array.isArray(result.filePaths)) {
                // 写入input中
                $('#savedFileLocation').value = result.filePaths[0]
                defaultLocationUrl = result.filePaths[0]
                console.log('defaultLocationUrl', defaultLocationUrl);
                // 存储此变量到store
                // store.set('defaultLocationUrl', result.filePaths[0])
            }
        }).catch(err => {
            console.log(err)
        })
    })
    $('.nav-link').forEach(element => {
        element.addEventListener('click', (e) => {
            // .nav-link都移除样式active
            $('.nav-link').forEach(ele => {
                ele.classList.remove('active')
            });
             // 目标增加样式active
            e.target.classList.add('active')
            // 隐藏所有tab页
            $('.config-area').forEach(area => {
                area.style.display = 'none'
            })
            // 显示当前tab对应的tab页
            $(e.target.dataset.tab).style.display = 'block'
        })
    });
    // 提交表单
    // ifActive 是否主动提交（点击保存按钮）
    function saveFormAsync(askMessage, ifActive = false) {
        return new Promise((res, rej) =>{
            const oldurl = store.get('defaultLocationUrl') || ''
            console.log(oldurl != defaultLocationUrl);
            console.log($('#accessKey').value != accessKey);
            console.log($('#secretKey').value != secretKey);
            console.log($('#bucketName').value != bucketName);
            if (oldurl != defaultLocationUrl ||
            $('#accessKey').value != accessKey ||
            $('#secretKey').value != secretKey ||
            $('#bucketName').value != bucketName) {
                const answer = window.confirm(askMessage)

                if (!answer) {
                    res(false)
                    return
                }
                accessKey = $('#accessKey').value
                secretKey = $('#secretKey').value
                bucketName = $('#bucketName').value
                store.set('defaultLocationUrl', defaultLocationUrl)
                store.set('accessKey', accessKey)
                store.set('secretKey', secretKey)
                store.set('bucketName', bucketName)

                remote.dialog.showMessageBox({
                    type: 'info',
                    message: '表单提交成功'
                })
                res(true)
            } else {
                if (ifActive) {
                    remote.dialog.showMessageBox({
                        type: 'warning',
                        message: '表单未修改'
                    })
                }
                res(false)
            }
            
        })
        
    }
    // 点击提交表单
    $('#settings-form').addEventListener('submit', async (e)=>{
        e.preventDefault();
         saveFormAsync('确认保存本次修改？', true)      
    })
    // 离开前，如果表单已修改
    ipcRenderer.on('close', async (e) => {
        saveFormAsync('是否保存本次修改？')
        remote.getCurrentWindow().destroy()
    })
})
