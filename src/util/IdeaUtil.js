const assert = require('assert')
const axios = require('axios')

class IdeaUtil {
    static async getVersionInfo (option = {}) {
        const {
            code, //the product name
            latest, // just get lastest release
        } = option
        assert(code, 'code must be specified in option')
        const urlBasen = 'https://data.services.jetbrains.com/products/releases'
        const url = `${urlBasen}?code=${code}&latest`
        const response = await axios.get(url)
        const {data} = response
        
        return data[code][0]
    }

    static getPlatformMap() {
        return {
            darwin: 'mac'
        }
    }
}

module.exports = IdeaUtil