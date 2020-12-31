export const FlaternArr = (arr, key = 'id') => {
    return arr.reduce((map, item) => {
        map[item[key]] = item
        return map
    }, {})
}

export const ObjToArr = (obj) => {
    return Object.keys(obj).map(key => obj[key]) || []
}