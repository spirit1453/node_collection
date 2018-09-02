const path = require('path')
const rootPath = path.resolve(__dirname,'')
const srcFolder = path.resolve(rootPath,'src')
const docFolder = path.resolve(rootPath,'local/doc')

const esdoc = {
    "source": srcFolder,
    "destination": docFolder,
    "plugins": [
        {"name": "esdoc-standard-plugin"}
    ]
}

Object.freeze(esdoc)
module.exports = esdoc
