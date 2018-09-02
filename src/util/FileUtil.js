class Cls {
  static removeExt (fileName) {
    return fileName.split('.')[0]
  }
}

Object.freeze(Cls)
module.exports = Cls
