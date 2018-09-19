/* eslint-disable global-require */
const result = {
  CliUtil: require('./util/CliUtil'),
  ErrorUtil: require('./util/ErrorUtil'),
  FileUtil: require('./util/FileUtil'),
  GitUtil: require('./util/GitUtil'),
  ModuleUtil: require('./util/ModuleUtil'),
  SSHUtil: require('./util/SSHUtil')
}

Object.freeze(result)
module.exports = result
