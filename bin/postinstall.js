const path = require('path')
const rootPath = path.resolve(__dirname, '../')
const ModuleUtil = require(path.resolve(rootPath, 'src/util/ModuleUtil'))
const {installGit} = ModuleUtil

installGit(rootPath)
