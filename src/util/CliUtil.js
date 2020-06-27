/* eslint-disable no-empty */
const childProcess = require('child_process')
const _ = require('lodash')
const inquirer = require('inquirer')
const fs = require('fs')
const chalk = require('chalk')

const FileUtil = require('./FileUtil')
const SystemUtil = require('./SystemUtil')

class CliUtil {
	static runScript(filePath) {
		let cmd = ''
		if (SystemUtil.isWindows()) {
			cmd = filePath
		} else {
			cmd = `bash ${filePath}`
		}

		childProcess.execSync(cmd, {
        			  stdio: 'inherit'
        			})
	}
  static haveSthToCommit(cwd) {
        let execOption = {}
        if (cwd) {
            execOption.cwd = cwd
        }
        const statusStr = CliUtil.getCmdResult('git status', {
            execOption
        })
//        console.log(statusStr)
        return !statusStr.includes('nothing to commit')
  }
  static getCmdEntryPath(cmdEntry) {
    let result
    try {
      let cmd
      if (SystemUtil.isWindows()) {
        cmd = `where ${cmdEntry}`
      } else {
        cmd = `which ${cmdEntry}`
      }
      // console.log(cmd)
      result = childProcess.execSync(cmd).toString().trim()
    } catch(error) {
      console.log(error)
    }

    return result
  }

  static checkOption (option) {

    // const questionAry = []
    // const param = {}
    //
    // for (let key in option) {
    //   const question = option[key]
    //   const inputValue = argv[key]
    //   if (!inputValue) {
    //     const {default: defaultValue} = question
    //     if (defaultValue) {
    //       param[key] = defaultValue
    //     } else {
    //       question.name = key
    //       questionAry.push(question)
    //     }
    //   } else {
    //     param[key] = inputValue
    //   }
    // }
    // const {length} = questionAry
    // if (length) {
    //   const answer = await inquirer.prompt(questionAry)
    //
    //   _.merge(param, answer)
    // }
  }
  static killPort (...portAry) {
    for (let port of portAry) {
      const pid = CliUtil.getPid(port)
      if (pid) {
        childProcess.execSync(`kill ${pid}`)
      }
    }
  }
  static getPid (port) {
    let pid
    try {
      const output = childProcess.execSync(`
      lsof -i :${port}
    `).toString()
      if (output) {
        pid = output.split('\n')[1].split(' ').filter(ele => ele)[1]
      }
    } catch (err) {

    }

    return pid
  }

  static async mergeOption ({argv, option = {}}) {
    const questionAry = []
    const param = {}
    for (let key in option) {
      const question = option[key]
      const inputValue = argv[key]
      if (inputValue) {
        param[key] = inputValue
      } else {
        const {default: defaultValue} = question
        if (defaultValue) {
          param[key] = defaultValue
        } else {
          question.name = key
          questionAry.push(question)
        }
      }
    }
    const {length} = questionAry
    if (length) {
      const answer = await inquirer.prompt(questionAry)
      _.merge(param, answer)
    }
    return param
  }

  static execSync (cmd, option = {}) {
    const {
        shouldLog = true,
        execOption = {}
    }  = option
    const defaultOption = {
      stdio: 'inherit'
    }
    if (shouldLog) {
        console.log(chalk.blue(cmd))
    }
    return childProcess.execSync(cmd, _.merge(defaultOption, execOption))
  }

  static exec(cmd, option = {}) {
    return new Promise((resolve, reject) => {

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
      // fixme: os is not defined, auto refactoring
      if (SystemUtil.isWindows()) {
        testCmd = `where ${cmd}`
      } else {
        testCmd = `which ${cmd}`
      }
      childProcess.execSync(testCmd)

    } catch(err) {
      // console.log(err)
      result = false
    }
    return result
  }

  static getCmdResult(cmd, option = {}) {
    const {
    execOption = {}
    } = option
    return childProcess.execSync(cmd, execOption).toString().trim()
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
  // if cmd is not install, return undefined
  static getRealPathOfCmd(cmd) {
    let result
    if (CliUtil.isInstalled(cmd)) {
      const cmdPath = CliUtil.getCmdResult(`which ${cmd}`)
      result = FileUtil.getRealPath(cmdPath)
      result.cmdPath = cmdPath
    }

    return result
  }
}

Object.freeze(CliUtil)
module.exports = CliUtil
