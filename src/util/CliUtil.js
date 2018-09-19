const childProcess = require('child_process')

class Cls {
  static checkOption (option) {
    // const questionAry = []
    // const param = {}
    //
    // for (let key in option) {
    //   const question = option[key]
    //   const inputValue = argv[key]
    //   if (!inputValue) {
    //     const {default: defaultValue} = question
    //     if (defaultValue) {
    //       param[key] = defaultValue
    //     } else {
    //       question.name = key
    //       questionAry.push(question)
    //     }
    //   } else {
    //     param[key] = inputValue
    //   }
    // }
    // const {length} = questionAry
    // if (length) {
    //   const answer = await inquirer.prompt(questionAry)
    //
    //   _.merge(param, answer)
    // }
  }
  static killPort (...portAry) {
    for (let port of portAry) {
      const pid = Cls.getPid(port)
      childProcess.execSync(`kill ${pid}`)
    }
  }
  static getPid (port) {
    const output = childProcess.execSync(`
      lsof -i :${port}
    `).toString()
    const pid = output.split('\n')[1].split(' ').filter(ele => ele)[1]
    return pid
  }
}

Object.freeze(Cls)
module.exports = Cls
