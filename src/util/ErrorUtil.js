
class Cls {
  static processGlobal (rejectionHandler, exceptionHandler) {
    process.on('unhandledRejection', (err) => {
      rejectionHandler(err)
    })

    process.on('uncaughtException', (err) => {
      exceptionHandler(err)
    })
  }
}

Object.freeze(Cls)
module.exports = Cls
