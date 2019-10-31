const os = require('os')

const CmdUtil = require('./CmdUtil')

class SystemUtil{
    static isMac() {
        return os.platform() === 'darwin'
    }

    static isLinux() {
        return os.platform() === 'linux'
    }

    static isWindows() {
        return os.platform() === 'win32'
    }

    static getWinDiskList() {
        if (SystemUtil.isWindows()) {
            const info = CmdUtil.getCmdResult(`wmic logicaldisk get name`)
            const result = info.split('\n').map(ele => ele.trim().replace(':', '')).slice(1)
            return result
        } else {
            console.error(`getWinDiskList can only be invoked in windows, you are at ${os.platform()} system`)
        }
    }
}

module.exports = SystemUtil
