const path = require('path')
const rootPath = path.resolve(__dirname, '../')

const ModuleUtil = require(path.resolve(rootPath, 'src/util/ModuleUtil'))
const {formIndex} = ModuleUtil

const option = {
  indexFile: path.resolve(rootPath, 'src/index.js'),
  utilDir: path.resolve(rootPath, 'src/util')
}
formIndex(option)
