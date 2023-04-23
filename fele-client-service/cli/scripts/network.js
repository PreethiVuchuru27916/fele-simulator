const {
  createNetwork,
  deleteNetwork,
  useNetwork
} = require("../../client-api/scripts/network");
const path = require('path')
const { USER_WORKSPACE } = require('../../../globals');
const logger = require('../../utils/logger');

async function useNetworkCLI(username, localOrg, networkName) {
  return useNetwork(username, localOrg, networkName)
}

async function createNetworkCLI(networkConfig, networkName) {
  if (networkConfig.includes(".json")) {
    const filePath = path.join(USER_WORKSPACE, networkConfig)
    networkConfig = require(filePath)
  } else {
    networkConfig = JSON.parse(networkConfig)
  }
  logger.info("after removing chars" + JSON.stringify(networkConfig));

  try {
    createNetwork(networkConfig, networkName);
  } catch (e) {
    logger.error(e.message)
  }
}

async function deleteNetworkCLI(networkName) {
  try {
    deleteNetwork(networkName);
  } catch (e) {
    logger.error(e.message)
  }
}

module.exports = {
  createNetworkCLI,
  deleteNetworkCLI,
  useNetworkCLI
};
