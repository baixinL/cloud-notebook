import React, {
    useEffect,
    useState
} from 'react';

const {
    ipcRenderer
} = window.require('electron')
/**
 * 
 * @param  keyCallBackMap 
 * {eventName: callback}
 */
const useIpcRenderer = (keyCallBackMap) => {
    useEffect(()=>{
        Object.keys(keyCallBackMap).forEach(key=>{
            ipcRenderer.on(key, keyCallBackMap[key])
        })
        return () => {
            Object.keys(keyCallBackMap).forEach(key => {
                ipcRenderer.removeListener(key, keyCallBackMap[key])
            })
        }
    })
}
export default useIpcRenderer