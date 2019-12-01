
class WindowsUtil {
  static getWinDiskAry() {
    if (SystemUtil.isWindows()) {
      const info = CmdUtil.getCmdResult(`wmic logicaldisk get name`)
      const result = info.split('\n').map(ele => ele.trim().replace(':', '')).slice(1)
      return result
    } else {
      console.error(`getWinDiskList can only be invoked in windows, you are at ${os.platform()} system`)
    }
  }
}

Object.freeze(WindowsUtil)
module.exports = WindowsUtil
