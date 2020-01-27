const childProcess = require('child_process')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

const SystemUtil = require('./SystemUtil')

class UnifyUtil {
  static openUrl(url, option = {}) {
    const {shouldExecute = true, shouldLog = false} = option
    let cmd
    if (SystemUtil.isWindows()) {
      cmd = `start chrome.exe "${url}"`
        if (shouldExecute) {
            try {
                 childProcess.execSync(cmd)
            } catch(error) {
                // fixme: windows still popup error window
                cmd = `start microsoft-edge:${url}`
                childProcess.execSync(cmd, {
                                          stdio: 'inherit'
                                        })
            }
          }
    } else {
      const chromeMacLocation = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

      if (SystemUtil.isMac() && fs.existsSync(chromeMacLocation)) {
        cmd = `${chromeMacLocation} ${url}`
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
    }

    if (shouldLog) {
         console.log(chalk.blue(cmd.trim()))
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
