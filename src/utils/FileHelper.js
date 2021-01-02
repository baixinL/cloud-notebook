const {
    writeFileSync,
    readFileSync,
    unlinkSync,
    renameSync,
    readdirSync
} = window.require('fs')
const {
    dirname,
    basename
} = window.require('path')

const FileHelper = {
    // write data in file
    writeFileSync: (file, data) => {
        return writeFileSync(file, data, 'utf-8')
    },
    // read file
    readFileSync: (path) => {
        return readFileSync(path, 'utf-8')
    },
    // change filename
    renameSync: (oldPath, newPath) => {
        const newPathDir = dirname(newPath)
        const newPathBaseName = basename(newPath)
        const newPathDirFileList = readdirSync(newPathDir)
        console.log('newPathDirFileList:', newPathDirFileList);
        const ifHadSameNameFile = newPathDirFileList.find(filePath => basename(filePath) === newPathBaseName)
        if (ifHadSameNameFile) throw new Error('目标目录下已存在同名文件！')
        return renameSync(oldPath, newPath)
    },
    // delete file
    removeFileSync: (path) => {
        return unlinkSync(path)
    } 
}

export default FileHelper



