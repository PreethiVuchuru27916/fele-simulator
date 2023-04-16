const { createChannel, deleteChannel, addFeleUsersInChannel } = require('../../client-api/scripts/channel')
const { USER_WORKSPACE } = require('../../../globals')
const path = require('path')
const logger = require('../../utils/logger')

const createChannelCLI = async (networkName, channelConfig) => {
  if (channelConfig.includes(".json")) {
    const filePath = path.join(USER_WORKSPACE, channelConfig)
    channelConfig = require(filePath)
  } else {
    channelConfig = JSON.parse(channelConfig)
  }
  try {
    const { message } = await createChannel(networkName, channelConfig)
    logger.info(message)
  } catch (e) {
    logger.error(e.message)
  }
}

const deleteChannelCLI = async (networkName, channelName) => {
  try {
    const { message } = await deleteChannel(networkName, channelName)
    logger.info(message)
  } catch (e) {
    logger.error(e.message)
  }
}

const addFeleUsersInChannelCLI = async (networkName, channelName, orgName, feleUsers) => {
  try {
    const { message } = await addFeleUsersInChannel(networkName, channelName, orgName, feleUsers)
    logger.info(message)
  } catch (e) {
    logger.error(e.message)
  }
}

module.exports = {
  createChannelCLI,
  deleteChannelCLI,
  addFeleUsersInChannelCLI
}
