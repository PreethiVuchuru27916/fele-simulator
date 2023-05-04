const { createDatabase, deleteDatabase, insertToDatabase } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const { NETWORK_PREFIX, NETWORK_ID_PREFIX, GLOBAL_STATE } = require('../../utils/constants')
const { NETWORK_BASEPATH } = require('../../../globals')
const { v4: uuidv4 } = require('uuid')
const logger = require('../../utils/logger')
const CA = require('./ca')
const {addCertToWallet} = require('../../../fele-local-org/LocalOrganization')

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
    
    await createDatabase(database)

    // const adminCred = await CA.enrollUser({mspId: initiator.organization, enrollmentId: `${initiator.organization.toLowerCase()}.admin`})
    // const feleUser = `${initiator.organization.toLowerCase()}.admin`

    // networkConfig.administrator = feleUser

    await insertToDatabase(database, networkConfig)
    //const walletId = await addCertToWallet(feleUser, adminCred)
    //To create network folder under chaincode
    const dir = path.join(NETWORK_BASEPATH, networkName);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    return {
        networkId: networkConfig._id,
        networkName, 
        // initiator: {
        //     organization: initiator.organization,
        //     feleUser: `${initiator.organization.toLowerCase()}.admin`,
        //     credential: adminCred,
        //     walletId
        // }
    }
}

const useNetwork = (username, localOrg, networkName, channelName) => {
    console.log(GLOBAL_STATE);
    const { localUsers, feleNetworks } = localOrg
    const feleUser = {}
    const localUserIndex = localUsers.findIndex((localUser) => (localUser.username === username));
    if(localUserIndex != -1) {
          var felenetworkIndex = -1
          for(let i=0;i<feleNetworks.length; i++){
            if(feleNetworks[i].feleNetId == networkName){
                felenetworkIndex=i;
                break
            }
          }
          if(felenetworkIndex != -1) {
              feleUser.network = feleNetworks[felenetworkIndex];
              var felechannelIndex = -1
              for(let i=0;i<feleNetworks[felenetworkIndex].feleChannels.length; i++){
                if(feleNetworks[felenetworkIndex].feleChannels[i].channelName == channelName){
                    felechannelIndex=i;
                    break
                }
              }
              if(felechannelIndex != -1){
                feleUser.channel = feleNetworks[felenetworkIndex].feleChannels[felechannelIndex];
                var isMappingPresentForUser = -1
                for(let i=0;i<feleNetworks[felenetworkIndex].feleChannels[felechannelIndex].mappings.length;i++){
                    if(feleNetworks[felenetworkIndex].feleChannels[felechannelIndex].mappings[i].from === username){
                        isMappingPresentForUser=i;
                        break;
                    }
                }
                if (isMappingPresentForUser != -1) {
                    feleUser.user = feleNetworks[felenetworkIndex].feleChannels[felechannelIndex].mappings[isMappingPresentForUser].to
                    var feleuserIndex = -1
                    for(let i=0;i<feleNetworks[felenetworkIndex].feleChannels[felechannelIndex].feleUsers.length;i++){
                        if(feleNetworks[felenetworkIndex].feleChannels[felechannelIndex].feleUsers[i].feleuserId === feleUser.user){
                            feleuserIndex=i;
                            break;
                        }
                    }
                    if (feleuserIndex != -1) {
                        feleUser.wallet = feleNetworks[felenetworkIndex].feleChannels[felechannelIndex].feleUsers[feleuserIndex].walletId
                    }
                    return feleUser
                }
                else console.log("You are not authorized to this network")
              }
              else{
                console.log("Channel does not exist")
              }
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