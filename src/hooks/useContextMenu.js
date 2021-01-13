import {useEffect, useRef} from 'react'

const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

const useContextMenu = (itemArr, targetSelector, deps) => {
    let clickedNode = useRef(null)
    useEffect(()=>{
        const menu = new Menu()
        itemArr.forEach(item => {
            menu.append(new MenuItem(item))
        })
        const handler = (e) => {
            // 区域限定；e.targets是否时document.querySelector(targetSelector)的子节点
            if (document.querySelector(targetSelector).contains(e.target)) {
                clickedNode.current = e.target
                e.preventDefault()
                menu.popup({
                    window: remote.getCurrentWindow()
                })
            }
        }
        window.addEventListener('contextmenu', handler)
        return () => {
            window.removeEventListener('contextmenu', handler)
        }
    })
    return clickedNode
}
export default useContextMenu