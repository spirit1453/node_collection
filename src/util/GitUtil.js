/* eslint-disable global-require */

class GitUtil {
  static deleteBr (param) {
    'sdfsdf'
  }
  static getCurrentBranch (rootFolder) {
    return new Promise((resolve, reject) => {
      const simpleGit = require('simple-git')(rootFolder)

      simpleGit.branch((err, obj) => {
        if (err) {
          reject(err)
        }
        const {current, all} = obj
        const result = {
          name: current,
          hasRemote: all.includes(`remotes/origin/${current}`),
          hasOrigin: all.some(ele => ele.startsWith('remotes/origin/'))
        }
        resolve(result)
      })
    })
  }
}

Object.freeze(GitUtil)

module.exports = GitUtil
