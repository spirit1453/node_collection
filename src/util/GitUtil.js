/* eslint-disable global-require */
const uuid = require('uuid')
const childProcess = require('child_process')

class GitUtil {
  static deleteBr (param) {

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

  static getGitLogInfo(option) {
    const {projectDir, relPath} = option
    const seperator = uuid()
    const obj = {
      hash: {
        code: '%H'
      },
      time: {
        code: '%cD',
        process(ele){
          return new Date(ele)
        }
      },
      msg: {
        code: '%s'
      }
    }
    const ary = []
    for(let key in obj) {
      const value = obj[key]
      const {code} = value
      ary.push(code)
    }

    const formatStr = ary.join(seperator)

    const cmd = `git log --format=format:"${formatStr}" ${relPath} `
    const str = childProcess.execSync(cmd, {
      cwd: projectDir
    }).toString()
    const resultAry = []

    str.split('\n').forEach(record => {
      const trimmed = record.trim()
      if (trimmed) {
        const parsedAry = trimmed.split(seperator)


        const resultObj = {}
        const keyAry = Object.keys(obj)
        for (let i = 0; i < keyAry.length; i ++) {
          const ele = keyAry[i]
          const processFunc = obj[ele].process
          let value = parsedAry[i]
          if (processFunc) {
            value = processFunc(value)
          }
          resultObj[ele] = value
        }
        resultAry.push(resultObj)
      }
    })

    return resultAry
  }
}

Object.freeze(GitUtil)

module.exports = GitUtil
