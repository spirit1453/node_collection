
const ModuleUtil = require('./util/ModuleUtil')
const path = require('path')

const rootPath = path.resolve(__dirname, '../')
const result = ModuleUtil.requireAll(path.resolve(rootPath, 'src/util'))

Object.freeze(result)
module.exports = result
