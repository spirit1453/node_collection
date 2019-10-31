const fse = require('fs-extra')
const path = require('path')
const {execSync} = require('child_process')
const fs = require('fs')
const chalk = require('chalk')

const GitUtil = require('./GitUtil')

class FileUtil {
  static isRoot (folder) {
    const packageJson = path.resolve(folder, 'package.json')
    const result = fse.existsSync(packageJson)
    return result
  }
  static throwIfNotRoot (folder) {
    if (!FileUtil.isRoot(folder)) {
      throw new Error(`${folder} is not a standard node project`)
    }
  }
  static getAbsolutePath (itemPath) {
    let result = itemPath
    if (!path.isAbsolute(itemPath)) {
      result = path.resolve(process.cwd(), itemPath)
    }
    return result
  }
  static monitorPlugableDisk (callback) {
    const volumeFolder = '/Volumes'
    let orignalItemAry = fse.readdirSync(volumeFolder)

    let ChangeType = {
      plugin: 1,
      plugout: 2
    }
    fse.watch(volumeFolder, (eventType, fileName) => {
      let newItemAry = fse.readdirSync(volumeFolder)
      orignalItemAry = newItemAry
      let changeType
      if (newItemAry.length < orignalItemAry.length) {
        changeType = ChangeType.plugout
      } else {
        changeType = ChangeType.plugin
      }
      callback(null, {
        isPlugin: changeType === ChangeType.plugin,
        fileName
      })
    })
  }

  static webstorm (filepath) {
    execSync(`
       webstorm ${filepath}
      `)
  }

  static getRealPath(filePath) {
    const isSymbolic = fs.lstatSync(gitPath).isSymbolicLink()

    const result = {isSymbolic}
    if(isSymbolic){
      result.realPath = fs.realpathSync(gitPath)
    } else {
      result.realPath = filePath
    }
    return result
  }

  static scan(option) {
    let fileCount = 0

    const {projectDir, handleFileFunc} = option
    const ignorePath = path.resolve(projectDir, '.gitignore')
    const ig = GitUtil.getIgnore(ignorePath)

    const recur = (dir) => {
      const relPath = path.relative(projectDir, dir)
      const shouldScan = (dir === projectDir || !ig.ignores(relPath)) && relPath !== '.git'
      if (shouldScan) {
        const stat = fs.statSync(dir)
        if (stat.isDirectory()) {
          fs.readdirSync(dir).forEach(ele => {
            const elePath = path.resolve(dir, ele)
            recur(elePath)
          })
        } else if (stat.isFile()) {
          fileCount++
          handleFileFunc(dir)
        } else {
          console.log(`${chalk.blue(dir)} is ${stat}`)
        }
      }
    }

    recur(projectDir)
    const result = {
      fileCount
    }
    return result
  }
}

Object.freeze(FileUtil)
module.exports = FileUtil
