const fs = require('fs')

module.exports = removeFile = (path) => {
    fs.unlinkSync(path)
}