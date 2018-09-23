const axios = require('axios')
const url = require('url')

class GitHubUtil {
  static getRecentCommit (option) {
    return new Promise(resolve => {
      const {branch, repo, owner} = option
      const query = {}
      if (branch) {
        query.sha = branch
      }
      const urlStr = url.format({
        protocol: 'https',
        hostname: 'api.github.com',
        pathname: `/repos/${owner}/${repo}/commits`,
        query
      })
      ;(async () => {
        const res = await axios.get(urlStr)
        const recentCommit = res.data[0]
        const {sha, commit} = recentCommit
        const {committer} = commit
        const {date, message} = committer
        let result = {
          sha,
          date: new Date(date),
          message
        }
        resolve(result)
      })()
    })
  }
}

Object.freeze(GitHubUtil)
module.exports = GitHubUtil
