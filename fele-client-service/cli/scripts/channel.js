const { createChannel } = require('../../client-api/scripts/channel')
const {USER_WORKSPACE} = require('../../../globals')
const path = require('path')


const createChannelfromCLI = async (networkName, channelConfig) => {
  if(channelConfig.includes(".json")) {
    const filePath = path.join(USER_WORKSPACE, channelConfig)
    channelConfig = require(filePath)
  } else {
    channelConfig = JSON.parse(channelConfig) 
  }
  await createChannel(networkName, channelConfig)
 
}

module.exports = {
    createChannelfromCLI
}
