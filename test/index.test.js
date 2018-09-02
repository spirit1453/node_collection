/* eslint-disable global-require */

const path = require('path')
const rootPath = path.resolve(__dirname, '../')

test('', () => {
  expect(() => {
    require(rootPath)
  }).not.toThrow()
})
