const { createChannel } = require('../../client-api/scripts/channel')
const { deleteChannel } = require('../../client-api/scripts/channel')
const {USER_WORKSPACE} = require('../../../globals')
const path = require('path')
const logger = require('../../utils/logger')


const createChannelfromCLI = async (networkName, channelConfig) => {
  if(channelConfig.includes(".json")) {
    const filePath = path.join(USER_WORKSPACE, channelConfig)
    console.log(filePath)
    channelConfig = require(filePath)
  } else {
    channelConfig = JSON.parse(channelConfig) 
  }
  const {message} = await createChannel(networkName, channelConfig)
  logger.info(message)
 
}
const deleteChannelfromCLI = async (networkName, channelName) => {
  const {message} = await deleteChannel(networkName, channelName)
  logger.info(message)
  }
  
module.exports = {
    createChannelfromCLI,
    deleteChannelfromCLI
}
