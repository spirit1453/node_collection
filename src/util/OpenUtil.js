const childProcess = require('child_process')
const chalk = require('chalk')

const SystemUtil = require('./SystemUtil')

class OpenUtil {
  static openUrl(url) {
    let cmdStart

    if (SystemUtil.isWindows()) {
      cmdStart = 'start'
    } else {
      cmdStart = 'open'
    }

    const cmd = `${cmdStart} ${url}`
    console.log(chalk.blue(cmd))
    childProcess.execSync(cmd, {
      stdio: 'inherit'
    })
  }
}

Object.freeze(OpenUtil)
module.exports = OpenUtil
