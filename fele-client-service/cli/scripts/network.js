const {
  createNetwork,
  deleteNetwork,
  useNetwork
} = require("../../client-api/scripts/network");

const { USER_WORKSPACE } = require('../../../globals');

async function useNetworkCLI(username, localOrg, networkName) {
  return useNetwork(username, localOrg, networkName)
}

async function createNetworkCLI(networkConfig, networkName) {
  if (networkConfig.includes(".json")) {
    //When networkConfig is a file
    const fileName = USER_WORKSPACE + networkConfig;
    networkConfig = require(fileName); //Get contents of file as object
    networkConfig = JSON.stringify(networkConfig); //Convert object to string
  } else {
    networkConfig = networkConfig.replace(/\\/g, "");
  }
  logger.info("after removing chars" + networkConfig);

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
