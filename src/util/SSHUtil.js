const {CliUtil} = require('@ys/vanilla')
const {info} = CliUtil

class SSHUtil {
  static async execCommand (option) {
    const {print = true, ssh, cmd, cwd} = option

    const result = await ssh.execCommand(cmd, { cwd })

    const {stdout, stderr} = result
    if (stdout) {
      if (print) {
        info([stdout])
      }
      return stdout
    }
    if (stderr) {
      throw new Error(stderr)
    }

    return null
  }
}

Object.freeze(SSHUtil)
module.exports = SSHUtil
