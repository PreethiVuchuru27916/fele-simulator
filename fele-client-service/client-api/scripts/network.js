const { createDatabase, deleteDatabase, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');

var dbPrefix = "fele__"
var chaincodeDirectory = "../../../chaincode/"

const createNetwork = async(networkConfigJSON, networkName) => {
    const database = dbPrefix+networkName
    const databaseCreated = await createDatabase(database)
    
    if(databaseCreated) insertToDatabase(database, JSON.parse(networkConfigJSON));
    //To create network folder under chaincode
    var dir = chaincodeDirectory+networkName
    dir = path.join(__dirname, dir);
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    } catch (err) {
        return false
    }
    return true
}

const useNetwork = (username, localOrg, networkName) => {
  const { localUsers, felenetworks } = localOrg
  const feleUser = {}
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

const deleteNetwork = async(networkName) => {
    const databaseName = "fele__"+networkName
    return await deleteDatabase(databaseName)   
}

module.exports = {
    createNetwork,
    useNetwork,
    deleteNetwork
}