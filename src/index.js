/* eslint-disable global-require */
const result = {
  BrewUtil: require('./util/BrewUtil'),
  CliUtil: require('./util/CliUtil'),
  ElectronUtil: require('./util/ElectronUtil'),
  ErrorUtil: require('./util/ErrorUtil'),
  FileUtil: require('./util/FileUtil'),
  FsUtil: require('./util/FsUtil'),
  GitHubUtil: require('./util/GitHubUtil'),
  GitUtil: require('./util/GitUtil'),
  IdeaUtil: require('./util/IdeaUtil'),
  ModuleUtil: require('./util/ModuleUtil'),
  MysqlUtil: require('./util/MysqlUtil'),
  OpenUtil: require('./util/OpenUtil'),
  OtherUtil: require('./util/OtherUtil'),
  PathUtil: require('./util/PathUtil'),
  SSHUtil: require('./util/SSHUtil'),
  SoftwareUtil: require('./util/SoftwareUtil'),
  SystemUtil: require('./util/SystemUtil')
}

Object.freeze(result)
module.exports = result
