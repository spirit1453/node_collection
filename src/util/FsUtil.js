const fse = require('fs-extra')
const fs = require('fs')

const info = require('debug')('info')
const warn = require('debug')('warn')

class FsUtil {
    static removeSync(filePath, option = {}) {
        const {
            warnIfNotExist = false
        } = option
        if (fs.exists(filePath)) {
            fse.removeSync(filePath)
            info(`${filePath} has been removed`)
        } else {
            if (warnIfNotExist) {
                warn((`${filePath} does not exist`))
            }
        }
    }
}

module.exports = FsUtil
