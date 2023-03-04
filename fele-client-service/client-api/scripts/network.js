const { createDatabase, deleteDatabase, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
<<<<<<< HEAD
const { GLOBAL_STATE } = require('../../utils/constants');
=======
const { NETWORK_PREFIX } = require('../../utils/constants')
const { NETWORK_BASEPATH } = require('../../../globals')
>>>>>>> d8b6eb3e00ff31e35efc726b80482b2c16244014

const createNetwork = async (networkConfigJSON, networkName) => {
    const database = NETWORK_PREFIX + networkName
    await createDatabase(database)
    await insertToDatabase(database, JSON.parse(networkConfigJSON))
    //To create network folder under chaincode
    const dir = path.join(NETWORK_BASEPATH, networkName);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

const useNetwork = (username, localOrg, networkName) => {
<<<<<<< HEAD
  console.log(GLOBAL_STATE);
  const { localUsers, felenetworks } = GLOBAL_STATE.localOrg
  const feleUser = {}
  const localUserIndex = localUsers.findIndex((localUser) => (localUser.username === username));
  if(localUserIndex != -1) {
        const felenetworkIndex = felenetworks.findIndex((felenetwork) => felenetwork.felenetId === networkName);
        if(felenetworkIndex != -1) {
            feleUser.network = felenetworks[felenetworkIndex];
=======
    const { localUsers, felenetworks } = localOrg
    const feleUser = {}
    const localUserIndex = localUsers.findIndex((localUser) => (localUser.username === username));
    if (localUserIndex != -1) {
        const felenetworkIndex = felenetworks.findIndex((felenetwork) => felenetwork.felenetId === networkName);
        if (felenetworkIndex != -1) {
>>>>>>> d8b6eb3e00ff31e35efc726b80482b2c16244014
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