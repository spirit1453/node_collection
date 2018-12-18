/* eslint-disable no-console */

const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const childProcess = require('child_process')
const debug = require('debug')('debug')
const semver = require('semver')
const rootDir = path.resolve(__dirname, '..')
const constant = require(path.resolve(rootDir, 'constant'))
const {electronDistUrl, sqliteFileName} = constant

class ElectronUtil {
  static installSqlite ({rootDir: _rootDir, shouldMoveToResource = true}) {
    const electronVersion = ElectronUtil.getElectronVersion({rootDir: _rootDir})
    debug({electronVersion})
    const cmd = `npm i sqlite3 --runtime=electron --target=${electronVersion} --dist-url=${electronDistUrl}`
    debug({cmd})
    childProcess.execSync(cmd)

    console.log(chalk.green(`sqlite3 installed successfully`))
    if (shouldMoveToResource) {
      ElectronUtil.moveToResource({rootDir: _rootDir})
    }
  }

  static getElectronVersion ({rootDir: _rootDir}) {
    const nodeModules = path.resolve(_rootDir, 'node_modules')
    const electronFolder = path.resolve(nodeModules, 'electron')
    // eslint-disable-next-line global-require
    const packageJSON = require(path.resolve(_rootDir, 'package.json'))
    let result
    if (fse.existsSync(electronFolder)) {
      const str = childProcess.execSync(
        `npm ls electron`
      ).toString()
      result = str.split('electron@')[1].trim()
    } else {
      const {electron} = packageJSON.devDependencies
      if (electron) {
        result = electron
      } else {
        throw new Error('electron not in devDependencies, please install it first')
      }
    }
    return result
  }

  static moveToResource ({rootDir: _rootDir}) {
    const resource = path.resolve(_rootDir, 'resource')
    const dest = path.resolve(resource, process.platform, sqliteFileName)
    const electronVersion = ElectronUtil.getElectronVersion({rootDir: _rootDir})
    const sqliteNodeFolderName = ElectronUtil.getSqliteNodeFolderName({electronVersion})
    const nodeModules = path.resolve(_rootDir, 'node_modules')
    const sqilteNodeFolder = path.resolve(nodeModules, 'sqlite3/lib/binding', sqliteNodeFolderName)
    fse.ensureDirSync(sqilteNodeFolder)
    const src = path.resolve(sqilteNodeFolder, sqliteFileName)
    fse.copySync(src, dest)
    console.log(chalk.blue(`move builded file to ${dest}, it should be committed`))
  }

  static getSqliteNodeFolderName ({electronVersion}) {
    const major = semver.major(electronVersion)
    const minor = semver.minor(electronVersion)
    return `electron-v${major}.${minor}-${process.platform}-${process.arch}`
  }
}

Object.freeze(ElectronUtil)
module.exports = ElectronUtil
