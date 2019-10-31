const path = require('path')
const fs = require('fs')
const verbose = require('debug')('verbose')
const childProcess = require('child_process')

const CmdUtil = require('../util/CmdUtil')
const SystemUtil = require('./SystemUtil')
// const brewConfig = require('../../../config/brewConfig')

class BrewUtil {
  static install(key) {
    if (SystemUtil.isMac()) {
      const obj = brewConfig[key]
      BrewUtil.installByConfig(obj, key)
    }
  }

  static installByConfig(config, key) {
    const appPath = path.resolve('/Applications', `${config.appName}.app`)

    if (!fs.existsSync(appPath) && !BrewUtil.isBrewInstalledByConfig(config, key)) {
      CmdUtil.execSync(`brew ${config.isGUI?'cask ':''}install ${config.brewId || key}`)
    } else {
      verbose(`${config.appName || config.brewId || key} has been installed at Application`)
    }
  }

  static isBrewInstalled(key) {
   const config = brewConfig[key]
    return BrewUtil.isBrewInstalledByConfig(config, key)
  }

  static isBrewInstalledByConfig(config, key) {
    const {brewId, isGUI} = config
    let result = true
    try {
      childProcess.execSync(`brew ${isGUI?'cask':''} list ${brewId || key}`)
    } catch (err) {
      result = false
    }
    return result
  }
}

Object.freeze(BrewUtil)
module.exports = BrewUtil
