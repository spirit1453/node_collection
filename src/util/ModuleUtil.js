/* eslint-disable global-require */
const fs = require('fs')
const {removeExt} = require('./FileUtil')
const path = require('path')
const debugLog = require('debug')('debug')
const childProcess = require('child_process')
const fse = require('fs-extra')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint } = format

class Cls {
  static requireAll (folderPath) {
    const result = {}
    const fileAry = fs.readdirSync(folderPath)
    for (let ele of fileAry) {
      if (ele.endsWith('.js')) {
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
    const ary = [dependencies, devDependencies]
    const projectPath = path.resolve(packageJsonPath, '..')

    const promiseAry = []
    ary.forEach(ele => {
      const p = Cls._f(ele, projectPath)
      promiseAry.push(p)
    })
    return Promise.all(promiseAry)
  }
  static _f (obj, cwd) {
    const promiseAry = []
    for (const key in obj) {
      const value = obj[key]
      const protocolAry = ['git', 'http', 'git+https']
      const condition = protocolAry.some(ele => {
        return value.startsWith(`${ele}://`)
      })
      const p = new Promise(resolve => {
        if (condition) {
          childProcess.execSync(`
          npm i ${key}
        `, {
            cwd
          })
        }
        resolve()
      })
      promiseAry.push(p)
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
}

Object.freeze(Cls)
module.exports = Cls