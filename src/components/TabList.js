import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome'
import {
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import classNames from 'classnames'


const TabList = ({
        files,
        activeId,
        unSavedIds,
        onTabClick,
        onTabClose
    }) => {
    return (
        <ul className="nav nav-pills">
            {
                files.map(file => {
                    // console.log('file:',file);
                    if (!file) return
                    const unSave = unSavedIds && unSavedIds.indexOf(file.id) > -1;
                    const fclassNames = classNames({
                        'nav-link': true,
                        'active': file.id === activeId,
                        'unsave': unSave
                    })
                    return (
                        <li className="nav-item tab-btn" key={file.id}>
                            <a 
                                href="#"
                                className={fclassNames}
                                onClick={(e)=> {
                                    e.preventDefault();
                                    onTabClick(file.id);
                                }}
                            >
                                {file.title || '[文件名]'}
                                <span className="mx-1 tab-btn-close">
                                    <FontAwesomeIcon
                                        title="关闭"
                                        icon={faTimes}
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            onTabClose(file.id)
                                        }}
                                    />
                                </span>
                                {
                                    unSave &&
                                    <span className="mx-1 unsave-dot"></span>
                                }
                            </a>
                        </li>
                    )
                })
            }
            
        </ul>
    )
}
TabList.propTypes ={
    files: PropTypes.array,
    activeId: PropTypes.string,
    unSavedIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onTabClose: PropTypes.func
}
TabList.defaultProps = {
    files: [],
    unSavedIds: []
}
export default TabList