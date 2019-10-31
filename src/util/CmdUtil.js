const childProcess = require('child_process')
const _ = require('lodash')
const info = require('debug')('info')
const verbose = require('debug')('verbose')
const warn = require('debug')('warn')
const errorDebug = require('debug')('error')
const os = require('os')

class CmdUtil {
    static execSync (cmd, option = {}) {
        const defaultOption = {
          stdio: [process.stderr, process.stdin, process.stdout]
        }
        info(`executing: ${cmd}`)
        return childProcess.execSync(cmd, _.merge(defaultOption, option))
      }

     static exec(cmd, option = {}) {
        return new Promise((resolve, reject) => {
            info(`executing: ${cmd}`)

            const cp = childProcess.exec(cmd, _.merge({}, option), (error, stdout, stderr) => {
                const processError = (err) => {
                    console.error(err)
                    reject(err)
                }
                if (error) {
                    errorDebug(`${cmd} failed`)
                    processError(error)
                }else{
                    // git output to stderr
                    if (stderr) {
                        warn(`${cmd} has stderr output`)
                        console.log(stderr)
                    }
                    console.log(stdout)
                    resolve()
                }
            })

            cp.stdout.on('data', (d) => {
                console.log(d)
            })
        })
     }

    static isInstalled(cmd, option={}) {
      const {
          alertInstalled = true,
      } = option
      let result = true
      try {
          let testCmd
          if (os.platform() === 'win32') {
              testCmd = `where ${cmd}`
          } else {
              testCmd = `which ${cmd}`
          }
        childProcess.execSync(testCmd)
        if(alertInstalled) {
            verbose(`${cmd} has already been installed`)
        }
      } catch(err) {
          console.log(err.stderr.toString())
        result = false
      }
      return result
    }

    static getCmdResult(cmd) {
        return childProcess.execSync(cmd).toString().trim()
    }

    static printSepLine(title, option = {}) {
        const {
            sepCount = 20,
            returnOnStart = false,
            returnOnEnd = false
        } = option
        let info = ''
        for(let i = 0; i < sepCount; i++ ) {
            info += '*'
        }
        if (returnOnStart) {
            console.log()
        }
        console.info(`${info}${title}${info}`)
        if (returnOnEnd) {
            console.log()
        }

    }
}

module.exports = CmdUtil
