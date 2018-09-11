const fse = require('fs-extra')
const path = require('path')

class Cls {
  static removeExt (fileName) {
    return fileName.split('.')[0]
  }
  static isRoot (folder) {
    const packageJson = path.resolve(folder, 'package.json')
    const result = fse.existsSync(packageJson)
    return result
  }
}

Object.freeze(Cls)
module.exports = Cls
