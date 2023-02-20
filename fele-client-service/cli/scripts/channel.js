const { createChannel } = require('../../client-api/scripts/channel')
const USER_WORKSPACE = "../../../tmpworkspaceforuser/"

const createChannelfromCLI = async (networkName, channelConfig) => {
  if(channelConfig.includes(".json")) {
    const fileName = USER_WORKSPACE+channelConfig;
    console.log(fileName)
    channelConfig = require(fileName)
  } else {
    channelConfig = JSON.parse(channelConfig) 
  }
  await createChannel(networkName, channelConfig)
 
}

module.exports = {
    createChannelfromCLI
}
