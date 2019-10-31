const path = require('path')
const os = require('os')
const fse = require('fs-extra')

const SystemUtil = require('../util/SystemUtil')
// const config = require('../../../config')

class PathUtil {
    static getEntryFolderPath() {
        let result
        if (SystemUtil.isWindows()) {
            const diskAry = SystemUtil.getWinDiskList()
            let disk = 'C'
            const nonSystemDisk = 'D'
            if(diskAry.includes(nonSystemDisk)) {
                disk = nonSystemDisk
            }
            result = path.resolve(`${disk}://`, 'entry')
        } else {
            result = path.resolve(os.homedir(), config.entryFolderName)
        }
        result = PathUtil.process(result)

        return result
    }

    static getGlobalFolderPath() {
        return PathUtil.process(path.resolve(PathUtil.getEntryFolderPath(), config.globalScriptFolderName))
    }
    // should be login bash config file
    static getBashConfigFile() {
        let configFileName
        if(SystemUtil.isMac()){
             configFileName = '.bash_profile'
        } else if(SystemUtil.isLinux()) {
            configFileName = '.bash_profile'
        }

        return PathUtil.process(path.resolve(os.homedir(), configFileName),{
            isDirectory: false
        })
    }

    static getWorkingOnFolder() {
        return PathUtil.process(path.resolve(PathUtil.getEntryFolderPath(), config.codeFolderName, config.workingOnFolderName))
    }

    // all folders get from the methods will be ensured to exist
    static process(dir, option = {}) {
        const {isDirectory = true} = option
        if(isDirectory){
            fse.ensureDir(dir)
        } else {
            fse.ensureFileSync(dir)
        }
        return dir
    }
}

module.exports = PathUtil
