const { createHash } = require('crypto')

const sha256 = (content) => {  
    return createHash('sha256').update(content).digest('hex')
}

module.exports = {
    sha256
}