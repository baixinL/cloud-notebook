import React, { useState,useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useKeyPress from './../hooks/useKeyPress.js'
import PropTypes from 'prop-types'

const FileList = ({
        files,
        onFileClickFunc,
        onFileDeleteFunc,
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
        if (files.find(file => file.id === value)) return alert('文件名已存在')
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
                                        className="col"
                                        onClick={() => { onFileClickFunc(file.id) }}
                                    >
                                        {file.title}
                                    </span>
                                    <button
                                        type="button"
                                        className="icon-button col-1"
                                        onClick={() => { setChangeEdit(file.id, file.title)}}
                                    >
                                        <FontAwesomeIcon
                                            title="编辑"
                                            icon={faEdit}
                                            size="lg"
                                        />
                                    </button>
                                    <button type="button" className="icon-button col-1" onClick={() => { onFileDeleteFunc(file.id) }}>
                                        <FontAwesomeIcon
                                            title="删除"
                                            icon={faTrash}
                                            size="lg"
                                        />
                                    </button>
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
    onFileNameSaveEdit: PropTypes.func
}
export default FileList