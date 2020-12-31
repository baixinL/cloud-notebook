import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./components/FileSearch.js";
import FileList from "./components/FileList.js";
import BottomBtn from "./components/BottomBtn.js";
import TabList from "./components/TabList.js";
import defaultFiles from "./utils/defaultFiles.js";
import SimpleMDE from 'react-simplemde-editor';
import { v4  } from 'uuid';
import { FlaternArr, ObjToArr } from "./utils/Helper.js";
import "easymde/dist/easymde.min.css";
import React, { useEffect } from 'react'
import useKeyPress from './hooks/useKeyPress.js'
import {
    faPlusSquare,
    faUpload
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';


function App() {
  const [files, setFiles] = useState({})
  const [searchKeysword, setSearchKeysword] = useState('')
  const [searching, setSearching] = useState(false)
  const [unSavedFiles, setUnSavedFiles] = useState([])
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
    OpenFile(newFile.id)
  }

  // 2.delete file
  const DelFile = (id) => {
    delete files[id]
    setFiles(files)
    // if active file,close it
    CloseFile(id)
  }


  //3. add unsavefile  (change file but unsave)
  const UpdateOpenFile = (id, newValue) => {
    const curFile = openedFilesArr.find(file => file.id === id)
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
    //cant set same file name
    if (key === 'title' && Object.values(files).find(file => file.id !== id && file[key] === newValue)) return alert('文件名已存在')
    const newFile = {
      ...files[id],
      [key]: newValue,
      isNew: false
    }
    setFiles({
      ...files,
      [id]: newFile
    })
  }

  //5.save file   (while activefile is unsave, 'ctrl+s' to save it)
  const ctrlPressed = useKeyPress(17)
  const sPressed = useKeyPress(83)
  useEffect(() => {
    if (ctrlPressed && sPressed && activeFileId && unSavedFiles[activeFileId]) {
      const body = unSavedFiles[activeFileId].body
      delete unSavedFiles[activeFileId]
      setUnSavedFiles(unSavedFiles)
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
    if (id === activeFileId) setActiveFileId(openedFileIds[0] || '')
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

  // left filelist
  const filesArr = ObjToArr(files).filter(file => {
    return file.title.includes(searchKeysword)
  })
  console.log('filesArr',filesArr);
  // openedFilesArr base unsaveFiles or files
  const openedFilesArr = openedFileIds.map(id => unSavedFiles[id] || files[id])
  // activeFile base unsaveFiles or files
  const activeFile = unSavedFiles[activeFileId] || files[activeFileId] || null
  const unSavedFileIds = Object.keys(unSavedFiles)

  console.log('openedFilesArr:', openedFilesArr);
  
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
