import React, { useState,useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import useKeyPress from './../hooks/useKeyPress.js'
import PropTypes from 'prop-types'
const FileSearch =  ({ title, onFileSearch, searchStateChange }) => {
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)
    const [inputActive, setInputActive] = useState(false)
    const [value, setValue] = useState('')
    let node = useRef(null)
    useEffect(() => {
        if (inputActive) {
            // console.log(' node.current:', node.current)//input
            node.current.focus()
        }
        searchStateChange(inputActive)
    }, [inputActive])
    const closeSearch = () => {
        setInputActive(false)
        setValue('')
        onFileSearch('')
    }
    useEffect(()=>{
        if (enterPressed && inputActive) onFileSearch(value)
    })
    useEffect(() => {
        if (escPressed && inputActive) closeSearch()
    })
    return (
        < div className = "alert alert-primary d-flex justify-content-between align-items-center search-wrap mb-0">
            {
                !inputActive && 
                <>
                    <span className="col-10">{title}</span>
                    <button type="button" className="icon-button col-2" onClick={()=>{setInputActive(true);}}>
                        <FontAwesomeIcon
                            title="搜索"
                            icon={faSearch}
                            size="lg"
                        />
                    </button>
                    
                </>
            }
            {
                inputActive && 
                <>
                    <input
                        className = "form-control input-sm search-input col-10"
                        value={value}
                        ref={node}
                        onChange={(e)=>{setValue(e.target.value)}}></input>
                    <button
                        type="button"
                        className = "icon-button col-2"
                        onClick={()=>{closeSearch()}}
                        >
                        <FontAwesomeIcon
                            title = "关闭"
                            icon={faTimes}
                            size="lg"
                        />
                    </button>
                </>
            }
        </div>
    )
}

FileSearch.propTypes = {
    title: PropTypes.string,
    onFileSearch: PropTypes.func.isRequired
}
FileSearch.defaultProps = {
    title: "我的云文档"
}
export default FileSearch