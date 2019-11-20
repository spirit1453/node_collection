const SystemUtil = require('./SystemUtil')

class SoftwareUtil {
  static getChromePath() {
    let result
    if (SystemUtil.isMac()) {
      result = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    } else if (SystemUtil.isWindows()){
      result = 'C:\\Program Files (x86)\\Google\\Chrome\\Application'
    } else {
      throw new Error(`not supported`)
    }
    return result
  }
}

Object.freeze(SoftwareUtil)
module.exports = SoftwareUtil
