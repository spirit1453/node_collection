const fse = require('fs-extra')
const path = require('path')

class Cls {
  static isRoot (folder) {
    const packageJson = path.resolve(folder, 'package.json')
    const result = fse.existsSync(packageJson)
    return result
  }
  static throwIfNotRoot (folder) {
    if (!Cls.isRoot(folder)) {
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
}

Object.freeze(Cls)
module.exports = Cls
