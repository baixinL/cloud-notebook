export const FlaternArr = (arr, key = 'id') => {
    return arr.reduce((map, item) => {
        map[item[key]] = item
        return map
    }, {})
}

export const ObjToArr = (obj) => {
    return Object.keys(obj).map(key => obj[key]) || []
}
export const returnTimes = ()=> {
    return (new Date()).getTime()
}

export const getParentNode = (node, parentClass) => {
    let cur = node
    while(cur!==null) {
        if (cur.classList&&cur.classList.contains(parentClass)) return cur
        cur = cur.parentNode
    }
    return
}