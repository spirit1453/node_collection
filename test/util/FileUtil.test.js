const path = require('path')
const rootPath = path.resolve(__dirname, '../../')
const FileUtil = require(path.resolve(rootPath, 'src/util/FileUtil'))
const {removeExt} = FileUtil

test('CommonUtil removeExt', () => {
  expect(removeExt('dosth.js')).toBe('dosth')
  expect(removeExt('dosth')).toBe('dosth')
  expect(removeExt('.dosth')).toBe('')
})
