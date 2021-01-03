import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faTimes,
    faSave
} from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useKeyPress from './../hooks/useKeyPress.js'
import PropTypes from 'prop-types'

import useContextMenu from './../hooks/useContextMenu.js'
import {
    getParentNode
} from "./../utils/Helper.js";
const FileList = ({
        files,
        openedFileIds,
        onFileClickFunc,
        onFileDeleteFunc,
        onFileRemoveFunc,
        onFileNameSaveEdit,
        onFileNameEditStart
    }) => {
    const [editStatic, setEditStatic] = useState(false)
    const [value, setValue] = useState('')
    const enterPressed = useKeyPress(13)

    const closeChangeName = ()=>{
        setEditStatic(false)
        setValue('')
    }
    const ifCanChangeFileName = () => {
        if (files.find(file => file.id !== editStatic && file.title === value)) return alert('当前文件列表中已存在同名文件！')
        onFileNameSaveEdit(editStatic, 'title', value)
        closeChangeName()
    }
    const setChangeEdit = (id, title) => {
        if (!editStatic) {
            setEditStatic(id)
            setValue(title)
        } else {
            alert('已有文件名编辑中，请关闭后再试')
        }
    }
    const clickNode = useContextMenu([
        {
            label: '打开',
            click: () => {
                const target = getParentNode(clickNode.current, 'file-item')
                if (!target) return
                const id = target.dataset.id
                onFileClickFunc(id)
            }
        },
        {
            label: '从文件资源管理器中删除',
            click: () => {
                const target = getParentNode(clickNode.current, 'file-item')
                if (!target) return
                const id = target.dataset.id
                onFileDeleteFunc(id)
            }
        },
        {
            label: '从Markdown文件列表中移除',
            click: () => {
                const target = getParentNode(clickNode.current, 'file-item')
                if (!target) return
                const id = target.dataset.id
                onFileRemoveFunc(id)
            }
        },
        {
            label: '重命名',
            click: () => {
                const target = getParentNode(clickNode.current, 'file-item')
                if (!target) return
                const id = target.dataset.id
                const title = target.dataset.title
                setChangeEdit(id, title)
            }
        }
    ], '.file-list')
    // console.log('clickNode', clickNode);

    useEffect(() => {
        if (enterPressed && editStatic && value) {
            ifCanChangeFileName()
        }
    }, [enterPressed])

    //进入文件名编辑时，需要通知上一级
    useEffect(() => {
        onFileNameEditStart(editStatic)
    }, [editStatic])

    useEffect(()=>{
        const file = files.find(file=>file.isNew)
        if(file) {
            setEditStatic(file.id)
            setValue(file.title)
        }
    }, [JSON.stringify(files)])
    
        return (
            <ul className="list-group list-group-flush file-list">
                {
                    files.map(file => (
                        <li
                            className="list-group-item d-flex align-item-center file-item"
                            key={file.id}
                            data-id={file.id}
                            data-title={file.title}
                        >
                            {
                                (file.id !== editStatic && !file.isNew) &&
                                <>
                                    <span className="col-1">
                                        <FontAwesomeIcon
                                            title=""
                                            icon={faMarkdown}
                                            size="1x"
                                        />
                                    </span>
                                    <span
                                        className="col file-name"
                                        onClick={() => { onFileClickFunc(file.id) }}
                                        title={file.title}
                                    >
                                        {file.title}
                                    </span>
                                </>
                            }
                            {
                                (file.id === editStatic || file.isNew) &&
                                <>
                                    <input
                                        className="form-control input-sm search-input col"
                                        value={value}
                                        placeholder="请输入文件名"
                                        onChange={(e) => { setValue(e.target.value.trim()) }}></input>
                                    <button
                                        type="button"
                                        className="icon-button col-1"
                                        onClick={(e) => { if(file.title) closeChangeName(e) }}
                                    >
                                        <FontAwesomeIcon
                                            title="关闭"
                                            icon={faTimes}
                                            size="lg"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        className="icon-button col-1"
                                        onClick = {
                                            () => {
                                                if (value) {
                                                    ifCanChangeFileName()
                                                }
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon
                                            title="保存"
                                            icon={faSave}
                                            size="lg"
                                        />
                                    </button>
                                </>
                            }
                        </li>
                    ))
                }
            </ul>
        )
}
FileList.propTypes = {
    files: PropTypes.array,
    onFileClickFunc: PropTypes.func,
    onFileDeleteFunc: PropTypes.func,
    onFileRemoveFunc: PropTypes.func,
    onFileNameSaveEdit: PropTypes.func
}
export default FileList