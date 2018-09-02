/* eslint-disable global-require */
const fs = require('fs')
const {removeExt} = require('./FileUtil')
const path = require('path')
const debugLog = require('debug')('debug')
const childProcess = require('child_process')

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
  static installGit (packageJsonPath) {
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
}

Object.freeze(Cls)
module.exports = Cls
