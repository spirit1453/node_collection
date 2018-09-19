const fse = require('fs-extra')
const path = require('path')

class Cls {
  static isRoot (folder) {
    const packageJson = path.resolve(folder, 'package.json')
    const result = fse.existsSync(packageJson)
    return result
  }
}

Object.freeze(Cls)
module.exports = Cls
