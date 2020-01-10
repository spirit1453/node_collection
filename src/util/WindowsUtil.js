const os = require('os')
const childProcess = require('child_process')

// fixme: 循环依赖
// const CmdUtil = require('./CliUtil')
const SystemUtil = require('./SystemUtil')

function getCmdResult(cmd) {
  return childProcess.execSync(cmd).toString().trim()
}

class WindowsUtil {
  static getWinDiskAry() {
    if (SystemUtil.isWindows()) {
      const info = getCmdResult(`wmic logicaldisk get name`)
      const result = info.split('\n').map(ele => ele.trim().replace(':', '')).slice(1)
      return result
    } else {
      console.error(`getWinDiskList can only be invoked in windows, you are at ${os.platform()} system`)
    }
  }
}

Object.freeze(WindowsUtil)
module.exports = WindowsUtil
