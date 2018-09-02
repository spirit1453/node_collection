const path = require('path')
const rootPath = path.resolve(__dirname, '../../')
const GitUtil = require(path.resolve(rootPath, 'src/util/GitUtil'))

const {deleteBr} = GitUtil

test('GitUtil.', () => {
  expect(deleteBr).not.toThrow()
})
