import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./components/FileSearch.js";
import FileList from "./components/FileList.js";
import BottomBtn from "./components/BottomBtn.js";
import TabList from "./components/TabList.js";
import SimpleMDE from 'react-simplemde-editor';
import { v4  } from 'uuid';
import { FlaternArr, ObjToArr } from "./utils/Helper.js";
import "easymde/dist/easymde.min.css";
import React, { useEffect } from 'react';
import useKeyPress from './hooks/useKeyPress.js';
import {
    faPlusSquare,
    faUpload
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import FileHelper from './utils/FileHelper.js';
const path = window.require('path');
const remote = window.require('electron').remote;
const Store = window.require('electron-store');
const store = new Store({'name': 'File Data'});
const basePath = remote.app.getPath('userData'); // basePath/notebook(项目名称)/File Data.json
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
    FileHelper.removeFileSync(files[id].filePath)
    const { [id]: delfile, ...resfiles } = files
    CloseFile(id)
    setFiles(resfiles)
    saveFilesToStore(resfiles)
    // if active file,close it
    
  }


  //3. add unsavefile  (change file but unsave)
  const UpdateOpenFile = (id, newValue) => {
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

  // 4. edit and save file
  const UpdateFile = (id, key, newValue) => {
    let newFile = {
      ...files[id],
      isNew: false
    }
    if (key === 'title') {
      const newPath = path.join(basePath, `${newValue}.md`)
      newFile.title = newValue
      newFile.filePath = newPath
      const oldName = files[id].title
      if(oldName) {
        const oldPath = path.join(basePath, `${files[id].title}.md`)
        FileHelper.renameSync(oldPath, newPath)
      } else {
        // 新建的文件
        FileHelper.writeFileSync(newFile.filePath, newFile.body)
      }
    } else {
      // body
      FileHelper.writeFileSync(newFile.filePath, newValue)
    }
    const newfiles = {
      ...files,
      [id]: newFile
    }
    setFiles(newfiles)
    if (key === 'title') saveFilesToStore(newfiles)
  }

  //5.save file   (while activefile is unsave, 'ctrl+s' to save it)
  const ctrlPressed = useKeyPress(17)
  const sPressed = useKeyPress(83)
  useEffect(() => {
    if (ctrlPressed && sPressed && activeFileId && unSavedFiles[activeFileId]) {
      const body = unSavedFiles[activeFileId].body

      const {
        [activeFileId]: delFile,
        ...resUnsavedFiles
      } = unSavedFiles
      setUnSavedFiles(resUnsavedFiles)
      UpdateFile(activeFileId, 'body', body)
    }
  })
  
  // 6.open file
  const OpenFile = (id) => {
    //add to openfiles
    if (!openedFileIds.includes(id)) {
      setOpenedFileIds([...openedFileIds, id])
    }
    // set active file
    setActiveFileId(id)
  }

  // 7.close file
  const CloseFile = (id) => {
    // remove from openfiles
    const newOpenedFileIds = openedFileIds.filter(item => item !== id)
    setOpenedFileIds(newOpenedFileIds)
    //if change active file
    if (id === activeFileId) setActiveFileId(openedFileIds.length > 1 ? openedFileIds[0] : '')
  }

  // 8.change active file  (tab click)
  const ChangeTabActiveFile = (id) => {
    //if change active file
    if (id !== activeFileId) setActiveFileId(id)
  }

  //9. search File
  const searchFile = (keywords = '') => {
    setSearchKeysword(keywords)
  }
  const getActFile = (id) => {
     const actFile = unSavedFiles[activeFileId] || files[activeFileId] || null
     if (!actFile) return
     if (actFile.isLoaded) return actFile
     const body = actFile.filePath ? FileHelper.readFileSync(actFile.filePath) : ''
    //  console.log('body',body);
     return {
       ...actFile,
       body,
       isLoaded: true
     }
  }
  // left filelist
  const filesArr = ObjToArr(files).filter(file => {
    return file.title.includes(searchKeysword)
  })
  
  // openedFilesArr base unsaveFiles or files
  const openedFilesArr = openedFileIds.map(id => unSavedFiles[id] || files[id])
  // activeFile base unsaveFiles or files
  const activeFile = getActFile(activeFileId) //unSavedFiles[activeFileId] || files[activeFileId] || null
  const unSavedFileIds = Object.keys(unSavedFiles)

  console.log('activeFile', activeFile);
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className = "col-3 d-flex flex-column left-panel">
          <FileSearch onFileSearch={searchFile} searchStateChange={(flag)=>{setSearching(flag)}} />
          <div className="flex-grow-1 overflow-auto">
            <FileList
              files={filesArr}
              onFileClickFunc={OpenFile}
              onFileNameSaveEdit = {UpdateFile}
              onFileDeleteFunc={(id)=>{
                const res = window.confirm("确认此删除文件？")
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
                    onBtnClick={()=>{console.log('click导入')}}
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
                  UpdateOpenFile(activeFileId, value)
                }
              }
              />
          </div>
        }
        
      </div>
    </div>
  );
}

export default App;
