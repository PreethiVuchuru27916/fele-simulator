const {
  createNetwork,
  deleteNetwork,
  useNetwork
} = require("../../client-api/scripts/network");

const {USER_WORKSPACE} = require('../../../globals');

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
  console.log("after removing chars" + networkConfig);
  createNetwork(networkConfig, networkName);
}

async function deleteNetworkCLI(networkName) {
  deleteNetwork(networkName);
}

module.exports = {
  createNetworkCLI,
  deleteNetworkCLI,
  useNetworkCLI
};
