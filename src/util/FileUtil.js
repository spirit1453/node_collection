const fse = require('fs-extra')
const path = require('path')
const {execSync} = require('child_process')
const fs = require('fs')

class FileUtil {
  static isRoot (folder) {
    const packageJson = path.resolve(folder, 'package.json')
    const result = fse.existsSync(packageJson)
    return result
  }
  static throwIfNotRoot (folder) {
    if (!FileUtil.isRoot(folder)) {
      throw new Error(`${folder} is not a standard node project`)
    }
  }
  static getAbsolutePath (itemPath) {
    let result = itemPath
    if (!path.isAbsolute(itemPath)) {
      result = path.resolve(process.cwd(), itemPath)
    }
    return result
  }
  static monitorPlugableDisk (callback) {
    const volumeFolder = '/Volumes'
    let orignalItemAry = fse.readdirSync(volumeFolder)

    let ChangeType = {
      plugin: 1,
      plugout: 2
    }
    fse.watch(volumeFolder, (eventType, fileName) => {
      let newItemAry = fse.readdirSync(volumeFolder)
      orignalItemAry = newItemAry
      let changeType
      if (newItemAry.length < orignalItemAry.length) {
        changeType = ChangeType.plugout
      } else {
        changeType = ChangeType.plugin
      }
      callback(null, {
        isPlugin: changeType === ChangeType.plugin,
        fileName
      })
    })
  }

  static webstorm (filepath) {
    execSync(`
       webstorm ${filepath}
      `)
  }

  static getRealPath(filePath) {
    const isSymbolic = fs.lstatSync(gitPath).isSymbolicLink()

    const result = {isSymbolic}
    if(isSymbolic){
      result.realPath = fs.realpathSync(gitPath)
    } else {
      result.realPath = filePath
    }
    return result
  }
}

Object.freeze(FileUtil)
module.exports = FileUtil
