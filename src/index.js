/* eslint-disable global-require */
const result = {
  CliUtil: require('./util/CliUtil'),
  ElectronUtil: require('./util/ElectronUtil'),
  ErrorUtil: require('./util/ErrorUtil'),
  FileUtil: require('./util/FileUtil'),
  GitHubUtil: require('./util/GitHubUtil'),
  GitUtil: require('./util/GitUtil'),
  ModuleUtil: require('./util/ModuleUtil'),
  SSHUtil: require('./util/SSHUtil'),
  OtherUtil: require('./util/OtherUtil')
}

Object.freeze(result)
module.exports = result
