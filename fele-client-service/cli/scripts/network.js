const {
  createDatabase,
  deleteDatabase,
  insertToDatabase,
} = require("../../utils/db");
const path = require("path");
const fs = require("fs");
const {
  createNetwork,
  deleteNetwork,
} = require("../../client-api/scripts/network");

const USER_WORKSPACE = "../../../tmpworkspaceforuser/";

async function useNetworkCLI(username, localOrg, networkName) {
  const { localUsers, felenetworks } = localOrg
  let feleUser = {}
  const localUserIndex = localUsers.findIndex((localUser) => (localUser.username === username));
  if(localUserIndex != -1) {
        const felenetworkIndex = felenetworks.findIndex((felenetwork) => felenetwork.felenetId === networkName);
        if(felenetworkIndex != -1) {
            const isMappingPresentForUser = felenetworks[felenetworkIndex].mappings.findIndex((mapping) => mapping.from === username);
            if(isMappingPresentForUser != -1) {
                feleUser.user = felenetworks[felenetworkIndex].mappings[isMappingPresentForUser].to
                const feleuserIndex = felenetworks[felenetworkIndex].feleusers.findIndex((feleuser) => (feleuser.feleuserId === feleUser.user))
                if(feleuserIndex != -1) {
                  feleUser.wallet = felenetworks[felenetworkIndex].feleusers[feleuserIndex].walletId
                }
                return feleUser
            }
            else console.log("You are not authorized to this network")
        }else{
            console.log("Network does not exist")
        }
    }
    return feleUser
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
