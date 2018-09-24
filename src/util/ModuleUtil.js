/* eslint-disable global-require */
const fs = require('fs')
const path = require('path')
const debugLog = require('debug')('debug')
const fse = require('fs-extra')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint } = format
const {FileUtil} = require('@ys/vanilla')
const {removeExt} = FileUtil
const {execSync} = require('./CliUtil')
const {getRecentCommit} = require('./GitHubUtil')
const debug = require('debug')('ModuleUtil')

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

    let p = Cls._f(dependencies, projectPath)
    promiseAry.push(p)
    p = Cls._f(devDependencies, projectPath, true)
    promiseAry.push(p)
    return Promise.all(promiseAry)
  }
  static _f (obj, cwd, isDev) {
    debug({cwd})
    const promiseAry = []
    for (const key in obj) {
      const value = obj[key]
      const isFromGit = Cls.isFromGit(value)
      if (isFromGit && (isDev || (!isDev && !Cls.isDependency(cwd)))) {
        const p = new Promise(resolve => {
          const option = Cls.getRepoInfo(value)
          debug({repoInfo: option})
          ;(async () => {
            const {sha: remoteSha} = await getRecentCommit(option)
            const localSha = Cls.getGitModuleSha({
              rootPath: cwd, moduleName: key, moduleSrc: value
            })
            if (localSha !== remoteSha) {
              execSync(`
          npm i ${value} ${isDev ? '-D' : ''}
        `, {
                cwd
              })
            }

            resolve()
          })()
        })
        promiseAry.push(p)
      }
    }
    return Promise.all(promiseAry)
  }
  static installGit (rootPathDir) {
    const logFolder = path.resolve(rootPathDir, 'local/log')
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
      await Cls._installGit(path.resolve(rootPathDir, 'package.json'))
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
  static isDependency (rootPathDir) {
    return path.basename(path.resolve(rootPathDir, '../')) === 'node_modules'
  }
  static getGitModuleSha (option) {
    const {rootPath: rootPathDir, moduleName, moduleSrc} = option
    const isFromGit = Cls.isFromGit(moduleSrc)
    let result
    if (isFromGit) {
      const moduleNameAry = moduleName.split('/')
      let packageJsonPath = path.join(rootPathDir, 'node_modules', ...moduleNameAry, 'package.json')
      if (!fs.existsSync(packageJsonPath)) {
        packageJsonPath = path.join(rootPathDir, '../', ...moduleNameAry, 'package.json')
      }
      const modulePackageObj = require(packageJsonPath)
      const sha = modulePackageObj._resolved.split('#').pop()
      result = sha
    } else {
      throw new Error(`${moduleSrc} is not a git repo`)
    }
    return result
  }
  static isFromGit (value) {
    const protocolAry = ['git:', 'http', 'git+https', 'github', 'git@']
    const condition = protocolAry.some(ele => {
      return value.startsWith(`${ele}:`)
    })
    return Boolean(condition)
  }
  static getRepoInfo (gitSrc) {
    const gitSuffix = '.git'
    let branch, owner, repo
    if (gitSrc.includes(gitSuffix)) {
      let ary = gitSrc.split(gitSuffix)
      branch = ary[1].split('#')[1]
      ary = ary[0].split('/')
      repo = ary.pop()
      owner = ary.pop().split(':').pop()
    } else {
      let ary = gitSrc.split('github:')[1].split('/')
      owner = ary[0]
      ary = ary[1].split('#')
      repo = ary[0]
      branch = ary[1]
    }
    branch = branch || Cls.getDefaultRepo({owner, repo})
    return {
      owner, repo, branch
    }
  }
  static getDefaultRepo ({owner, repo}) {
    return 'master'
  }
}

Object.freeze(Cls)
module.exports = Cls
