const {
    writeFileSync,
    readFileSync,
    unlinkSync,
    renameSync
} = window.require('fs')

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
        return renameSync(oldPath, newPath)
    },
    // delete file
    removeFileSync: (path) => {
        return unlinkSync(path)
    } 
}

export default FileHelper



