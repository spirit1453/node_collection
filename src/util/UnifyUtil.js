const childProcess = require('child_process')
const path = require('path')

const SystemUtil = require('./SystemUtil')

class UnifyUtil {
  static openUrl(url, option = {}) {
    const {shouldExecute = true} = option
    let cmd
    if (SystemUtil.isWindows()) {
      cmd = `start chrome.exe "${url}"`
        if (shouldExecute) {
            try {
                 childProcess.execSync(cmd, {
                              stdio: 'inherit'
                            })
            } catch(error) {
                cmd = `start microsoft-edge:${url}`
                childProcess.execSync(cmd, {
                                          stdio: 'inherit'
                                        })
            }
          }
    } else {
      cmd = `
          open "${url}"
        `
          if (shouldExecute) {
              childProcess.execSync(cmd, {
                stdio: 'inherit'
              })
            }
    }


    return cmd
  }

   static openFilePath(filePath, option = {}) {
      const {shouldExecute = true} = option
      let cmd
      if (SystemUtil.isWindows()) {
        cmd = `explorer "${filePath}"`
      } else {
          if (path.isAbsolute(filePath)) {
              cmd = `
            open "${filePath}"
          `
          } else {
              cmd = `
            open ${filePath}
          `
          }
        
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
