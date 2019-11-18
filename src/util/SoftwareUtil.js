const SystemUtil = require('./SystemUtil')

class SoftwareUtil {
  static getChromePath() {
    let result
    if (SystemUtil.isMac()) {
      result = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    } else {
      throw new Error(`not supported`)
    }
    return result
  }
}

Object.freeze(SoftwareUtil)
module.exports = SoftwareUtil
