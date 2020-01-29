const path = require('path')
const os = require('os')
const fse = require('fs-extra')

const SystemUtil = require('./SystemUtil')
const WindowsUtil = require('./WindowsUtil')
const config = require('../../config')

const ideaProductId = 'IdeaIC'
const version = '2019.3'
const generalId = ideaProductId + version

class PathUtil {
    static getIdeaPluginPath() {
         let result

                if(SystemUtil.isMac()){
                    result = path.resolve(os.homedir(), 'Library/Application Support', generalId)
                } else {
                }
                return result
    }
    static getIdeaConfigPath() {
        let result

        if(SystemUtil.isMac()){
            result = path.resolve(os.homedir(), 'Library/Preferences', generalId)
        } else {
            result = path.resolve(os.homedir(), `.${generalId}`, 'config' )
        }
        return result
    }
    static getEntryFolderPath() {
        let result

        if (SystemUtil.isWindows()) {
            const diskAry = WindowsUtil.getWinDiskAry()
            let disk = 'C'
            const nonSystemDisk = 'D'
            if(diskAry.includes(nonSystemDisk)) {
                disk = nonSystemDisk
                 result = path.resolve(`${disk}://`, 'entry')
            } else {
                result = path.resolve(os.homedir(), config.entryFolderName)
            }
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
//        console.log(PathUtil.getEntryFolderPath(), config.codeFolderName, config.workingOnFolderName)
        return PathUtil.process(path.resolve(PathUtil.getEntryFolderPath(), config.codeFolderName || 'code', config.workingOnFolderName || 'working_on'))
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

    static getAbsPath(content) {
        let result
        if (path.isAbsolute(content)) {
            result = content
        } else {
            result = path.resolve(process.cwd(), content)
        }

        return result
    }
}

module.exports = PathUtil
