const fse = require('fs-extra')
const path = require('path')
const {execSync} = require('child_process')
const fs = require('fs')
const chalk = require('chalk')
const ignore = require('ignore')
const {isBinaryFileSync} = require("isbinaryfile")

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

  static async scan(option) {
    let fileCount = 0
    let folderCount = 0
    let binaryFileCount = 0
    let textFileCount = 0
    let symbolicCount = 0
    let unknownCount = 0

    const {projectDir, handleFileFunc, ignoreOptionAry = []} = option

    const ignorePath = path.resolve(projectDir, '.gitignore')
    let ig

    if (fs.existsSync(ignorePath)) {
      ig = GitUtil.getIgnore(ignorePath)
    } else {
      ig = ignore()
    }

    ignoreOptionAry.forEach(ele => {
      ig.add(ele)
    })

    const recur = async (dir) => {
      const relPath = path.relative(projectDir, dir)
      const shouldScan = (dir === projectDir || !ig.ignores(relPath)) && relPath !== '.git'
      if (shouldScan) {
        // do not follow link
        const stat = fs.lstatSync(dir)
        if (stat.isDirectory()) {
          folderCount++

          let handleFolderResult
          if (handleFileFunc) {
            handleFolderResult =  await handleFileFunc(dir, {
              isFolder: true,
            })
          }

          if (!(handleFolderResult !== undefined && handleFolderResult === false)) {
            for(let ele of fs.readdirSync(dir)){
              const elePath = path.resolve(dir, ele)
              await recur(elePath)
            }
          }
        } else if (stat.isFile()) {
          const isBinary = isBinaryFileSync(dir)
          if (isBinary) {
            binaryFileCount++
          } else {
            textFileCount++
          }
          fileCount++
          if (handleFileFunc) {
            await handleFileFunc(dir, {
              isFile: true,
              isBinary
            })
          }
        } else {
          if (stat.isSymbolicLink() ) {
            symbolicCount++
          } else {
            unknownCount++
          }
          // console.log(`${chalk.blue(dir)} is ${stat.isSymbolicLink() ? 'symbolic link' : 'unknown'}`)
        }
      }
    }

    await recur(projectDir)
    const result = {
      fileCount,
      folderCount,
      binaryFileCount,
      textFileCount,
      symbolicCount,
      unknownCount
    }
    return result
  }

  static getContent(filePath) {
    return fs.readFileSync(filePath).toString().trim()
  }
}

Object.freeze(FileUtil)
module.exports = FileUtil
