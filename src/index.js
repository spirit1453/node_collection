<<<<<<< HEAD
/* eslint-disable global-require */
const result = {
  CliUtil: require('./util/CliUtil'),
  ElectronUtil: require('./util/ElectronUtil'),
  ErrorUtil: require('./util/ErrorUtil'),
  FileUtil: require('./util/FileUtil'),
  GitHubUtil: require('./util/GitHubUtil'),
  GitUtil: require('./util/GitUtil'),
  ModuleUtil: require('./util/ModuleUtil'),
  SSHUtil: require('./util/SSHUtil')
}
=======

const ModuleUtil = require('./util/ModuleUtil')
const path = require('path')

const rootPath = path.resolve(__dirname, '../')
const result = ModuleUtil.requireAll(path.resolve(rootPath, 'src/util'))
>>>>>>> f58d9223f8d1aa612039eb44b788dd23da5f5c18

Object.freeze(result)
module.exports = result
