const { createDatabase, deleteDatabase, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const { NETWORK_PREFIX, NETWORK_ID_PREFIX, GLOBAL_STATE } = require('../../utils/constants')
const { NETWORK_BASEPATH } = require('../../../globals')
const { v4: uuidv4 } = require('uuid')
const logger = require('../../utils/logger');

const createNetwork = async (networkConfig, networkName) => {
    const database = NETWORK_PREFIX + networkName
    const timestamp = new Date().toISOString()
    networkConfig = {
        _id: NETWORK_ID_PREFIX + uuidv4(),
        fmt: "Network",
        created_at: timestamp,
        updated_at: timestamp,
        ...networkConfig
    }
    try{
        await createDatabase(database)
        await insertToDatabase(database, networkConfig)
        //To create network folder under chaincode
        const dir = path.join(NETWORK_BASEPATH, networkName);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }
    catch(err){
        logger.error(err);
    }
}

const useNetwork = (username, localOrg, networkName) => {
  console.log(GLOBAL_STATE);
  const { localUsers, felenetworks } = GLOBAL_STATE.localOrg
  const feleUser = {}
  const localUserIndex = localUsers.findIndex((localUser) => (localUser.username === username));
  if(localUserIndex != -1) {
        const felenetworkIndex = felenetworks.findIndex((felenetwork) => felenetwork.felenetId === networkName);
        if(felenetworkIndex != -1) {
            feleUser.network = felenetworks[felenetworkIndex];
            const isMappingPresentForUser = felenetworks[felenetworkIndex].mappings.findIndex((mapping) => mapping.from === username);
            if (isMappingPresentForUser != -1) {
                feleUser.user = felenetworks[felenetworkIndex].mappings[isMappingPresentForUser].to
                const feleuserIndex = felenetworks[felenetworkIndex].feleusers.findIndex((feleuser) => (feleuser.feleuserId === feleUser.user))
                if (feleuserIndex != -1) {
                    feleUser.wallet = felenetworks[felenetworkIndex].feleusers[feleuserIndex].walletId
                }
                return feleUser
            }
            else console.log("You are not authorized to this network")
        } else {
            console.log("Network does not exist")
        }
    }
    return feleUser
}

const deleteNetwork = async (networkName) => {
    const databaseName = NETWORK_PREFIX + networkName
    await deleteDatabase(databaseName)
}

module.exports = {
    createNetwork,
    useNetwork,
    deleteNetwork
}