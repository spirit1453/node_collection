/* eslint-disable no-console,no-process-exit */

class ErrorUtil {
  static exitOnUnexpected () {
    process.on('uncaughtException', (err) => {
      console.log({uncaughtException: err})
      process.exit(1)
    })
    process.on('unhandledRejection', (err) => {
      console.log({
        unhaledRejection: err
      })
      process.exit(1)
    })
  }
}

Object.freeze(ErrorUtil)
module.exports = ErrorUtil
