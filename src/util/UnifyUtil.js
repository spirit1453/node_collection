const childProcess = require('child_process')

const SystemUtil = require('./SystemUtil')

class UnifyUtil {
  static openUrl(url, option = {}) {
    const {shouldExecute = true} = option
    let cmd
    if (SystemUtil.isWindows()) {
      cmd = `start chrome.exe "${url}"`
    } else {
      cmd = `
          open "${url}"
        `
    }
    if (shouldExecute) {
      childProcess.execSync(cmd, {
        stdio: 'inherit'
      })
    }

    return cmd
  }

   static openFilePath(filePath, option = {}) {
      const {shouldExecute = true} = option
      let cmd
      if (SystemUtil.isWindows()) {
        cmd = `explorer "${filePath}"`
      } else {
        cmd = `
            open "${filePath}"
          `
      }
      if (shouldExecute) {
        childProcess.execSync(cmd, {
          stdio: 'inherit'
        })
      }
      return cmd
    }
}

Object.freeze(UnifyUtil)
module.exports = UnifyUtil
