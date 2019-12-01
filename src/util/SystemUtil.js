const os = require('os')


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
}

module.exports = SystemUtil
