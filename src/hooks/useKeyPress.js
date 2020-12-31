import { useState, useEffect } from 'react';
// 监听某键盘按键是否被按下,true:down,false:up,返回true or false
const useKeyPress = (targetKeyCode) => {
    const [keyPressed, setKeyPressed] = useState(false)
    // 按下是true,弹起是false
    const keyDownHandler = ({keyCode}) => {
        if (keyCode === targetKeyCode) setKeyPressed(true)
    }
    const keyUpHandler = ({
        keyCode
    }) => {
        if (keyCode === targetKeyCode) setKeyPressed(false)
    }
    useEffect(() => {
        // 加载时添加监听
        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)

        // 卸载时清除监听
        return(
            () => {
                document.removeEventListener('keydown', keyDownHandler)
                document.removeEventListener('keyup', keyUpHandler)
            }
        )
    }, []) //[]加载
    return keyPressed
}
export default useKeyPress