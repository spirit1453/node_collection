/* eslint-disable no-empty */
const childProcess = require('child_process')
const _ = require('lodash')
const inquirer = require('inquirer')

class CliUtil {
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
  static execSync (cmd, option) {
    const defaultOption = {
      stdio: [process.stderr, process.stdin, process.stdout]
    }
    return childProcess.execSync(cmd, _.merge(defaultOption, option))
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
}

Object.freeze(CliUtil)
module.exports = CliUtil
