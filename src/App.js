import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import { v4  } from 'uuid';
import {
  faPlusSquare,
  faUpload
} from '@fortawesome/free-solid-svg-icons';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileSearch from "./components/FileSearch.js";
import FileList from "./components/FileList.js";
import BottomBtn from "./components/BottomBtn.js";
import TabList from "./components/TabList.js";
import FileHelper from './utils/FileHelper.js';
import useIpcRenderer from './hooks/useIpcRenderer.js';
import useKeyPress from './hooks/useKeyPress.js'
import {
  ObjToArr,
  returnTimes
} from "./utils/Helper.js";

const path = window.require('path');
const {
  remote,
} = window.require('electron')
const {
  app,
  dialog,
} = remote


const Store = window.require('electron-store')
const store = new Store({'name': 'File Data'})
const settings = new Store({
  'name': 'settings'
});
// const QiniuItem = require('./utils/QiniuItem')
// const ak = '_2Cuwxy9KRWINmElmFXsoL5yzAiKsi-r2FnybKYY'
// const sk = '837BJADHTydHJbMSdjHpQJMdQ286UAh5iJHalNzj'
// const bucket = 'markdown-bx'
// const domain = 'http://qmxdfsdr2.hd-bkt.clouddn.com/'
// const qiniu = new QiniuItem(ak, sk, bucket)
// qiniu.Download(domain, '321.md')
// qiniu.Delfile('1212.md').catch(err=>{
//   console.log(err);
// })
// console.log('qiniu', qiniu);
// qiniu.Upload('1212.md', 'C:/Users/baixinL/AppData/Roaming/notebook/1212.md').catch (err => {
//   console.log(err);
// })
// console.log(settings.get('defaultLocationUrl'));
const basePath = settings.get('defaultLocationUrl') || app.getPath('userData'); // basePath/notebook(项目名称)/File Data.json
const saveFilesToStore = (files) =>{
  const filesStoreObj = Object.values(files).reduce((result, file) => {
      const { id, filePath, title, createAt } = file
      result[id] = {
        id,
        filePath,
        title,
        createAt
      }
      return result
    }, {})
    store.set('files', filesStoreObj)
}


