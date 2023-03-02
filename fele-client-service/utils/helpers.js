const { createHash } = require('crypto')

const sha256 = (content) => {  
    return createHash('sha256').update(content).digest('hex')
}

const getChannelSelector = (channelName) => {
    return {
        selector: {
            channelName: {
                $eq: channelName
            }
        }     
    }
}
module.exports = {
    sha256,
    getChannelSelector
}