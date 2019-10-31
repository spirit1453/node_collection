const os = require('os')

const PathUtil = require('./PathUtil')
const CmdUtil = require('./CmdUtil')

class InitUtil {
  static showInfo() {
    CmdUtil.printSepLine('basic system info')
    console.info(`System: ${os.platform()}`)
    console.info(`Entry path: ${PathUtil.getEntryFolderPath()}`)
    CmdUtil.printSepLine('basic system info')

  }

  static softwareRegistry() {

  }


}

Object.freeze(InitUtil)
module.exports = InitUtil
