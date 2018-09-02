
const path = require('path')
const rootPath = path.resolve(__dirname, '../../')
const ModuleUtil = require(path.resolve(rootPath, 'src/util/ModuleUtil'))
const {requireAll, installGit} = ModuleUtil
const resourceFolder = path.resolve(rootPath, 'test/resource')
const fse = require('fs-extra')
const childProcess = require('child_process')

test('ModuleUtil requireAll', () => {
  const result = requireAll(path.resolve(resourceFolder, 'ModuleUtil'))
  expect(result.obj.a).toBe(12)
  expect(result.obj2.b).toBe(12)
})

test('ModuleUtil installGit', () => {
  const installGitFolder = path.resolve(resourceFolder, 'installGit')
  fse.removeSync(path.resolve(installGitFolder, 'node_modules'))
  expect(async () => {
    await installGit(path.resolve(installGitFolder, 'package.json'))
    childProcess.execSync(`
    node ${path.resolve(installGitFolder, 'dosth.js')}
  `)
  }).not.toThrow()
})
