const chalk = require('chalk')

class OtherUtil {
    static parseUrl(url) {
        let name
        let fileName
        let fileFormat
        let host
        let organization
        let vcsProtocol

        const parsedAry = url.split('/')
        if (url.endsWith('.git')) {
            host = parsedAry[2]
            organization = parsedAry[3]
            name = _.last(parsedAry).replace('.git', '')
            vcsProtocol = 'git'
        } else if (url.endsWith('trunk')) {
            name = parsedAry[parsedAry.length - 2]
            vcsProtocol = 'svn'
        } else if (url.endsWith('.tar.gz')) {
            fileName = _.last(parsedAry)
            name = fileName.replace('.tar.gz', '')
            fileFormat = 'tar'
        } else {
            throw new Error(`${chalk.red(url)} is not parsed well`)
        }

        const result = {
            name,
            fileName,
            fileFormat,
            vcsProtocol,
            organization,
            host
        }

        return result
    }
}

Object.freeze(OtherUtil)
module.exports = OtherUtil
