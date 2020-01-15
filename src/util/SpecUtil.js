const chalk = require('chalk')
const childProcess = require('child_process')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const FileUtil = require('./FileUtil')
const UnifyUtil = require('./UnifyUtil')
const PathUtil = require('./PathUtil')
const SystemUtil = require('./SystemUtil')
const CliUtil = require('./CliUtil')

const rootPath = path.resolve(__dirname, '../../')
const config = require(path.resolve(rootPath, 'config'))

class SpecUtil {
  static open(itemPath, option={}) {
    const {shouldLog = true} = option
    const cmdEntry = ['idea', 'code'].find(ele => CliUtil.isInstalled(ele))
    if (cmdEntry) {
         const cmd = `${cmdEntry} ${FileUtil.getAbsolutePath(itemPath)}`

            if (shouldLog) {
                console.log(chalk.blue(cmd))
            }
            childProcess.execSync(cmd, {
                  stdio: 'inherit'
            })
    } else {
        console.log(chalk.red('code and idea are not installed'))
    }
  }
  static webUrl(option) {
    const {
      kvMap, argv, filename, defaultAction
    } = option

    const type = argv._[1]
    const {e: shouldEdit, s: shouldBeSilent} = argv
    if (shouldEdit) {
      const cmd = `idea ${filename}`
      childProcess.execSync(cmd, {
        stdio: 'inherit'
      })
    } else {
      const indexContent = Object.keys(kvMap).sort().map((ele, index) => {
        return `${index + 1}. ${ele}\n`
      }).join('')
      const optionSupported = `\n${chalk.blue(indexContent)} are supported`
      if (type) {
        const value = kvMap[type]
        if (value) {
          let url
          if (_.isString(value)) {
            url = value
          } else if (_.isFunction(value)) {
            url = value(argv._.slice(2))
          } else {
            console.log(`${chalk.red(typeof(value))} for ${chalk.red(value)} is not supported`)
          }
          if (url) {
            UnifyUtil.openUrl(url, {
                shouldExecute: !shouldBeSilent,
                shouldLog: true
            })
          }

        } else {
          console.log(`Type ${chalk.red(type)} is not supported, \n${optionSupported}`)
        }
      } else  {
        if (defaultAction) {
          if (_.isString(defaultAction)) {
            UnifyUtil.openUrl(defaultAction)
          } else if (_.isFunction(defaultAction)) {
            defaultAction()
          } else {
            console.log(`${chalk.red(defaultAction)} is not function or string`)
          }
        } else {
          console.log(`Type should be specified as the third parameter, ${optionSupported}`)
        }
      }
    }
  }

  static typeFunc(option) {
    const {kvMap, argv, filename, defaultAction} = option

    const type = argv._[1]
    const {e: shouldEdit, s: shouldBeSilent, l: listAllOption} = argv
    if (shouldEdit) {
      const cmd = `idea ${filename}`
      childProcess.execSync(cmd, {
        stdio: 'inherit'
      })
    } else {
      const indexContent = Object.keys(kvMap).sort().map((ele, index) => {
        return `${index + 1}. ${ele}\n`
      }).join('')
      const optionSupported = `\n${chalk.blue(indexContent)} are supported`
      if (type) {
        const value = kvMap[type]
        if (value) {
          let url
          if (_.isString(value)) {
            url = value
          } else if (_.isFunction(value)) {
            url = value(argv._.slice(2))
            if (!url) {
                return
            }
          } else {
            console.log(`${chalk.red(typeof(value))} for ${chalk.red(value)} is not supported`)
          }
          if (url) {
            UnifyUtil.openUrl(url, {
                            shouldExecute: !shouldBeSilent,
                            shouldLog: true
                        })
          }

        } else {
          console.log(`Type ${chalk.red(type)} has no value, \n${optionSupported}`)
        }
      } else  {
        if (!listAllOption && defaultAction) {
          if (_.isString(defaultAction)) {
            UnifyUtil.openUrl(defaultAction)
          } else if (_.isFunction(defaultAction)) {
            defaultAction()
          } else {
            console.log(`${chalk.red(defaultAction)} is not function or string`)
          }
        } else {
          console.log(`Type should be specified as the third parameter, ${optionSupported}`)
        }
      }
    }
  }

  static checkThirdArg(argv, option = {}) {
    const {
      shouldComplain = true
    } = option
    let result
    const content = argv._[1]
    if (content) {
      result = content
    } else {
      result = false
      if (shouldComplain) {
        console.log(chalk.red('The third argument should be specified'))
      }
    }
    return result
  }

  static getYsOpen() {
        let {ysOpen} = config
        const entryFolderPath = PathUtil.getEntryFolderPath()

        const defaultYsOpenObj = {
            programfile: 'C:\\Program Files',
            jetbrain: 'C:\\Program Files\\JetBrains',
        }
        ysOpen = _.merge(defaultYsOpenObj, ysOpen)

        ysOpen.entry = entryFolderPath

        const dirPath = entryFolderPath
            fs.readdirSync(dirPath).forEach(ele => {
              const absPath = path.resolve(dirPath, ele)
              if (fs.statSync(absPath).isDirectory()) {
                  ysOpen[ele] = absPath
              }
            })
        return ysOpen
  }
}

Object.freeze(SpecUtil)
module.exports = SpecUtil
