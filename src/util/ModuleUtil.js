/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')
const debugLog = require('debug')('debug')
const childProcess = require('child_process')
const fse = require('fs-extra')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint } = format
const {FileUtil} = require('@ys/vanilla')
const {removeExt} = FileUtil

class Cls {
  static requireAll (folderPath, option = {
    ignoreIndex: true
  }) {
    const result = {}
    const {ignoreIndex} = option
    const fileAry = fs.readdirSync(folderPath)
    for (let ele of fileAry) {
      if (ele.endsWith('.js')) {
        if (ignoreIndex && ele === 'index.js') {
          continue
        }
        const fileName = removeExt(ele)
        result[fileName] = require(path.resolve(folderPath, ele))
      }
    }
    debugLog(`${result}`)

    return result
  }
  static _installGit (packageJsonPath) {
    const packageObj = require(packageJsonPath)
    const {dependencies, devDependencies} = packageObj
    const projectPath = path.resolve(packageJsonPath, '..')

    const promiseAry = []

    const ary = [dependencies, devDependencies]
    let p = Cls._f(dependencies, projectPath)
    promiseAry.push(p)
    p = Cls._f(devDependencies, projectPath, true)
    promiseAry.push(p)
    return Promise.all(promiseAry)
  }
  static _f (obj, cwd, isDev) {
    const promiseAry = []
    for (const key in obj) {
      const value = obj[key]
      const protocolAry = ['git', 'http', 'git+https', 'github']
      const condition = protocolAry.some(ele => {
        return value.startsWith(`${ele}:`)
      })
      if (isDev || (!isDev && !Cls.isDependency(cwd))) {
        const p = new Promise(resolve => {
          if (condition) {
            childProcess.execSync(`
          npm i ${value} ${isDev ? '-D' : ''}
        `, {
              cwd
            })
          }
          resolve()
        })
        promiseAry.push(p)
      }
    }
    return Promise.all(promiseAry)
  }
  static installGit (rootPath) {
    const logFolder = path.resolve(rootPath, 'local/log')
    fse.ensureDirSync(logFolder)
    const errorLog = path.resolve(logFolder, 'error.log')
    const logger = createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.File({ filename: errorLog, level: 'error' })
      ]
    })
    return (async () => {
      await Cls._installGit(path.resolve(rootPath, 'package.json'))
    })().catch((err) => {
      logger.error(err)
    })
  }
  static formIndex (option) {
    const {indexFile, utilDir} = option

    const str1 = `/* eslint-disable global-require */
const result = {\n`
    const str3 = `\n}

Object.freeze(result)
module.exports = result\n`
    let str2 = '  '
    const fileAry = fse.readdirSync(utilDir)
    const {length} = fileAry
    for (let i = 0; i < length; i++) {
      const file = fileAry[i]
      const pureName = removeExt(file)
      str2 += `${pureName}: require('./util/${pureName}')`
      if (i !== length - 1) {
        str2 += `,\n  `
      }
    }

    fse.writeFileSync(indexFile, str1 + str2 + str3)
  }
  static isDependency (rootPath) {
    return path.basename(path.resolve(rootPath, '../')) === 'node_modules'
  }
}

Object.freeze(Cls)
module.exports = Cls