function App() {
  const [files, setFiles] = useState(store.get('files') || {}) //
  const [searchKeysword, setSearchKeysword] = useState('')
  const [searching, setSearching] = useState(false)
  const [unSavedFiles, setUnSavedFiles] = useState({})
  const [activeFileId, setActiveFileId] = useState('')
  const [openedFileIds, setOpenedFileIds] = useState([])
  const [editingFileName, setEitingFileName] = useState(false)

  const ctrlPressed = useKeyPress(17)
  // 1.new file
  const CreateFile = () => {
    if (editingFileName) {
      // 延时执行alert是为了避免alert影响键盘事件的监听
      setTimeout(() => {
        alert('请关闭文件名编辑后在操作！')
      }, 100);
      return
    }
    const newFile = {
      id: v4(),
      title: '',
      body: "## 请输出 Markdown",
      createAt: (new Date()).getTime(),
      isNew: true
    }
    setFiles({
      ...files,
      [newFile.id]: newFile
    })
    // OpenFile(newFile.id)
  }

  // 2.delete file
  const DelFile = (id) => {
    try {
      FileHelper.removeFileSync(files[id].filePath)
    } catch (error) {
      alert(error)
    }
    const { [id]: delfile, ...resfiles } = files
    CloseFile(id)
    setFiles(resfiles)
    saveFilesToStore(resfiles)
    // if active file,close it
    
  }
  // 3.remove file from list
  const RemoveFile = (id) => {
    const {
      [id]: delfile, ...resfiles
    } = files
    CloseFile(id)
    setFiles(resfiles)
    saveFilesToStore(resfiles)
    // if active file,close it
  }


  //4. add unsavefile  (change file but unsave)
  const UpdateUnsaveFile = (id, newValue) => {
    if (ctrlPressed) return
    const curFile = activeFile
    if (curFile.body === newValue) return
    const newFile = {
      ...curFile,
      body: newValue
    }
    setUnSavedFiles({
      ...unSavedFiles,
      [id]: newFile
    })
  }

  // 5. edit and save file
  const UpdateFile = (id, key, newValue) => {
    try {
      let newFile = {
        ...files[id],
        isNew: false
      }
      if (key === 'title') {
        if (files[id].title === newValue) return // 没改
        const oldPath = newFile.filePath
        const newPath = oldPath ? path.join(path.dirname(oldPath), `${newValue}.md`) : path.join(basePath, `${newValue}.md`)
        //更新title，filePath
        newFile.filePath = newPath
        newFile.title = newValue

        const oldName = files[id].title
        if(oldName) {
          // 旧文件--重命名
          FileHelper.renameSync(oldPath, newPath)
        } else {
          // 新文件--写入新文件
          FileHelper.writeFileSync(newFile.filePath, newFile.body)
        }
      } else {
        // body
        if (files[id].body === newValue) return // 没改
        FileHelper.writeFileSync(newFile.filePath, newValue)
        newFile.body = newValue
      }
      const newfiles = {
        ...files,
        [id]: newFile
      }
      setFiles(newfiles)
      if (key === 'title') {
        saveFilesToStore(newfiles)
        // 未保存文件被更改名称，需要更新未保存文件信息
        if (Object.keys(unSavedFiles).includes(id)) {
          const curFileInUnSaveFiles = {
            ...newFile,
            body: unSavedFiles[id].body // 内容未保存
          }
          const newUnSavedFiles = {
            ...unSavedFiles,
            [id]: curFileInUnSaveFiles
          }
          setUnSavedFiles(newUnSavedFiles)
        }
      }
    } catch (error) {
      alert(error)
    }
  }
  
  //6.save file 
 const SaveFile = () => {
   if (!unSavedFiles[activeFileId]) return
   
   const body = unSavedFiles[activeFileId].body
   let unSavedFiles_cp = { ...unSavedFiles }
   delete unSavedFiles_cp[activeFileId]
   setUnSavedFiles(unSavedFiles_cp)
   UpdateFile(activeFileId, 'body', body)
 }
  
  // 7.open file
  const OpenFile = (id) => {
    //add to openfiles
    if (!openedFileIds.includes(id)) {
      setOpenedFileIds([...openedFileIds, id])
    }
    // set active file
    setActiveFileId(id)
  }

  // 8.close file
  const CloseFile = (id) => {
    // if unsave
    if(unSavedFileIds.includes(id)) {
      const answer = window.confirm(`是否要保存文件${unSavedFiles[id].title}？`)
      // remove from unsavefiles
      const {
        [id]: delFile,
        ...resUnsavedFiles
      } = unSavedFiles
      setUnSavedFiles(resUnsavedFiles)
      // save, updatefile
      if (answer) {
         const body = unSavedFiles[id].body
         UpdateFile(id, 'body', body)
      }
    }
    
    // remove from openfiles
    if (openedFileIds.includes(id)) {
      const resOpenFilesIds = openedFileIds.filter(item => item !== id)
      setOpenedFileIds(resOpenFilesIds)

      //if change active file
      if (id === activeFileId) setActiveFileId(resOpenFilesIds.length > 0 ? resOpenFilesIds[0] : '')
    }
    
  }

  // 9.change active file  (tab click)
  const ChangeTabActiveFile = (id) => {
    //if change active file
    if (id !== activeFileId) setActiveFileId(id)
  }

  //10. search File
  const SearchFile = (keywords = '') => {
    console.log('SearchFile', keywords);
    setSearchKeysword(keywords)
  }
  const getActFile = (id) => {
     const actFile = unSavedFiles[activeFileId] || files[activeFileId] || null
     if (!actFile) return
     if (actFile.isLoaded) return actFile

     try {
      let body = ''
      if (actFile.filePath) {
        // 如果是未保存的文件需要从unsavefiles中读取body,已保存的从文件系统读取
          body = actFile.body || FileHelper.readFileSync(actFile.filePath)
      }
      return {
        ...actFile,
        body,
        isLoaded: true
      }
     } catch (error) {
      //  注意：window.confirm弹框需要确认2次yes才算yes
      if (window.confirm(`{\n${error}\n}\n\n确定将此文件移出Markdown文件列表？`)) RemoveFile(id)
     }
  }
  // 11.导入文件
  const ImportFiles = () => {
    dialog.showOpenDialog({
      title:'选择导入的 Markdown 文件', //String(可选) - 对话框窗口的标题
      //defaultPath: //String(可选) - 对话框的默认展示路径
      buttonLabel:'导入', //String(可选) - 「确认」 按钮的自定义标签, 当为空时, 将使用默认标签。
      filters: [{
        name: 'Markdown Files',
        extensions: ['md']
      }], //FileFilter[](可选)
      properties: ['openFile', 'multiSelections']
    }).then(res=>{
      //点击了确认导入
      if (!res.canceled) {
        const importResFiles = res.filePaths
        const isSameName = (title) => {
          return !!Object.values(files).find((file) => {
            return file.title === title
          })
        }
        let impFiles = importResFiles.reduce((result, filePath) => {
          const title = path.basename(filePath, '.md')
          if(isSameName(title)) throw new Error(`已存在同名文件${title}`)
          // if (isSameName(title)) {
          //   alert(`已存在同名文件${title}`)
          //   return
          // }
          const nfile = {
            id: v4(),
            title,
            filePath,
            createAt: returnTimes()
          }
          result[nfile.id] = nfile
          return result
        },{})
        const newfiles = {
          ...files,
          ...impFiles
        }
        setFiles(newfiles)
        saveFilesToStore(newfiles)
      }
    }).catch(err=>{
      // console.error(err);
      alert(err)
    })
  }
  // console.log('do');
  // left filelist
  const filesArr = ObjToArr(files).filter(file => {
    return file.title.includes(searchKeysword)
  })
  // activeFile base unsaveFiles or files
  let activeFile = getActFile(activeFileId)
  // get unsavefile ids
  const unSavedFileIds = Object.keys(unSavedFiles)
  // openedFilesArr base unsaveFiles or files,filter过滤因为files先更新，openedFileIds未更新导致的错误
  const openedFilesArr = openedFileIds.map(id => unSavedFiles[id] || files[id]).filter(file => file)
  

  // 系统菜单快捷键监听
  useIpcRenderer({
    'create-new-file': CreateFile,
    'create-import-file': ImportFiles,
    'create-saved-file': SaveFile
  })

  return (
    <div className="Apdp container-fluid px-0">
      <div className="row no-gutters">
        <div className = "col-3 d-flex flex-column left-panel">
          <FileSearch onFileSearch={SearchFile} searchStateChange={(flag)=>{setSearching(flag)}} />
          <div className="flex-grow-1 overflow-auto">
            <FileList
              files={filesArr}
              openedFileIds={openedFileIds}
              onFileClickFunc={OpenFile}
              onFileNameSaveEdit = {UpdateFile}
              onFileRemoveFunc = {
                (id) => {
                  const res = window.confirm("确认此文件移出Markdown文件列表？")
                  if (res) {
                    RemoveFile(id)
                  }
                }
              }
              onFileDeleteFunc={(id)=>{
                const res = window.confirm("确认将此文件从文件资源管理器中删除？")
                if (res) {
                  DelFile(id)
                }
              }}
              onFileNameEditStart = {
                (flag) => {
                  setEitingFileName(!!flag);
                }
              }
              />
            </div>
            {
              !searching && 
              <div className = "row no-gutters">
                <div className="col-6">
                  <BottomBtn 
                    text="新建"
                    icon={faPlusSquare}
                    colorClass = "btn-primary"
                    onBtnClick={()=>{CreateFile()}}
                    />
                </div>
                <div className="col-6">
                  <BottomBtn 
                    text="导入"
                    icon={faUpload}
                    colorClass="btn-success"
                    onBtnClick = {
                      () => {
                        ImportFiles()
                      }
                    }
                    />
                </div>
              </div>
            }
        </div>
        {
          !activeFile &&
          <div className="placeholder">选择或创建新的Markdown文档</div>
        }
        {
          activeFile &&
          <div className="col-9 right-panel">
            <TabList
              files = {openedFilesArr}
              unSavedIds = {unSavedFileIds}
              activeId = {activeFileId}
              onTabClick = {ChangeTabActiveFile}
              onTabClose = {CloseFile}
            />
            <SimpleMDE
              key={activeFileId}
              value = {activeFile && activeFile.body}
              options={{
                minHeight: '470px'
              }}
              onChange = {
                (value) => {
                  UpdateUnsaveFile(activeFileId, value)
                }
              }
              />
          </div>
        }
        
      </div>
    </div>
  );
}
App.propTypes = {
  files: PropTypes.object,
  searchKeysword: PropTypes.string,
  searching: PropTypes.bool,
  unSavedFiles: PropTypes.object,
  activeFileId: PropTypes.string,
  openedFileIds: PropTypes.array,
  editingFileName: PropTypes.bool,
}

export default App;
